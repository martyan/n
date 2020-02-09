import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import PlayerFeed from '../components/PlayerFeed'
import { getPlayer, getPlayerSchedule, getTeams, setPlayerSkeletonVisible, getGameContent, getTeamSchedule } from '../lib/app/actions'
import PlayerSkeleton from '../components/PlayerSkeleton'
import moment from 'moment'
import './index.scss'

const PlayerPage = ({
    playerId,
    player,
    teams,
    getPlayer,
    getTeams,
    getPlayerSchedule,
    getTeamSchedule,
    playerSchedule,
    teamSchedule,
    playerSkeletonVisible,
    setPlayerSkeletonVisible,
    gameContent,
    getGameContent
}) => {

    useEffect(() => {
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
                .then((player) => {
                    setPlayerSkeletonVisible(false)
                    getTeamSchedule(player[0].people[0].currentTeam.id)
                }).catch(console.error)
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
                    teamSchedule={teamSchedule.filter(schedule => schedule.games[0].status.abstractGameState === 'Final' && schedule.date <= moment.utc().format('YYYY-MM-DD')).reverse()}
                    gameContent={gameContent}
                    getGameContent={getGameContent}
                />

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
    gameContent: state.app.gameContent,
    teamSchedule: state.app.teamSchedule
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getPlayer,
        getTeams,
        getPlayerSchedule,
        setPlayerSkeletonVisible,
        getGameContent,
        getTeamSchedule
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(PlayerPage)
