import React from 'react'
import { goToGameFeed, goToTeamFeed } from '../helpers/navigation'
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

    const getWords = (name) => name.split(' ')
    const getFirstLine = (words) => words.slice(0, words.length === 3 ? 2 : 1).join(' ')
    const getSecondLine = (words) => words.slice(words.length === 3 ? 2 : 1).join(' ')
    const isOT =  OT === 'OT' || OT === 'SO'


    return (
        <div className="game-title">
            <a href={`/team/${teamHomeId}`} className="team" onClick={e => goToTeamFeed(teamHomeId, e)}>
                <span className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${teamHomeId}-dark.svg`} />
                </span>
                <span className="name">
                    <span className="first">{getFirstLine(getWords(teamHomeName))}</span>
                    <span className="second">{getSecondLine(getWords(teamHomeName))}</span>
                </span>
            </a>
            <a href={`/game/${game.gamePk}`} className="result" onClick={e => goToGameFeed(game.gamePk, e)}>
                <span className="score">
                    <span>{getScore(game, 'home')}</span>
                    <span className="colon">:</span>
                    <span>{getScore(game, 'away')}</span>
                </span>
                {isOT && <div className="ot">{OT}</div>}
            </a>

            <a href={`/team/${game.teams.away.team.id}`} className="team away" onClick={e => goToTeamFeed(game.teams.away.team.id, e)}>
                <span className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${teamAwayId}-dark.svg`} />
                </span>
                <span className="name">
                    <span className="first">{getFirstLine(getWords(teamAwayName))}</span>
                    <span className="second">{getSecondLine(getWords(teamAwayName))}</span>
                </span>
            </a>
        </div>
    )

}

export default GameTitle
