import React from 'react'

const Schedule = ({ schedule, playerSchedule, teams }) => {

    // console.log(schedule)
    // console.log(playerSchedule)
    // console.log(teams)

    const getTeamAbbrev = (teamId) => {
        const team = teams.find(team => team.id === teamId)
        return team ? team.abbreviation : ''
    }

    return (
        <div className="schedule">
            <div className="wrapper">
                {schedule.map(game => (
                    <div key={game.date} className="game">
                        <div className="team">
                            <div className="logo">
                                <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.games[0].teams.home.team.id}-dark.svg`} />
                            </div>
                            <div className="abbrev">{getTeamAbbrev(game.games[0].teams.home.team.id)}</div>
                            <div className="score">{game.games[0].teams.home.score}</div>
                        </div>
                        <div className="team">
                            <div className="logo">
                                <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.games[0].teams.away.team.id}-dark.svg`} />
                            </div>
                            <div className="abbrev">{getTeamAbbrev(game.games[0].teams.away.team.id)}</div>
                            <div className="score">{game.games[0].teams.away.score}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Schedule
