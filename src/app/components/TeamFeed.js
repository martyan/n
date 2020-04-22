import React from 'react'
import moment from 'moment'
import Roster from './Roster'
import Schedule from './Schedule'
import TeamStats from './TeamStats'

export const getStats = (type, stats) => {
    if(!stats) return null

    const selected = stats.find(stat => stat.type.displayName === type)
    return (selected && selected.splits[0]) ? selected.splits[0].stat : null
}

export const getNextGame = (teamSchedule) => {
    const game = [...teamSchedule].find(game => game.date >= moment.utc().format('YYYY-MM-DD'))
    return game ? game.games[0] : null
}

export const getLastGame = (teamSchedule) => {
    const game = [...teamSchedule].reverse().find(game => game.date < moment.utc().format('YYYY-MM-DD'))
    return game ? game.games[0] : null
}

const TeamFeed = ({ team, teams, teamStats, teamSchedule }) => {

    const seasonStats = getStats('statsSingleSeason', teamStats)
    const rankingStats = getStats('regularSeasonStatRankings', teamStats)

    console.log(team)

    const lastGame = getLastGame(teamSchedule)
    const nextGame = getNextGame(teamSchedule)

    if(!team || !teamStats.length) return null

    return (
        <div className="team-feed">

            <div className="detail">
                <div className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${team.id}-dark.svg`} />
                </div>
                <div className="info">
                    <div className="name">{team.name}</div>
                    <div className="conference">{team.conference.name}/{team.division.name}</div>
                </div>
            </div>

            <Schedule schedule={teamSchedule} teams={teams} />

            {seasonStats && (
                <Roster
                    roster={team.roster.roster}
                    gamesPlayed={seasonStats.gamesPlayed}
                />
            )}

            {(seasonStats || rankingStats) && (
                <TeamStats
                    rankingStats={seasonStats}
                    seasonStats={seasonStats}
                />
            )}
        </div>
    )

}

export default TeamFeed
