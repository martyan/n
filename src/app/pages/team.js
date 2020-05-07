import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import { getTeam, setTeam, getTeamStats, getTeamSchedule, getTeams, getStandings, setUIVisible } from '../lib/app/actions'
import { getLastGame, getNextGame, getTeamPlayedGames, getStats } from '../helpers/data'
import './index.scss'
import Schedule from '../components/Schedule'
import Roster from '../components/Roster'
import TeamStats from '../components/TeamStats'
import { setScrollDir } from '../helpers/UI'
import NavBar from '../components/NavBar'
import TeamHeader from '../components/TeamHeader'
import ScheduleOld from '../components/ScheduleOld'
import Standings from '../components/Standings'

const TeamPage = ({
    teamId,
    team,
    teams,
    setTeam,
    teamStats,
    teamSchedule,
    standings,
    getTeam,
    getTeams,
    getTeamStats,
    getTeamSchedule,
    getStandings,
    UIVisible,
    setUIVisible,
    history
}) => {

    const [ tab, setTab ] = useState('overview')

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(standings.length === 0) {
            getStandings()
                .catch(console.error)
        }

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }

        return () => setTeam(null)
    }, [])

    useEffect(() => {
        if(!team || team.id !== teamId) {
            getTeam(teamId)
                .catch(console.error)

            getTeamStats(teamId)
                .catch(console.error)

            getTeamSchedule(teamId)
                .catch(console.error)
        }
    }, [teamId])

    if(!team || !teamStats.length) return null

    const seasonStats = getStats('statsSingleSeason', teamStats)
    const rankingStats = getStats('regularSeasonStatRankings', teamStats)

    const lastGame = getLastGame(teamSchedule)
    const nextGame = getNextGame(teamSchedule)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <div className="team-feed">

                    <TeamHeader
                        team={team}
                        tab={tab}
                        setTab={setTab}
                    />

                    {tab === 'schedule' && <Schedule schedule={getTeamPlayedGames(teamSchedule)} teams={teams} />}

                    {(tab === 'roster' && seasonStats) && (
                        <Roster
                            roster={team.roster.roster}
                            gamesPlayed={seasonStats.gamesPlayed}
                        />
                    )}

                    {tab === 'overview' && <Standings standings={standings} teamId={parseInt(teamId)} teams={teams} />}

                    {false && (tab === 'overview' && (seasonStats || rankingStats)) && (
                        <TeamStats
                            rankingStats={rankingStats}
                            seasonStats={seasonStats}
                        />
                    )}

                    {false && tab === 'overview' && <ScheduleOld schedule={getTeamPlayedGames(teamSchedule)} teams={teams} />}

                </div>

                <NavBar visible={UIVisible} history={history} />

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
    teamSchedule: state.app.teamSchedule,
    standings: state.app.standings,
    UIVisible: state.app.UIVisible,
    history: state.app.history
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        setTeam,
        getTeam,
        getTeams,
        getTeamStats,
        getTeamSchedule,
        getStandings,
        setUIVisible
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(TeamPage)
