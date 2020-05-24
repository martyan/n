import React, { useEffect, useState } from 'react'
import Game from './Game'

const topPicks = ['5326423', '4895296', '4976671', '5243549', '5305753', '5282720', '69786903', '5288803', '5290549', '5305160', '5264794', '70467203', '70075103', '69360103', '70007803', '70047003', '4632529', '5264499', '4900444', '5243036', '4648354', '5339703']
const topPicksMedia = [
    { "mediaId": "4632529", "gameId": 2019020329 },
    { "mediaId": "5326423", "gameId": 2019021028 },
    { "mediaId": "5243549", "gameId": 2019020874 },
    { "mediaId": "5305753", "gameId": 2019020984 },
    { "mediaId": "5282720", "gameId": 2019020956 },
    { "mediaId": "5288803", "gameId": 2019020963 },
    { "mediaId": "5290549", "gameId": 2019020966 },
    { "mediaId": "5305160", "gameId": 2019020985 },
    { "mediaId": "5264794", "gameId": 2019020919 },
    { "mediaId": "5264499", "gameId": 2019020918 },
    { "mediaId": "5243036", "gameId": 2019020873 },
    { "mediaId": "5339703", "gameId": 2019021049 },
    { "mediaId": "4976671", "gameId": 2019020659 },
    { "mediaId": "4895296", "gameId": 2019020569 },
    { "mediaId": "4900444", "gameId": 2019020580 },
    { "mediaId": "4758209", "gameId": 2019020444 },
    { "mediaId": "4756704", "gameId": 2019020440 },
    { "mediaId": "4817011", "gameId": 2019020498 },
    { "mediaId": "4806289", "gameId": 2019020484 },
    { "mediaId": "4856383", "gameId": 2019020532 },
    { "mediaId": "4854635", "gameId": 2019020530 },
    { "mediaId": "4707519", "gameId": 2019020391 },
]

const TopPicks = ({ getGame, games, teams }) => {

    const [ activeMedia, setActiveMedia ] = useState(null)
    const [ loadedGames, setLoadedGames ] = useState([])

    useEffect(() => {
        topPicksMedia.map(pick => getGame(pick.gameId))
    }, [])

    useEffect(() => {
        const loaded = topPicksMedia.map(media => {
            let game = games.find(game => game.gamePk === media.gameId)
            if(game) {
                return ({
                    ...game,
                    content: {
                        highlights: {
                            scoreboard: {
                                items: game.content.highlights.scoreboard.items.filter(item => !!topPicksMedia.find(pick => pick.mediaId === item.id))
                            }
                        }
                    }
                })
            }

            return game
        }).filter(game => !!game)
        console.log(loaded)
        setLoadedGames(loaded)
    }, [games])


    return (
        <div className="top-picks">
            {loadedGames.map(game => (
                <Game
                    key={`NHLF_${game.gamePk}`}
                    game={game}
                    gameContent={game.content}
                    teams={teams}
                    activeMedia={activeMedia}
                    setActiveMedia={setActiveMedia}
                    date={game.gameDate}
                />
            ))}
        </div>
    )

}

export default TopPicks
