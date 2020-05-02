import React from 'react'
import './Schedule.scss'
import { goToGameFeed } from '../helpers/navigation'
import GameTitle from './GameTitle'

const Play = ({ play, home }) => {

    const scorer = play.players.find(player => player.playerType === 'Scorer')
    const assists = play.players.filter(player => player.playerType === 'Assist')
    const goalie = play.players.find(player => player.playerType === 'Goalie')
    const isFirst = (index) => index === 0
    const isLast = (array, index) => index === array.length - 1

    return (
        <div className={home ? 'play-item home' : 'play-item'}>
            {scorer && <span>{scorer.player.fullName.split(' ').pop()} </span>}
            {assists.map((assist, i) => <span className="assists">{isFirst(i) && '('}{assist.player.fullName.split(' ').pop()}{!isLast(assists, i) ? ', ' : ')'}</span>)}
        </div>
    )

}

const Game = ({ game }) => {

    const teamHomeId = game.teams.home.team.id
    const teamAwayId = game.teams.away.team.id
    const teamHomeScoringPlays = game.scoringPlays.filter(play => play.team.id === teamHomeId)
    const teamAwayScoringPlays = game.scoringPlays.filter(play => play.team.id === teamAwayId)

    return (
        <div className="game-list-item">
            <GameTitle game={game} />

            <div className="scorers" onClick={e => goToGameFeed(game.gamePk, e)}>
                <div className="team home">
                    {teamHomeScoringPlays.map(play => <Play play={play} home />)}
                </div>
                <div className="team away">
                    {teamAwayScoringPlays.map(play => <Play play={play} />)}
                </div>
            </div>
        </div>
    )

}

const Schedule = ({ schedule }) => {

    return (
        <div className="game-list">
            {schedule.map(game => <Game key={game.date} game={game.games[0]} />)}
        </div>
    )

}

export default Schedule
