import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import { getGame, getTeams, setActiveMedia } from '../lib/app/actions'
import BackBtn from '../components/BackBtn'
import Game from '../components/Game'
import NavBar from '../components/NavBar'
import { setScrollDir } from '../helpers/UI'
import './index.scss'

const GamePage = ({ gameId, games, history, teams, getGame, getTeams, activeMedia, setActiveMedia }) => {

    const [ UIVisible, setUIVisible ] = useState(true)

    const game = games.find(game => String(game.gamePk) === gameId)
    const gameLoaded = !!game
    const teamsLoaded = teams.length > 0

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(!gameLoaded) {
            getGame(gameId)
                .catch(console.error)
        }

        if(!teamsLoaded) {
            getTeams()
                .catch(console.error)
        }
    }, [])

    if(!gameLoaded) return null

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded">

                <div className="game-feed">

                    <Game
                        game={game}
                        gameContent={game.content}
                        teams={teams}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                        date={game.gameDate}
                    />

                    <NavBar visible={UIVisible} history={history} />

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
    games: state.app.games,
    teams: state.app.teams,
    activeMedia: state.app.activeMedia,
    history: state.app.history
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getGame,
        getTeams,
        setActiveMedia
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(GamePage)
