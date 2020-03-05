import React from 'react'
import { getStats } from './TeamFeed'
import { getRankText, getStatName } from '../helpers/stats'

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
