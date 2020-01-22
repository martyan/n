import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import React from 'react'
import Roster from './Roster'

export const getStats = (type, stats) => {
    const selected = stats.find(stat => stat.type.displayName === type)
    return (selected && selected.splits[0]) ? selected.splits[0].stat : null
}

const TeamFeed = ({ teamId, onPlayerClick }) => {

    const [ team, setTeam ] = useState(null)
    const [ stats, setStats ] = useState([])
    const [ schedule, setSchedule ] = useState([])

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${teamId}?hydrate=roster(person(stats(splits=statsSingleSeason)))`)
            .then(response => setTeam(response.data.teams[0]))
            .catch(console.error)

        axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${teamId}/stats`)
            .then(response => setStats(response.data.stats))
            .catch(console.error)

        axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${teamId}&startDate=${moment().subtract(7, 'days').format('YYYY-MM-DD')}&endDate=${moment().add(1, 'month').format('YYYY-MM-DD')}`)
            .then(response => setSchedule(response.data.dates))
            .catch(console.error)

        // axios.get(`https://statsapi.web.nhl.com/api/v1/game/2019020755/feed/live`)
        //     .then(console.log)
        //     .catch(console.error)
    }, [])

    const getNextGame = () => {
        const game = [...schedule].reverse().find(game => game.date > moment().format('YYYY-MM-DD'))
        return game ? game.games[0] : null
    }

    const getLastGame = () => {
        const game = [...schedule].reverse().find(game => game.date < moment().format('YYYY-MM-DD'))
        return game ? game.games[0] : null
    }

    const seasonStats = getStats('statsSingleSeason', stats)
    const rankingStats = getStats('regularSeasonStatRankings', stats)

    console.log(team)

    const lastGame = getLastGame()
    const nextGame = getNextGame()

    if(!team || !stats.length) return null

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

            {(lastGame && nextGame) && (
                <div className="schedule">
                    <div className="game last">
                        <div className="teams">
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${lastGame.teams.home.team.id}-dark.svg`} />
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${lastGame.teams.away.team.id}-dark.svg`} />
                        </div>
                        <div className="score">
                            {lastGame.teams.home.score}:{lastGame.teams.away.score}
                        </div>
                    </div>
                    <div className="game next">
                        <div className="teams">
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${nextGame.teams.home.team.id}-dark.svg`} />
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${nextGame.teams.away.team.id}-dark.svg`} />
                        </div>
                        <div className="date">
                            {moment(nextGame.gameDate).format('MMM DD')}
                        </div>
                    </div>
                </div>
            )}

            {seasonStats && (
                <Roster
                    roster={team.roster.roster}
                    gamesPlayed={seasonStats.gamesPlayed}
                    onClick={onPlayerClick}
                />
            )}

            {(seasonStats || rankingStats) && (
                <div className="team-standings">
                    <table>
                        <thead>
                        <tr>
                            <td><span>Games played</span></td>
                            <td><span>Wins</span></td>
                            <td><span>Losses</span></td>
                            <td><span>Overtime</span></td>
                            <td><span>Points</span></td>
                            <td><span>Goals per game</span></td>
                            <td><span>Goals against per game</span></td>
                            <td><span>Power play %</span></td>
                            <td><span>Power play goals</span></td>
                            <td><span>Power play goals against</span></td>
                            <td><span>Power play opportunities</span></td>
                            <td><span>Penalty kill %</span></td>
                            <td><span>Shots per game</span></td>
                            <td><span>Shots allowed</span></td>
                            <td><span>Win score first</span></td>
                            <td><span>Win opp score first</span></td>
                            <td><span>Win lead first per</span></td>
                            <td><span>Win lead second per</span></td>
                            <td><span>Win outshoot opp</span></td>
                            <td><span>Win outshoot by opp</span></td>
                            <td><span>Face-offs taken</span></td>
                            <td><span>Face-offs won</span></td>
                            <td><span>Face-offs lost</span></td>
                            <td><span>Face-off win %</span></td>
                            <td><span>Shooting %</span></td>
                            <td><span>Save %</span></td>
                        </tr>
                        </thead>
                        <tbody>
                        {seasonStats && (
                            <tr>
                                <td>{seasonStats.gamesPlayed}</td>
                                <td>{seasonStats.wins}</td>
                                <td>{seasonStats.losses}</td>
                                <td>{seasonStats.ot}</td>
                                <td>{seasonStats.pts}</td>
                                <td>{seasonStats.goalsPerGame}</td>
                                <td>{seasonStats.goalsAgainstPerGame}</td>
                                <td>{seasonStats.powerPlayPercentage}</td>
                                <td>{seasonStats.powerPlayGoals}</td>
                                <td>{seasonStats.powerPlayGoalsAgainst}</td>
                                <td>{seasonStats.powerPlayOpportunities}</td>
                                <td>{seasonStats.penaltyKillPercentage}</td>
                                <td>{seasonStats.shotsPerGame}</td>
                                <td>{seasonStats.shotsAllowed}</td>
                                <td>{seasonStats.winScoreFirst}</td>
                                <td>{seasonStats.winOppScoreFirst}</td>
                                <td>{seasonStats.winLeadFirstPer}</td>
                                <td>{seasonStats.winLeadSecondPer}</td>
                                <td>{seasonStats.winOutshootOpp}</td>
                                <td>{seasonStats.winOutshotByOpp}</td>
                                <td>{seasonStats.faceOffsTaken}</td>
                                <td>{seasonStats.faceOffsWon}</td>
                                <td>{seasonStats.faceOffsLost}</td>
                                <td>{seasonStats.faceOffWinPercentage}</td>
                                <td>{seasonStats.shootingPctg}</td>
                                <td>{seasonStats.savePctg}</td>
                            </tr>
                        )}
                        {rankingStats && (
                            <tr>
                                <td>{rankingStats.gamesPlayed}</td>
                                <td>{rankingStats.wins}</td>
                                <td>{rankingStats.losses}</td>
                                <td>{rankingStats.ot}</td>
                                <td>{rankingStats.pts}</td>
                                <td>{rankingStats.goalsPerGame}</td>
                                <td>{rankingStats.goalsAgainstPerGame}</td>
                                <td>{rankingStats.powerPlayPercentage}</td>
                                <td>{rankingStats.powerPlayGoals}</td>
                                <td>{rankingStats.powerPlayGoalsAgainst}</td>
                                <td>{rankingStats.powerPlayOpportunities}</td>
                                <td>{rankingStats.penaltyKillPercentage}</td>
                                <td>{rankingStats.shotsPerGame}</td>
                                <td>{rankingStats.shotsAllowed}</td>
                                <td>{rankingStats.winScoreFirst}</td>
                                <td>{rankingStats.winOppScoreFirst}</td>
                                <td>{rankingStats.winLeadFirstPer}</td>
                                <td>{rankingStats.winLeadSecondPer}</td>
                                <td>{rankingStats.winOutshootOpp}</td>
                                <td>{rankingStats.winOutshotByOpp}</td>
                                <td>{rankingStats.faceOffsTaken}</td>
                                <td>{rankingStats.faceOffsWon}</td>
                                <td>{rankingStats.faceOffsLost}</td>
                                <td>{rankingStats.faceOffWinPercentage}</td>
                                <td>{rankingStats.shootingPctRank}</td>
                                <td>{rankingStats.savePctRank}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )

}

export default TeamFeed
