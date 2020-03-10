import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }
    }, [])

    useEffect(() => {
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

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <PlayerSkeleton playerSkeletonVisible={!player || playerSkeletonVisible} />

                <PlayerFeed
                    playerId={playerId}
                    player={player}
                    teams={teams}
                    playerSchedule={playerSchedule}
                    games={games}
                    getGame={getGame}
                    activeMedia={activeMedia}
                    setActiveMedia={setActiveMedia}
                />

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
