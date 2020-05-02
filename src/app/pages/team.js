import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import { getTeam, setTeam, getTeamStats, getTeamSchedule, getTeams, setUIVisible } from '../lib/app/actions'
import { getLastGame, getNextGame, getPlayedGames, getStats } from '../helpers/data'
import './index.scss'
import Schedule from '../components/Schedule'
import Roster from '../components/Roster'
import TeamStats from '../components/TeamStats'
import { goToTeamFeed } from '../helpers/navigation'
import colors from '../helpers/colors'
import { setScrollDir } from '../helpers/UI'
import NavBar from '../components/NavBar'
import TeamHeader from '../components/TeamHeader'
import ScheduleOld from '../components/ScheduleOld'

const TeamPage = ({
    teamId,
    team,
    teams,
    setTeam,
    teamStats,
    teamSchedule,
    getTeam,
    getTeams,
    getTeamStats,
    getTeamSchedule,
    UIVisible,
    setUIVisible,
    history
}) => {

    const [ tab, setTab ] = useState('schedule')

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }

        if(!team) {
            getTeam(teamId)
                .catch(console.error)

            getTeamStats(teamId)
                .catch(console.error)

            getTeamSchedule(teamId)
                .catch(console.error)
        }

        return () => {
            setTeam(null)
        }
    }, [])

    if(!team || !teamStats.length) return null

    const seasonStats = getStats('statsSingleSeason', teamStats)
    const rankingStats = getStats('regularSeasonStatRankings', teamStats)

    const lastGame = getLastGame(teamSchedule)
    const nextGame = getNextGame(teamSchedule)

    const color = colors.find(clr => clr.teamId === team.id)

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
                        color={color}
                        tab={tab}
                        setTab={setTab}
                    />

                    {tab === 'schedule' && <Schedule schedule={getPlayedGames(teamSchedule)} teams={teams} />}

                    {(tab === 'roster' && seasonStats) && (
                        <Roster
                            roster={team.roster.roster}
                            gamesPlayed={seasonStats.gamesPlayed}
                        />
                    )}

                    {(tab === 'overview' && (seasonStats || rankingStats)) && (
                        <TeamStats
                            rankingStats={seasonStats}
                            seasonStats={seasonStats}
                        />
                    )}
                    {tab === 'overview' && <ScheduleOld schedule={getPlayedGames(teamSchedule)} teams={teams} />}

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
        setUIVisible
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(TeamPage)
