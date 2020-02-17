import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import { getGameContent, getGame, getTeams, setActiveMedia } from '../lib/app/actions'
import PlayerSkeleton from '../components/PlayerSkeleton'
import { getGameIdFromLink } from '../helpers/data'
import BackBtn from '../components/BackBtn'
import Game from '../components/Game'
import scrollDirObservable from 'scrolldir-observable'
import NavBar from '../components/NavBar'
import './index.scss'

const GamePage = ({ gameId, game, teams, gameContent, getGame, getGameContent, getTeams, activeMedia, setActiveMedia }) => {

    const [ UIVisible, setUIVisible ] = useState(true)

    // useEffect(() => {
    //     if(!player || playerId !== player.id) {
    //         Promise
    //             .all([
    //                 getPlayer(playerId),
    //                 getPlayerSchedule(playerId)
    //             ])
    //             .then((player) => {
    //                 setPlayerSkeletonVisible(false)
    //                 getTeamSchedule(player[0].people[0].currentTeam.id)
    //             }).catch(console.error)
    //     }
    // }, [playerId])

    const content = gameContent.find(game => getGameIdFromLink(game.link) === gameId)

    useEffect(() => {
        const scrollDir = scrollDirObservable(window.document)
        scrollDir.subscribe(dir => setUIVisible(dir === 'up'))

        getGame(gameId)
            .catch(console.error)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }

        if(!content) {
            getGameContent(gameId)
                .catch(console.error)
        }
    }, [])

    if(!game) return null

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded">

                <div className="game-feed">

                    <BackBtn visible={UIVisible} />

                    <Game
                        game={game}
                        gameContent={gameContent.find(content => getGameIdFromLink(content.link) === gameId)}
                        teams={teams}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                        date={game.periods[0].startTime}
                    />

                    <NavBar visible={UIVisible} />

                </div>

            </div>
        </PageWrapper>
    )

}

GamePage.getInitialProps = async ({ store, query }) => {
    // await store.dispatch(getProduct(query.id))
    return {
        gameId: query.id
    }
}

GamePage.propTypes = {
}

const mapStateToProps = (state) => ({
    game: state.app.game,
    gameContent: state.app.gameContent,
    teams: state.app.teams,
    activeMedia: state.app.activeMedia
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getGame,
        getGameContent,
        getTeams,
        setActiveMedia
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(GamePage)
