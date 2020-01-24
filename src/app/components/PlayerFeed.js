import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import GameFeed from './GameFeed'
import { Parallax, Background } from 'react-parallax'
import { arrow } from './icons'
import { Router } from '../../functions/routes'
import { getStats } from './TeamFeed'

const getRankText = (rank) => {
    switch(rank) {
        case 'rankPowerPlayGoals':
            return 'Power play goals'
        case 'rankBlockedShots':
            return 'Blocked shots'
        case 'rankAssists':
            return 'Assists'
        case 'rankShotPct':
            return 'Shot percentage'
        case 'rankGoals':
            return 'Goals'
        case 'rankHits':
            return 'Hits'
        case 'rankPenaltyMinutes':
            return 'Penalty minutes'
        case 'rankShortHandedGoals':
            return 'Short-handed goals'
        case 'rankPlusMinus':
            return '+ -'
        case 'rankShots':
            return 'Shots'
        case 'rankPoints':
            return 'Points'
        case 'rankOvertimeGoals':
            return 'Overtime goals'
        case 'rankGamesPlayed':
            return 'Games played'
        case 'shutOuts':
            return 'Shutouts'
        case 'shotsAgainst':
            return 'Shots against'
        case 'ot':
            return 'Overtime'
        case 'timeOnIce':
            return 'Time on ice'
        case 'saves':
            return 'Saves'
        case 'losses':
            return 'Losses'
        case 'goalsAgainst':
            return 'Goals against'
        case 'savePercentage':
            return 'Save percentage'
        case 'games':
            return 'Games'
        case 'goalsAgainstAverage':
            return 'Goals against average'
        case 'wins':
            return 'Wins'
        default:
            return rank
    }
}

const getStatName = (rank) => {
    switch(rank) {
        case 'rankPowerPlayGoals':
            return 'powerPlayGoals'
        case 'rankBlockedShots':
            return 'blocked'
        case 'rankAssists':
            return 'assists'
        case 'rankShotPct':
            return 'shotPct'
        case 'rankGoals':
            return 'goals'
        case 'rankHits':
            return 'hits'
        case 'rankPenaltyMinutes':
            return 'penaltyMinutes'
        case 'rankShortHandedGoals':
            return 'shortHandedGoals'
        case 'rankPlusMinus':
            return 'plusMinus'
        case 'rankShots':
            return 'shots'
        case 'rankPoints':
            return 'points'
        case 'rankOvertimeGoals':
            return 'overTimeGoals'
        case 'rankGamesPlayed':
            return 'games'
        case 'shutOuts':
            return 'shutouts'
        case 'shotsAgainst':
            return 'shotsAgainst'
        case 'ot':
            return 'ot'
        case 'timeOnIce':
            return 'timeOnIce'
        case 'saves':
            return 'saves'
        case 'losses':
            return 'losses'
        case 'goalsAgainst':
            return 'goalsAgainst'
        case 'savePercentage':
            return 'savePercentage'
        case 'games':
            return 'games'
        case 'goalsAgainstAverage':
            return 'goalAgainstAverage'
        case 'wins':
            return 'wins'
        default:
            return rank
    }
}

const PlayerFeed = ({ player, playerId }) => {

    const [ feed, setFeed ] = useState([])

    useEffect(() => {
        // axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=20192020`)
        //     .then(response => setFeed(response.data.stats[0].splits))
        //     .catch(console.error)
    }, [])

    const notLoaded = !player || String(player.id) !== String(playerId)

    console.log(player, playerId)

    if(!player) return null

    const isGoalie = player.primaryPosition.code === 'G'

    const seasonStats = getStats('statsSingleSeason', player.stats)
    const rankingStats = getStats('regularSeasonStatRankings', player.stats)
    console.log(seasonStats, rankingStats)

    const rankKeys = Object.keys(rankingStats)
    console.log(rankKeys)
    const ranks = rankKeys.map(key => {
        const [ string, n, sup ] = /(\d+)([A-Za-z]+)/g.exec(rankingStats[key])
        return {
            key,
            n: parseInt(n),
            sup
        }
    })

    const filteredRanks = ranks
        .filter(rank => isGoalie ? rank.n <= 10 : rank.n <= 30)
        .filter(rank => !(isGoalie && rank.key === 'penaltyMinutes'))

    const goodRanks = filteredRanks.sort((a, b) => {
        if(a.n > b.n) return 1
        if(a.n < b.n) return -1
        return 0
    })


    console.log(seasonStats)

    return (
        <div className="player-feed">
            {!notLoaded && (
                <>
                    <div className="cover">
                        <Parallax
                            bgImage={`https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`}
                            bgImageAlt={player.fullName}
                            strength={40}
                        >
                            <div style={{ height: '160px' }} />
                        </Parallax>

                        <div className="caption">
                            <span className="no">{player.primaryNumber}</span>
                            <h1 className="name">{player.fullName}</h1>
                            {(player.captain || player.alternateCaptain) && (
                                <span className="cpt">{player.captain ? 'C' : 'A'}</span>
                            )}
                        </div>

                        <div className="team-logo">
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.currentTeam.id}-dark.svg`} />
                        </div>

                        <div className="photo">
                            <img src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.jpg`} />
                        </div>

                        <button className="arrow" onClick={() => Router.pushRoute('/')}>
                            {arrow}
                        </button>
                    </div>

                    <div className="ranks">
                        {goodRanks.map(rank => {
                            const value = seasonStats[getStatName(rank.key)]
                            return (
                                <div className="rank">
                                    <div className="position">
                                        <span className="n">{rank.n}</span>
                                        <span className="sup">{rank.sup}</span>
                                    </div>
                                    <div className="name">{getRankText(rank.key)}</div>
                                    {typeof value !== 'undefined' && <div className="value">{value}</div>}
                                </div>
                            )
                        })}
                    </div>

                    <br /><br />

                    {console.log(player)}

                    {player.nationality}
                    {player.currentAge}

                    {player.weight}
                    {player.height}
                </>
            )}

            <br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

            {/*{feed.map(game => (
                <div key={game.date} className="game">
                    <div className={game.isHome ? 'teams' : 'teams away'}>
                        <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.team.id}-dark.svg`} alt={game.team.name} />
                        <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.opponent.id}-dark.svg`} alt={game.opponent.name} />
                    </div>
                    <div className="stats">
                        <span>G{game.stat.goals} A{game.stat.assists}</span>
                        <span className="date">{moment(game.date).format('ddd MMM DD')}</span>
                    </div>
                    {(game.stat.goals > 0 || game.stat.assists > 0) && (
                        <GameFeed
                            gameId={game.game.gamePk}
                            player={player}
                            {...props}
                        />
                    )}
                </div>
            ))}*/}
        </div>
    )

}

export default PlayerFeed
