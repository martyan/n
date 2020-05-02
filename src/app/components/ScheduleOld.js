import React from 'react'
import moment from 'moment'
import './Schedule.scss'
import { goToGameFeed } from '../helpers/navigation'
import Swiper from 'react-id-swiper'
import 'swiper/swiper.scss'

const ScheduleOld = ({ schedule, playerSchedule, teams }) => {

    const getTeamAbbrev = (teamId) => {
        const team = teams.find(team => team.id === teamId)
        return team ? team.abbreviation : ''
    }

    const today = moment.utc()
    const isSameYear = (date) => moment.utc(date).isSame(today, 'year')

    const options = {
        slidesPerView: 3,
        spaceBetween: 30,
        freeMode: true,
        mousewheel: true,
        centeredSlides: true
    }

    return (
        <>
            <div className="schedule">
                <div className="wrapper">
                    {schedule.map(game => (
                        <div key={game.date} className="game" onClick={() => goToGameFeed(game.games[0].gamePk)}>
                            <div className="date">{moment.utc(game.date).format(isSameYear(game.date) ? 'MMM D' : 'MMM D, YYYY')}</div>
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
            <div>
                <Swiper {...options}>
                    <div>Slide 1</div>
                    <div>Slide 2</div>
                    <div>Slide 3</div>
                    <div>Slide 4</div>
                    <div>Slide 5</div>
                    <div>Slide 5</div>
                    <div>Slide 5</div>
                    <div>Slide 5</div>
                </Swiper>
            </div>
        </>
    )

}

export default ScheduleOld
