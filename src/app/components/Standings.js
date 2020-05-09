import React, { useState } from 'react'
import './Standings.scss'
import { goToTeamFeed } from '../helpers/navigation'

const Standings = ({ standings, teamId, teams }) => {

    const [ showAll, setShowAll ] = useState(false)

    return (

        <div className="standings">
            {standings
                .sort((a, b) => {
                    const isTeamDivision = a.teamRecords.find(record => record.team.id === teamId)
                    return isTeamDivision ? -1 : 1
                })
                .slice(0, showAll ? undefined : 1)
                .map(division => (
                    <div key={division.division.id} className="division">
                        <div className="title">{division.division.name}</div>
                        <div className="standing-item standing-header">
                            <span className="no">&nbsp;</span>
                            <span className="img">&nbsp;</span>
                            <span className="name">&nbsp;</span>
                            <span>GP</span>
                            <span>P</span>
                            <span className="record">Record</span>
                        </div>
                        <div>
                        {division.teamRecords.map((record, i) => {
                            const team = teams.find(team => team.id === record.team.id)

                            if(!team) return null

                            return (
                                <div key={team.id} className={record.team.id === teamId ? 'standing-item hl' : 'standing-item'} onClick={e => goToTeamFeed(team.id, e)}>
                                    <span className="no font-number">{i + 1}</span>
                                    <img className="img" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/d7b71b1f9618bc99b318310b894f5e60a533547c_1586449115/images/logos/team/current/team-${record.team.id}-dark.svg`} />
                                    <span className="name">{team.abbreviation}</span>
                                    <span className="font-number">{record.gamesPlayed}</span>
                                    <span className="font-number">{record.points}</span>
                                    <span className="record font-number">{record.leagueRecord.wins}-{record.leagueRecord.ot}-{record.leagueRecord.losses}</span>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                ))
            }

            {!showAll && <button className="show-all" onClick={() => setShowAll(true)}>All divisions</button>}
        </div>

    )

}

export default Standings
