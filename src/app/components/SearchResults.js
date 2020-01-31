import React from 'react'
import { Player } from './Roster'
import { goToPlayerFeed, goToPlayerTeamFeed } from '../helpers/navigation'

const SearchResults = ({ searchStr, allPlayers, teams }) => {

    const teamSearchCondition = (team) => {
        const abbrev = team.abbreviation.toLowerCase()
        const name = team.name.toLowerCase()

        const matchesAbbrev = abbrev.indexOf(searchStr) > -1
        const matchesName = name.indexOf(searchStr) > -1

        return !/[c|lw|rw|d|g]{1,2}/i.test(searchStr) && (matchesAbbrev || matchesName)
    }
    const teamSearchResults = teams.filter(teamSearchCondition)

    const playerSearchCondition = (player) => {
        const name = player.person.fullName.toLowerCase()
        const position = player.position.abbreviation.toLowerCase()
        const nationality = player.person.hasOwnProperty('nationality') ? player.person.nationality.toLowerCase() : ''
        const isShort = searchStr.length <= 2
        const is3Long = searchStr.length === 3
        const isNumber = !isNaN(parseInt(searchStr))
        const matchesPosition = position.indexOf(searchStr) > -1
        const matchesName = name.indexOf(searchStr) > -1
        const matchesNumber = player.jerseyNumber === searchStr
        const matchesNationality = nationality === searchStr
        // const matchesTeam = teamSearchResults.length > 0 ? !!teamSearchResults.find(team => team.id === player.teamId) : false

        return isShort ? (isNumber ? matchesNumber : matchesPosition) : is3Long ? matchesNationality : matchesName
    }
    const playerSearchResults = searchStr.length > 0 ? allPlayers.filter(playerSearchCondition) : []

    return (
        <>
            {teamSearchResults.map(team => (
                <div key={team.id} className="team" onClick={() => goToPlayerTeamFeed(team.id)}>
                    <div className="avatar">
                        <img className="photo" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${team.id}-dark.svg`} />
                    </div>
                    <div className="info">
                        <div className="top">
                            <span className="name">{team.name}</span>
                            {/*<span className="number">#{player.jerseyNumber}</span>*/}
                        </div>
                        <div className="conference">{team.conference.name}/{team.division.name}</div>
                    </div>
                </div>
            ))}

            <ul>
                {playerSearchResults.map(player => <Player key={player.person.id} player={player} onClick={goToPlayerFeed} />)}
            </ul>
        </>
    )

}

export default SearchResults
