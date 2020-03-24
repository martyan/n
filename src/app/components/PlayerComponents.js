import React from 'react'
import { Parallax, Background } from 'react-parallax'
import { getStats } from './TeamFeed'
import { getRankText, getStatName } from '../helpers/stats'
import { goToTeamFeed } from '../helpers/navigation'
import moment from 'moment'

export const PlayerHeader = ({ player }) => {

    if(!player) return null

    return (
        <div className="cover">
            {/*<Parallax
                bgImage={`https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`}
                bgImageAlt={player.fullName}
                strength={40}
            >
                <div style={{ height: '120px' }} />
            </Parallax>*/}
            <div className="photo">
                <img src={`https://nhl.bamcontent.com/images/actionshots/${player.id}.jpg`} />
            </div>

            {player.rookie && <div className="rookie">Rookie</div>}

            <div className="caption">
                <span className="no">{player.primaryNumber}</span>
                <h1 className="name">{player.fullName}</h1>
                {(player.captain || player.alternateCaptain) && (
                    <span className="cpt">{player.captain ? 'C' : 'A'}</span>
                )}
            </div>

            {player.hasOwnProperty('currentTeam') && (
                <div className="team-logo" onClick={() => goToTeamFeed(player.currentTeam.id)}>
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.currentTeam.id}-dark.svg`} />
                </div>
            )}
        </div>
    )

}

export const PlayerInfo = ({ player }) => {

    if(!player) return null

    const getAge = (player) => player.currentAge || moment.utc().diff(moment.utc(player.birthDate), 'years')

    return (
        <div className="info">
            <div className="position">{player.primaryPosition.name}</div>
            <div className="nationality">{player.nationality}</div>
            <div className="age">{getAge(player)}y</div>
            <div className="height">{player.height}</div>
            <div className="weight">{player.weight} lb</div>
        </div>
    )

}

export const Rankings = ({ player }) => {

    if(!player) return null

    const isGoalie = player.primaryPosition.code === 'G'

    const seasonStats = getStats('statsSingleSeason', player.stats)
    const rankingStats = getStats('regularSeasonStatRankings', player.stats)

    const rankKeys = Object.keys(rankingStats)
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

    return (
        <div className="ranks">
            {goodRanks.map(rank => {
                const value = seasonStats[getStatName(rank.key)]
                return (
                    <div key={rank.key} className="rank">
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
    )

}

export const PlayerHistory = ({ history, getPlayerSchedule }) => {

    if(!history) return null

    return (
        <div className="player-history">
            {history.filter(season => season.league.id === 133).map(season => (
                <div key={`${season.season}_${season.team.id}`} onClick={() => getPlayerSchedule(season.season)}>{season.season} {season.team.name}</div>
            ))}
        </div>
    )

}
