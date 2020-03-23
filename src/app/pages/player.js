import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import PlayerFeed from '../components/PlayerFeed'
import {
    getPlayer,
    getPlayerSchedule,
    getTeams,
    setPlayerSkeletonVisible,
    getGame,
    setActiveMedia,
    setUIVisible
} from '../lib/app/actions'
import PlayerSkeleton from '../components/PlayerSkeleton'
import NavBar from '../components/NavBar'
import { setScrollDir } from '../helpers/UI'
import './index.scss'
import { PlayerHeader, PlayerInfo, Rankings } from '../components/PlayerComponents'
import PlayerStats from '../components/PlayerStats'
import Game from '../components/Game'
import LoadMore from '../components/LoadMore'
import { getPlayersMedia} from '../helpers/data'

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
    setActiveMedia
}) => {

    const scheduleRef = useRef([])
    const [ loadedContentIndex, setLoadedContentIndex ] = useState(0)
    const [ gameSchedule, setGameSchedule ] = useState([])

    const gamesToLoad = 5

    const loadMore = () => {
        console.log('load more')
        const nextIndex = (loadedContentIndex + gamesToLoad <= playerSchedule.length) ? loadedContentIndex + gamesToLoad : playerSchedule.length

        //load only not loaded games
        const gamesLoading = playerSchedule
            .slice(loadedContentIndex, nextIndex)
            .map(game => game.game.gamePk)
            .filter(gameId => !games.find(game => String(game.gamePk) === String(gameId)))
            .map(gameId => getGame(gameId))

        if(gamesLoading.length === 0) {
            console.error('BATCH IS ALREADY LOADED IN STORE')
            // setGameSchedule()
        }

        setLoadedContentIndex(nextIndex)
    }

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }
    }, [])

    useEffect(() => {
        //get player if not loaded or if changed
        if(!player || playerId !== player.id) {
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
        //reset indexes on player change
        setLoadedContentIndex(0)
        setActiveMedia(0)
    }, [player])

    useEffect(() => {

        if(playerSchedule.length > 0) {
            console.error('SCHEDULE LOADED ale load more nekdy jeste triggeruje INTERSECTION OBSERVER')
            loadMore()
        }

    }, [playerSchedule])

    useEffect(() => {

        if(player && games.length > 0) {

            const gameIds = playerSchedule.slice(loadedContentIndex - gamesToLoad, loadedContentIndex).map(game => game.game.gamePk)

            const batchGames = gameIds.map(gameId => games.find(game => game.gamePk === gameId))
            const batchChecklist = batchGames.map(game => !!game)
            const batchLoaded = batchChecklist.every(gameLoaded => gameLoaded === true)

            if(batchLoaded) {
                console.error('BATCH OF GAMES LOADED')
                const scheduleWithRelatedContent = batchGames.filter(game => getPlayersMedia(player, game.content.highlights.scoreboard.items).length > 0)

                if(scheduleWithRelatedContent.length === 0) loadMore()
                else setGameSchedule([...gameSchedule, ...scheduleWithRelatedContent])
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

            <div className="nhl">

                <PlayerSkeleton playerSkeletonVisible={!player || playerSkeletonVisible} />

                <div className="player-feed">
                    {!notLoaded && (
                        <>
                            <PlayerHeader player={player} />

                            <PlayerInfo player={player} />

                            <PlayerStats player={player} />

                            {/*<Rankings player={player} />*/}

                            {gameSchedule.map(game => (
                                <div key={`PF_${game.gamePk}`} className="game">
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

                            {!noMore && <LoadMore loadMore={loadMore} />}
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
    UIVisible: state.app.UIVisible
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getPlayer,
        getTeams,
        getPlayerSchedule,
        setPlayerSkeletonVisible,
        getGame,
        setActiveMedia,
        setUIVisible
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(PlayerPage)
