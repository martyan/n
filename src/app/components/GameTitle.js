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
            <div className="team" onClick={() => goToTeamFeed(teamHomeId)}>
                <div className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${teamHomeId}-dark.svg`} />
                </div>
                <div className="name">
                    <div className="first">{getFirstLine(getWords(teamHomeName))}</div>
                    <div className="second">{getSecondLine(getWords(teamHomeName))}</div>
                </div>
            </div>
            <div className="score" onClick={() => goToGameFeed(game.gamePk)}>
                <span>{getScore(game, 'home')}</span>
                <span className="colon">:</span>
                <span>{getScore(game, 'away')}</span>
            </div>
            {isOT && <div className="ot">{OT}</div>}
            <div className="team away" onClick={() => goToTeamFeed(game.teams.away.team.id)}>
                <div className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${teamAwayId}-dark.svg`} />
                </div>
                <div className="name">
                    <div className="first">{getFirstLine(getWords(teamAwayName))}</div>
                    <div className="second">{getSecondLine(getWords(teamAwayName))}</div>
                </div>
            </div>
        </div>
    )

}

export default GameTitle
