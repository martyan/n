import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import Game from './Game'
import { Parallax, Background } from 'react-parallax'
// import { getStats } from './TeamFeed'
// import { getRankText, getStatName } from '../helpers/stats'
import PlayerStats from './PlayerStats'
import { goToTeamFeed } from '../helpers/navigation'
import LoadMore from './LoadMore'
import { getGameIdFromLink, getPlayersMedia } from '../helpers/data'

const PlayerFeed = ({
    player,
    playerId,
    teams,
    playerSchedule,
    gameContent,
    getGameContent,
    activeMedia,
    setActiveMedia
}) => {

    const scheduleRef = useRef([])
    const [ loadedIndex, setLoadedIndex ] = useState(0)

    const increaseAmount = 5
    const loadMore = () => {
        console.log('load more')
        const nextIndex = (loadedIndex + increaseAmount <= playerSchedule.length) ? loadedIndex + increaseAmount : playerSchedule.length

        playerSchedule.slice(loadedIndex, nextIndex).map(game => getGameContent(game.game.gamePk))
        setLoadedIndex(nextIndex)
    }

    const loadMoreIfNoContent = () => {
        //load more content if no relevant is loaded
        const media = gameContent.map(content => getPlayersMedia(player, content.highlights.scoreboard.items))
        const applicableMedia = media.filter(media => media.length > 0)

        if(applicableMedia.length === 0) loadMore()
    }

    useEffect(() => {
        if(player && scheduleRef.current !== playerSchedule && playerSchedule.length > 0) {
            setLoadedIndex(0)
            setActiveMedia(0)

            loadMore()

            scheduleRef.current = playerSchedule
        }
    }, [player, playerSchedule])

    useEffect(() => {
        if(player && gameContent.length > 0 && gameContent.length === loadedIndex) {
            loadMoreIfNoContent()
        }
    }, [player, gameContent])

    const noMore = loadedIndex === playerSchedule.length
    const notLoaded = !player || String(player.id) !== String(playerId)

    // const isGoalie = player.primaryPosition.code === 'G'

    // const seasonStats = getStats('statsSingleSeason', player.stats)
    // const rankingStats = getStats('regularSeasonStatRankings', player.stats)

    // const rankKeys = Object.keys(rankingStats)
    // const ranks = rankKeys.map(key => {
    //     const [ string, n, sup ] = /(\d+)([A-Za-z]+)/g.exec(rankingStats[key])
    //     return {
    //         key,
    //         n: parseInt(n),
    //         sup
    //     }
    // })

    // const filteredRanks = ranks
    //     .filter(rank => isGoalie ? rank.n <= 10 : rank.n <= 30)
    //     .filter(rank => !(isGoalie && rank.key === 'penaltyMinutes'))

    // const goodRanks = filteredRanks.sort((a, b) => {
    //     if(a.n > b.n) return 1
    //     if(a.n < b.n) return -1
    //     return 0
    // })

    return (
        <div className="player-feed">
            {!notLoaded && (
                <>
                    <div className="cover">
                        {/*<Parallax
                            bgImage={`https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`}
                            bgImageAlt={player.fullName}
                            strength={40}
                        >
                            <div style={{ height: '120px' }} />
                        </Parallax>*/}
                        <div className="photo">
                            <img src={`https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`} />
                        </div>

                        {player.rookie && <div className="rookie">Rookie</div>}

                        <div className="caption">
                            <span className="no">{player.primaryNumber}</span>
                            <h1 className="name">{player.fullName}</h1>
                            {(player.captain || player.alternateCaptain) && (
                                <span className="cpt">{player.captain ? 'C' : 'A'}</span>
                            )}
                        </div>

                        <div className="team-logo" onClick={() => goToTeamFeed(player.currentTeam.id)}>
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.currentTeam.id}-dark.svg`} />
                        </div>
                    </div>


                    <div className="info">
                        <div className="position">{player.primaryPosition.name}</div>
                        <div className="nationality">{player.nationality}</div>
                        <div className="age">{player.currentAge}y</div>
                        <div className="height">{player.height}</div>
                        <div className="weight">{player.weight} lb</div>
                    </div>

                    <PlayerStats player={player} />

                    {/*<div className="ranks">
                        {goodRanks.map(rank => {
                            const value = seasonStats[getStatName(rank.key)]
                            return (
                                <div key={rank.key} className="rank">
                                    <div className="position">
                                        <span className="n">{rank.n}</span>
                                        <span className="sup">{rank.sup}</span>
                                    </div>
                                    <div className="name">{getRankText(rank.key)}</div>
                                    {typeof value !== 'undefined' && <div className="value">{value}</div>}
                                </div>
                            )
                        })}
                    </div>*/}

                    {playerSchedule.slice(0, loadedIndex).map(game => (
                        <div key={game.date} className="game">
                            <Game
                                game={game}
                                gameContent={gameContent.find(content => getGameIdFromLink(content.link) === String(game.game.gamePk))}
                                player={player}
                                teams={teams}
                                activeMedia={activeMedia}
                                setActiveMedia={setActiveMedia}
                                date={game.date}
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
