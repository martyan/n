import React from 'react'
import { getStats } from './TeamFeed'
import SwipeableList from './SwipeableList/SwipeableList'
import SwipeableListItem from './SwipeableList/SwipeableListItem'

const sortByTOI = (roster) => {
    return roster.sort((a, b) => {
        const statsA = getStats('statsSingleSeason', a.person.stats)
        const statsB = getStats('statsSingleSeason', b.person.stats)
        if(!statsA) return 1
        if(!statsB) return -1

        const [ mA, sA ] = statsA.timeOnIce.split(':').map(stat => parseInt(stat))
        const [ mB, sB ] = statsB.timeOnIce.split(':').map(stat => parseInt(stat))
        const totalA = mA * 60 + sA
        const totalB = mB * 60 + sB

        if(totalA < totalB) return 1
        if(totalA > totalB) return -1

        return 0
    })
}

export const sortByPoints = (roster) => {
    return roster.sort((a, b) => {
        const statsA = getStats('statsSingleSeason', a.person.stats)
        const statsB = getStats('statsSingleSeason', b.person.stats)

        if(!statsA) return 1
        if(!statsB) return -1

        const isGoalie = (stat) => !stat.hasOwnProperty('points')

        if(isGoalie(statsA) && isGoalie(statsB)) {
            if(statsA.savePercentage > statsB.savePercentage) return -1
            if(statsA.savePercentage < statsB.savePercentage) return 1
        } else {
            if(isGoalie(statsA)) return -1
            if(isGoalie(statsB)) return 1
        }

        if(statsA.points < statsB.points) return 1
        if(statsA.points > statsB.points) return -1

        return 0
    })
}

export const Player = ({ player, onClick }) => {
    const stats = getStats('statsSingleSeason', player.person.stats)

    return (
        <li className="player" onClick={() => onClick(player.person.id)}>
            <div className="avatar">
                <img className="photo" src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${player.person.id}.jpg`} />
                {player.teamId && <img className="badge" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.teamId}-dark.svg`} />}
                <span className="number">{player.jerseyNumber}</span>
                {(player.person.captain || player.person.alternateCaptain) && (
                    <span className="cpt">{player.person.captain ? 'C' : 'A'}</span>
                )}
            </div>
            <div className="info">
                <div className="top">
                    <span className="name">{player.person.fullName}</span>
                    {stats && (
                        <div className="stats">
                            {stats.hasOwnProperty('points') ? (
                                <>
                                    <div className="points">{stats.points} <span className="unit">pts</span></div>
                                    <div className="separate"><span className="unit">G</span>{stats.goals} <span className="unit">A</span>{stats.assists}</div>
                                </>
                            ) : (
                                <>
                                    <div className="pctg">{stats.savePercentage.toString().substring(1)}</div>
                                    <div className="gp">{stats.games}<span className="unit">GP</span></div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="position">{player.position.name}</div>
            </div>
        </li>
    )
}

const Roster = ({ roster, onClick }) => {
    if(!roster) return null

    // const sorted = sortByTOI(roster)
    const sorted = sortByPoints(roster)
    console.log(sorted)

    const background = <span>Archive</span>;
    const fakeContent = (
        <div className="FakeContent">
            <span>Swipe to delete</span>
        </div>
    );

    return (
        <div className="roster">
            <SwipeableList background={background}>
                <SwipeableListItem>{fakeContent}</SwipeableListItem>
            </SwipeableList>
            <ul>
                {sorted.map(player => <Player key={player.person.id} player={player} onClick={onClick}/>)}
            </ul>
        </div>
    )
}

export default Roster
