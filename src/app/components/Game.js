import React, { useEffect, useState } from 'react'
import Post from './Post'
import { getPlayersFromTeams, getPlayersMedia } from '../helpers/data'

const Game = ({ game, gameContent, player, teams, activeMedia, setActiveMedia }) => {

    if(!game || !gameContent || !player) return null

    const media = getPlayersMedia(player, gameContent.highlights.scoreboard.items)

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

export default Game
