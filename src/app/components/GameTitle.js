import React from 'react'
import { goToGameFeed, goToTeamFeed } from '../helpers/navigation'
import moment from 'moment'
import { getDateText } from '../helpers/data'
import './GameTitle.scss'

const getScore = (game, side) => {
    if(game.hasOwnProperty('teams')) {
        if(game.teams[side].hasOwnProperty('goals')) return game.teams[side].goals
        if(game.teams[side].hasOwnProperty('score')) return game.teams[side].score
    }
    return ''
    // return side === 'home' ? game.team.id : game.opponent.id
}

const getTeamId = (game, side) => {
    if(game.hasOwnProperty('teams')) return game.teams[side].team.id
    return side === 'home' ? game.team.id : game.opponent.id
}

const getTeamName = (game, side) => {
    if(game.hasOwnProperty('teams')) return game.teams[side].team.name
    return side === 'home' ? game.team.name : game.opponent.name
}

const getOT = (game) => {
    if(game.hasOwnProperty('linescore')) return game.linescore.currentPeriodOrdinal
    return game.currentPeriodOrdinal
}

const GameTitle = ({ game }) => {

    const teamHomeId = getTeamId(game, 'home')
    const teamAwayId = getTeamId(game, 'away')
    const teamHomeName = getTeamName(game, 'home')
    const teamAwayName = getTeamName(game, 'away')
    const OT = getOT(game)
    const date = moment(game.gameDate)

    const getWords = (name) => name.split(' ')
    const getFirstLine = (words) => words.slice(0, words.length === 3 ? 2 : 1).join(' ')
    const getSecondLine = (words) => words.slice(words.length === 3 ? 2 : 1).join(' ')
    const isOT =  OT === 'OT' || OT === 'SO'

    return (
        <div className="game-title">
            <a href={`/team/${game.teams.away.team.id}`} className={`team team-${teamAwayId}-bg`} onClick={e => goToTeamFeed(game.teams.away.team.id, e)}>
                <span className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/d7b71b1f9618bc99b318310b894f5e60a533547c_1586449115/images/logos/team/current/team-${teamAwayId}-light.svg`} />
                </span>
                <span className="name">
                    <span className="first">{getFirstLine(getWords(teamAwayName))}</span>
                    <span className="second">{getSecondLine(getWords(teamAwayName))}</span>
                </span>
            </a>

            <a href={`/game/${game.gamePk}`} className="result" onClick={e => goToGameFeed(game.gamePk, e)}>
                <span className="score">
                    <span>{getScore(game, 'away')}</span>
                    <span className="colon">:</span>
                    <span>{getScore(game, 'home')}</span>
                    {isOT && <span className="ot">{OT}</span>}
                </span>
            </a>

            <a href={`/team/${teamHomeId}`} className={`team home team-${teamHomeId}-bg`} onClick={e => goToTeamFeed(teamHomeId, e)}>
                <span className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/d7b71b1f9618bc99b318310b894f5e60a533547c_1586449115/images/logos/team/current/team-${teamHomeId}-light.svg`} />
                </span>
                <span className="name">
                    <span className="first">{getFirstLine(getWords(teamHomeName))}</span>
                    <span className="second">{getSecondLine(getWords(teamHomeName))}</span>
                </span>
            </a>

            <div className="date">
                <span className={`team-${teamHomeId}-bg team-${teamHomeId}-before`}>{getDateText(date)}</span>
            </div>
        </div>
    )

}

export default GameTitle
