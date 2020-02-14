import React, { useEffect, useState } from 'react'
import Post from './Post'
import { getPlayersFromTeams, getPlayersMedia } from '../helpers/data'

const Game = ({ playerOnly, game, date, gameContent, player, teams, activeMedia, setActiveMedia }) => {

    if(!game || !gameContent || (playerOnly && !player) || teams.length === 0) return null

    const media = playerOnly ? getPlayersMedia(player, gameContent.highlights.scoreboard.items) : gameContent.highlights.scoreboard.items

    const teamsFilterFn = playerOnly
        ? (team) => (team.id === game.team.id || team.id === game.opponent.id)
        : (team) => (team.id === game.teams.home.team.id || team.id === game.teams.away.team.id)

    const applicableTeams = teams.filter(teamsFilterFn)
    const applicablePlayers = getPlayersFromTeams(applicableTeams)

    return (
        <div className="game">
            {media.map(media => (
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
