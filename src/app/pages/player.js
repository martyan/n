import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import {
    getPlayer,
    getPlayerSchedule,
    getTeams,
    setPlayerSkeletonVisible,
    getGame,
    setActiveMedia,
    setUIVisible,
    getPlayerHistory
} from '../lib/app/actions'
import NavBar from '../components/NavBar'
import { setScrollDir } from '../helpers/UI'
import {
    PlayerHeader,
    PlayerHistory,
    PlayerInfo,
    PlayerSkeleton
} from '../components/PlayerComponents'
import PlayerStats from '../components/PlayerStats'
import Game from '../components/Game'
import LoadMore from '../components/LoadMore'
import { getPlayersMedia} from '../helpers/data'
import './index.scss'

const PlayerPage = ({
    playerId,
    player,
    teams,
    getPlayer,
    getTeams,
    games,
    history,
    UIVisible,
    setUIVisible,
    getPlayerSchedule,
    playerSchedule,
    playerSkeletonVisible,
    setPlayerSkeletonVisible,
    getGame,
    activeMedia,
    setActiveMedia,
    getPlayerHistory,
    playerHistory
}) => {

    const [ loadedContentIndex, setLoadedContentIndex ] = useState(0)
    const [ gameSchedule, setGameSchedule ] = useState([])

    const gamesToLoadAmount = 5

    const getGameIDsToLoad = (start, end) =>
        playerSchedule
            .slice(start, end)
            .map(game => game.game.gamePk)

    const getNotLoadedGameIds = (gameIDsToLoad) =>
        gameIDsToLoad
            .filter(gameId => !games.find(game => String(game.gamePk) === String(gameId)))

    const getGamesBatch = (gameIDsToLoad) =>
        gameIDsToLoad
            .map(gameId => games.find(game => String(game.gamePk) === String(gameId)))

    const getGamesWithRelatedContent = (gamesBatch, player) =>
        gamesBatch
            .filter(game => getPlayersMedia(player, game.content.highlights.scoreboard.items).length > 0)

    const loadMore = () => {
        const nextIndex = (loadedContentIndex + gamesToLoadAmount <= playerSchedule.length) ? loadedContentIndex + gamesToLoadAmount : playerSchedule.length

        const gameIDsToLoad = getGameIDsToLoad(loadedContentIndex, nextIndex)
        const notLoadedGameIDs = getNotLoadedGameIds(gameIDsToLoad)

        //load only not loaded games
        notLoadedGameIDs.map(gameId => getGame(gameId))

        if(notLoadedGameIDs.length === 0) {
            console.error('BATCH IS ALREADY LOADED IN STORE')

            const gamesBatch = getGamesBatch(gameIDsToLoad)
            const gamesWithRelatedContent = getGamesWithRelatedContent(gamesBatch, player)

            setGameSchedule([...gameSchedule, ...gamesWithRelatedContent])
        }

        setLoadedContentIndex(nextIndex)
    }

    const gamesBatchLoaded = (gamesBatch) => {
        const batchChecklist = gamesBatch.map(game => !!game)
        const batchLoaded = batchChecklist.every(gameLoaded => gameLoaded === true)

        return batchLoaded
    }

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }
    }, [])

    useEffect(() => {
        if(!player || playerId !== player.id) {
            //reset indexes on player change
            setLoadedContentIndex(0)
            setActiveMedia(0)
            setGameSchedule([])

            //load dependencies
            Promise
                .all([
                    getPlayer(playerId),
                    getPlayerSchedule(playerId)
                ])
                .then(() => {
                    setPlayerSkeletonVisible(false)
                })
                .catch(console.error)
        }
    }, [playerId])

    useEffect(() => {
        if(playerSchedule.length > 0 && player !== null) {
            console.error('LOAD MORE triggered when PLAYER SCHEDULE LOADED')
            loadMore(playerSchedule)
        }
    }, [player, playerSchedule])

    useEffect(() => {
        if(player !== null && (player.hasOwnProperty('isActive') && !player.isActive)) {
            getPlayerHistory(playerId)
        }
    }, [player])

    useEffect(() => {

        if(player && games.length > 0) {

            const gameIDsToLoad = getGameIDsToLoad(loadedContentIndex - gamesToLoadAmount, loadedContentIndex)
            const gamesBatch = getGamesBatch(gameIDsToLoad)

            if(gamesBatch.length > 0 && gamesBatchLoaded(gamesBatch)) {
                const gamesWithRelatedContent = getGamesWithRelatedContent(gamesBatch, player)

                if(gamesWithRelatedContent.length === 0) loadMore(playerSchedule)
                else setGameSchedule([...gameSchedule, ...gamesWithRelatedContent])
            }

        }

    }, [player, games])

    const noMore = loadedContentIndex === playerSchedule.length
    const notLoaded = !player || String(player.id) !== String(playerId)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded">

                <PlayerSkeleton playerSkeletonVisible={!player || playerSkeletonVisible} />

                <div className="player-feed">
                    {!notLoaded && (
                        <>
                            <PlayerHeader player={player} />

                            <PlayerInfo player={player} />

                            {/*<SubscribeBtn />*/}

                            <PlayerStats player={player} />

                            <PlayerHistory history={playerHistory} getPlayerSchedule={season => getPlayerSchedule(playerId, season)} />

                            {/*<Rankings player={player} />*/}

                            {gameSchedule.map((game, i) => (
                                <div key={`PF_${game.gamePk}_${i}`} className="game">
                                    <Game
                                        game={game}
                                        gameContent={game.content}
                                        player={player}
                                        teams={teams}
                                        activeMedia={activeMedia}
                                        setActiveMedia={setActiveMedia}
                                        date={game.gameDate}
                                        playerOnly
                                    />
                                </div>
                            ))}

                            {!noMore && <LoadMore loadMore={() => loadMore(playerSchedule)} />}
                        </>
                    )}
                </div>

                <NavBar visible={UIVisible} history={history} />

            </div>
        </PageWrapper>
    )

}

PlayerPage.getInitialProps = async ({ store, query }) => {
    // await store.dispatch(getProduct(query.id))
    return {
        playerId: query.id
    }
}

PlayerPage.propTypes = {
}

const mapStateToProps = (state) => ({
    player: state.app.player,
    teams: state.app.teams,
    playerSkeletonVisible: state.app.playerSkeletonVisible,
    playerSchedule: state.app.playerSchedule,
    games: state.app.games,
    activeMedia: state.app.activeMedia,
    history: state.app.history,
    UIVisible: state.app.UIVisible,
    playerHistory: state.app.playerHistory
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getPlayer,
        getTeams,
        getPlayerSchedule,
        setPlayerSkeletonVisible,
        getGame,
        setActiveMedia,
        setUIVisible,
        getPlayerHistory
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(PlayerPage)
