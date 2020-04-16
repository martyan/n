import React from 'react'
import { getStats } from './TeamFeed'
import './PlayerStats.scss'

const Stats = ({ player }) => {
    const seasonStats = getStats('statsSingleSeason', player.stats)

    if(!seasonStats) return null

    switch(player.primaryPosition.type) {
        case 'Forward':
        case 'Defenseman':
            return (
                <table>
                    <thead>
                        <tr className="groups">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="group" colSpan="3">Power play</td>
                            <td className="group" colSpan="3">Short-handed</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>GP</td>
                            <td>G</td>
                            <td>A</td>
                            <td>P</td>
                            <td>+/-</td>
                            <td>TOI</td>
                            <td>PIM</td>
                            <td>GWG</td>
                            <td>OTG</td>
                            <td className="grouped">G</td>
                            <td className="grouped">A</td>
                            <td className="grouped">TOI</td>
                            <td className="grouped">G</td>
                            <td className="grouped">A</td>
                            <td className="grouped">TOI</td>
                            <td>FO%</td>
                            <td>S</td>
                            <td>S%</td>
                            <td>B</td>
                            <td>H</td>
                            <td>P/G</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{seasonStats.games}</td>
                            <td>{seasonStats.goals}</td>
                            <td>{seasonStats.assists}</td>
                            <td>{seasonStats.points}</td>
                            <td>{seasonStats.plusMinus}</td>
                            <td>{seasonStats.timeOnIcePerGame}</td>
                            <td>{seasonStats.penaltyMinutes}</td>
                            <td>{seasonStats.gameWinningGoals}</td>
                            <td>{seasonStats.overTimeGoals}</td>
                            <td className="grouped">{seasonStats.powerPlayGoals}</td>
                            <td className="grouped">{seasonStats.powerPlayPoints - seasonStats.powerPlayGoals}</td>
                            <td className="grouped">{seasonStats.powerPlayTimeOnIcePerGame}</td>
                            <td className="grouped">{seasonStats.shortHandedGoals}</td>
                            <td className="grouped">{seasonStats.shortHandedPoints - seasonStats.shortHandedGoals}</td>
                            <td className="grouped">{seasonStats.shortHandedTimeOnIcePerGame}</td>
                            <td>{seasonStats.faceOffPct}</td>
                            <td>{seasonStats.shots}</td>
                            <td>{seasonStats.shotPct}</td>
                            <td>{seasonStats.blocked}</td>
                            <td>{seasonStats.hits}</td>
                            <td>{Math.round(seasonStats.points / seasonStats.games * 10) / 10}</td>
                        </tr>
                    </tbody>
                </table>
            )
        case 'Goalie':
            return (
                <table>
                    <thead>
                    <tr className="groups">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="group" colSpan="3">Even strength</td>
                        <td className="group" colSpan="3">Power play</td>
                        <td className="group" colSpan="3">Short-handed</td>
                    </tr>
                    <tr>
                        <td>GP</td>
                        <td>W</td>
                        <td>L</td>
                        <td>T</td>
                        <td>OT</td>
                        <td>SO</td>
                        <td>SA</td>
                        <td>SV</td>
                        <td>SV%</td>
                        <td>GAA</td>
                        <td>S</td>
                        <td>SV</td>
                        <td>SV%</td>
                        <td>S</td>
                        <td>SV</td>
                        <td>SV%</td>
                        <td>S</td>
                        <td>SV</td>
                        <td>SV%</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{seasonStats.games}</td>
                        <td>{seasonStats.wins}</td>
                        <td>{seasonStats.losses}</td>
                        <td>{seasonStats.ties}</td>
                        <td>{seasonStats.ot}</td>
                        <td>{seasonStats.shutouts}</td>
                        <td>{seasonStats.shotsAgainst}</td>
                        <td>{seasonStats.saves}</td>
                        <td>{seasonStats.savePercentage}</td>
                        <td>{seasonStats.goalAgainstAverage}</td>
                        <td>{seasonStats.evenShots}</td>
                        <td>{seasonStats.evenSaves}</td>
                        <td>{Math.round(seasonStats.evenStrengthSavePercentage)}</td>
                        <td>{seasonStats.powerPlayShots}</td>
                        <td>{seasonStats.powerPlaySaves}</td>
                        <td>{Math.round(seasonStats.powerPlaySavePercentage)}</td>
                        <td>{seasonStats.shortHandedShots}</td>
                        <td>{seasonStats.shortHandedSaves}</td>
                        <td>{Math.round(seasonStats.shortHandedSavePercentage)}</td>
                    </tr>
                    </tbody>
                </table>
            )
        default:
            return null
    }
}

const PlayerStats = ({ player }) => {

    if(!player) return null

    return (
        <div className="player-stats">
            <div className="wrapper">
                <Stats player={player}/>
            </div>
        </div>
    )

}

export default PlayerStats
