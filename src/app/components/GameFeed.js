import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Media from './Media'
import { useDebounce } from 'use-debounce'

const GameFeed = ({ gameId, player, activeMedia, setActiveMedia }) => {

    const [ feed, setFeed ] = useState(null)
    const [ debouncedActiveMedia ] = useDebounce(activeMedia, 1000)

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/content`)
            .then(response => setFeed(response.data))
            .catch(console.error)
    }, [])

    if(!feed) return null

    const media = feed.highlights.scoreboard.items
    const applicableMedia = media.filter(m => m.description.indexOf(player.lastName) > -1)

    return (
        <div className="game-feed">
            {applicableMedia.map(media => <Media key={media.id} media={media} activeMedia={debouncedActiveMedia} setActiveMedia={setActiveMedia} />)}
        </div>
    )

}

export default GameFeed
