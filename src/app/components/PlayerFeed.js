import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import GameFeed from './GameFeed'
import { Parallax, Background } from 'react-parallax'

const PlayerFeed = ({ playerId, ...props }) => {

    const [ player, setPlayer ] = useState(null)
    const [ feed, setFeed ] = useState([])

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
            .then(response => setPlayer(response.data.people[0]))
            .catch(console.error)

        // axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=20192020`)
        //     .then(response => setFeed(response.data.stats[0].splits))
        //     .catch(console.error)
    }, [])

    console.log(player)

    if(!player) return null

    return (
        <div className="player-feed">
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <Parallax
                bgImage={`https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`}
                bgImageAlt="Some alt text"
                blur={10}
                bgClassName={`cover`}
                // onClick={() => handleSlideClick(2)}
            >
                <div style={{ height: '120px' }} />
            </Parallax>

            <img className="photo" src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.jpg`} />
            {player.fullName}
            {player.nationality}
            {player.currentAge}
            {player.primaryNumber}
            {player.weight}
            {player.height}

            <br />
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
