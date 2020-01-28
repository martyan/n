import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Post from './Post'

const GameFeed = ({ game, player, activeMedia, setActiveMedia }) => {

    const [ feed, setFeed ] = useState(null)

    const gameId = game.game.gamePk

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/content`)
            .then(response => setFeed(response.data))
            .catch(console.error)
    }, [])

    if(!feed) return null

    console.log(game)

    const media = feed.highlights.scoreboard.items
    const applicableMedia = media.filter(m => m.description.indexOf(player.lastName) > -1)

    return (
        <div className="game-feed">
            {applicableMedia.map(media => (
                <Post
                    key={media.id}
                    game={game}
                    media={media}
                    activeMedia={activeMedia}
                    setActiveMedia={setActiveMedia}
                />
            ))}
        </div>
    )

}

export default GameFeed
