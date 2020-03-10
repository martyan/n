import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import Game from './Game'
import PlayerStats from './PlayerStats'
import { goToTeamFeed } from '../helpers/navigation'
import LoadMore from './LoadMore'
import { getGameIdFromLink, getPlayersMedia } from '../helpers/data'
import { PlayerHeader, PlayerInfo, Rankings } from './PlayerComponents'

const PlayerFeed = ({
    player,
    playerId,
    teams,
    playerSchedule,
    games,
    getGame,
    activeMedia,
    setActiveMedia
}) => {

    const scheduleRef = useRef([])
    const [ loadedContentIndex, setLoadedContentIndex ] = useState(0)
    const [ gameSchedule, setGameSchedule ] = useState([])

    const gamesToLoad = 5

    const loadMore = () => {
        console.log('load more')
        const nextIndex = (loadedContentIndex + gamesToLoad <= playerSchedule.length) ? loadedContentIndex + gamesToLoad : playerSchedule.length

        //load only not loaded games
        const gamesLoading = playerSchedule
            .slice(loadedContentIndex, nextIndex)
            .map(game => game.game.gamePk)
            .filter(gameId => !games.find(game => String(game.gamePk) === String(gameId)))
            .map(gameId => getGame(gameId))

        if(gamesLoading.length === 0) {
            console.error('BATCH IS ALREADY LOADED IN STORE')
            // setGameSchedule()
        }

        setLoadedContentIndex(nextIndex)
    }

    useEffect(() => {
        setLoadedContentIndex(0)
        setActiveMedia(0)
    }, [player])

    useEffect(() => {
        // if(player && scheduleRef.current !== playerSchedule && playerSchedule.length > 0) {
        //     setLoadedContentIndex(0)
        //     setActiveMedia(0)
        //
        //     loadMore()
        //
        //     scheduleRef.current = playerSchedule
        // }
    }, [player, playerSchedule])

    useEffect(() => {

        // if(player && games.length > 0) {
        //     const gameIds = playerSchedule.slice(loadedContentIndex - gamesToLoad, loadedContentIndex).map(game => game.game.gamePk)
        //     const loadedGamesChecklist = gameIds.map(gameId => !!games.find(game => game.gamePk === gameId))
        //     const batchLoaded = loadedGamesChecklist.every(gameLoaded => gameLoaded === true)
        //     if(batchLoaded) {
        //         console.log('batch loaded')
        //
        //         const batchSchedule = gameIds
        //             .map(gameId => games.find(game => game.gamePk === gameId))
        //             .filter(game => !!game)
        //
        //         const scheduleWithRelatedContent = batchSchedule.filter(game => getPlayersMedia(player, game.content.highlights.scoreboard.items).length > 0)
        //
        //         setGameSchedule([...gameSchedule, ...scheduleWithRelatedContent])
        //         if(scheduleWithRelatedContent.length === 0) {
        //             //load more content if no relevant is loaded
        //             loadMore()
        //         }
        //     }
        // }

        // if(player && games.length > 0 && allGamesLoaded) loadMoreIfNoContent()
    }, [player, games])

    const noMore = loadedContentIndex === playerSchedule.length
    const notLoaded = !player || String(player.id) !== String(playerId)

    return (
        <div className="player-feed">
            {!notLoaded && (
                <>
                    <PlayerHeader player={player} />

                    <PlayerInfo player={player} />

                    <PlayerStats player={player} />

                    <Rankings player={player} />

                    {gameSchedule.map(game => (
                        <div key={`PF_${game.gamePk}`} className="game">
                            <Game
                                game={game}
                                gameContent={game.content}
                                player={player}
                                teams={teams}
                                activeMedia={activeMedia}
                                setActiveMedia={setActiveMedia}
                                date={game.gameDate}
                                playerOnly
                            />
                        </div>
                    ))}

                    {!noMore && <LoadMore loadMore={loadMore} />}
                </>
            )}
        </div>
    )

}

export default PlayerFeed
