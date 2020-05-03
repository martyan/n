import React from 'react'
import './TeamHeader.scss'

const TeamHeader = ({ team, tab, setTab }) => {

    const tabIsActive = tabName => tab === tabName

    return (
        <div className="team-header">

            <div className={`team-title team-${team.id}-bg`}>
                <div className="logo">
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/d7b71b1f9618bc99b318310b894f5e60a533547c_1586449115/images/logos/team/current/team-${team.id}-light.svg`} />
                </div>
                <div className="info">
                    <div className="name">{team.name}</div>
                    <div className="conference">{team.conference.name}/{team.division.name}</div>
                </div>
            </div>

            <div className="tabs">
                <button className={tabIsActive('overview') ? `team-${team.id}-after team-${team.id}-clr active` : ''} onClick={() => setTab('overview')}>Overview</button>
                <button className={tabIsActive('roster') ? `team-${team.id}-after team-${team.id}-clr active` : ''} onClick={() => setTab('roster')}>Roster</button>
                <button className={tabIsActive('schedule') ? `team-${team.id}-after team-${team.id}-clr active` : ''} onClick={() => setTab('schedule')}>Schedule</button>
            </div>

        </div>
    )

}

export default TeamHeader
