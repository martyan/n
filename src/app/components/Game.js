import React from 'react'
import Post from './Post'
import GameTitle from './GameTitle'
import { getPlayersFromTeams, getPlayersMedia } from '../helpers/data'
import Sticky from 'react-sticky-el'

const Game = ({
    game,
    date,
    gameContent,
    player,
    teams,
    activeMedia,
    setActiveMedia,
    playerOnly,
    gameOnly
}) => {

    if(!game || !gameContent || (playerOnly && !player) || teams.length === 0) return null

    const highlights = playerOnly ? getPlayersMedia(player, gameContent.highlights.scoreboard.items) : gameContent.highlights.scoreboard.items
    const recap = gameContent.media.epg.find(media => media.title === 'Recap').items[0]

    const applicableTeams = teams.filter(team => team.id === game.teams.home.team.id || team.id === game.teams.away.team.id)
    const applicablePlayers = getPlayersFromTeams(applicableTeams)

    return (
        <div className="game">
            <Sticky boundaryElement=".game" hideOnBoundaryHit={false} style={{position: 'relative', zIndex: 99}}>
                <GameTitle game={game} />
            </Sticky>

            {gameOnly && (
                <Post
                    game={game}
                    media={recap}
                    players={applicablePlayers}
                    activeMedia={activeMedia}
                    setActiveMedia={setActiveMedia}
                    date={date}
                />
            )}

            {highlights.map(media => (
                <Post
                    key={media.id}
                    game={game}
                    media={media}
                    players={applicablePlayers}
                    activeMedia={activeMedia}
                    setActiveMedia={setActiveMedia}
                    playerOnly={playerOnly}
                    date={date}
                />
            ))}
        </div>
    )

}

export default Game
