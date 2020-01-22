import { useEffect, useState } from 'react'
import axios from 'axios'
import React from 'react'

const GameFeed = ({ gameId, player, activeMedia, setActiveMedia }) => {

    const [ feed, setFeed ] = useState(null)

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/content`)
            .then(response => setFeed(response.data))
            .catch(console.error)
    }, [])

    if(!feed) return null

    const media = feed.highlights.scoreboard.items
    const applicableMedia = media.filter(m => m.description.indexOf(player.lastName) > -1)
    // console.log(applicableMedia, player)

    console.log(media)
    return (
        <div className="game-feed">

            {applicableMedia.map(media => {
                if(activeMedia === media.id) {
                    const HQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_1800K') > -1)
                    if(!HQ) return null
                    return <iframe key={HQ.url} src={HQ.url} frameBorder="0"></iframe>
                }

                const thumb = media.image.cuts['640x360']
                if(!thumb) return null
                return <img key={thumb.src} src={thumb.src} onClick={() => setActiveMedia(media.id)}/>
            })}

        </div>
    )

}

export default GameFeed
