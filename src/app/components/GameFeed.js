import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Post from './Post'
import { getPlayersFromTeams, getPlayersMedia } from '../helpers/data'

const GameFeed = ({ game, player, teams, activeMedia, setActiveMedia }) => {

    const [ feed, setFeed ] = useState(null)

    const gameId = game.game.gamePk

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/content`)
            .then(response => setFeed(response.data))
            .catch(console.error)
    }, [])

    if(!feed) return null

    const media = getPlayersMedia(player, feed.highlights.scoreboard.items)

    const applicableTeams = teams.filter(team => team.id === game.team.id || team.id === game.opponent.id)
    const applicablePlayers = getPlayersFromTeams(applicableTeams)

    return (
        <div className="game-feed">
            {media.map(media => (
                <Post
                    key={media.id}
                    game={game}
                    media={media}
                    players={applicablePlayers}
                    activeMedia={activeMedia}
                    setActiveMedia={setActiveMedia}
                />
            ))}
        </div>
    )

}

export default GameFeed
