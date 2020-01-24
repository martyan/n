import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import TeamFeed from '../components/TeamFeed'
import { getTeam, setTeam, getTeamStats, getTeamSchedule } from '../lib/app/actions'
import './index.scss'

const TeamPage = ({ teamId, team, setTeam, teamStats, teamSchedule, getTeam, getTeamStats, getTeamSchedule }) => {

    useEffect(() => {
        if(!team) {
            getTeam(teamId).catch(console.error)
            getTeamStats(teamId).catch(console.error)
            getTeamSchedule(teamId).catch(console.error)
        }

        return () => {
            setTeam(null)
        }
    }, [])

    if(!team) return null

    console.log(team)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <TeamFeed
                    team={team}
                    teamStats={teamStats}
                    teamSchedule={teamSchedule}
                />

            </div>
        </PageWrapper>
    )

}

TeamPage.getInitialProps = async ({ store, query }) => {
    // await store.dispatch(getProduct(query.id))
    return {
        teamId: query.id
    }
}

TeamPage.propTypes = {
}

const mapStateToProps = (state) => ({
    team: state.app.team,
    teams: state.app.teams,
    teamStats: state.app.teamStats,
    teamSchedule: state.app.teamSchedule
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        setTeam,
        getTeam,
        getTeamStats,
        getTeamSchedule
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(TeamPage)
