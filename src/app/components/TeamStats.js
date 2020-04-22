import React from 'react'
import './TeamStats.scss'

const TeamStats = ({ seasonStats, rankingStats }) => {

    return (
        <div className="team-stats">
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
    )

}

export default TeamStats
