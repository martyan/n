import React from 'react'
import { sortPlayersByPoints } from '../helpers/sort'
import { Router } from '../../functions/routes'
import PlayerListItem from './PlayerListItem'

const Roster = ({ roster, onClick }) => {

    if(!roster) return null

    const sorted = sortPlayersByPoints(roster)
    console.log(sorted)

    return (
        <div className="roster">
            <ul>
                {sorted.map(player => <PlayerListItem key={player.person.id} player={player} onClick={onClick}/>)}
            </ul>
        </div>
    )

}

export default Roster
