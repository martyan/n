import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Router } from '../../functions/routes'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import moment from 'moment'
import axios from 'axios'
import NavBar from '../components/NavBar'
import Game from '../components/Game'
import {
    setActiveMedia,
    getTeams,
    getSchedule,
    setScheduleOffset,
    setLoadedContentIndex,
    getGame,
    setUIVisible,
    setIndexInited
} from '../lib/app/actions'
import Title from '../components/Title'
import './index.scss'
import LoadMore from '../components/LoadMore'
import { setScrollDir } from '../helpers/UI'

const getGameSchedule = (schedule) => {
    const games = [].concat
        .apply([], schedule)
        .reduce((acc, curr) => [...acc, ...curr.games.reverse()], [])
        .filter(game => game.status.abstractGameState === 'Final')
        .sort((a, b) => {
            if(a.gameDate > b.gameDate) return -1
            if(a.gameDate < b.gameDate) return 1
            if(a.gameDate === b.gameDate) {
                if(a.gamePk > b.gamePk) return 1
                if(a.gamePk < b.gamePk) return -1
            }
            return 0
        })

    return games
}

const HomePage = ({
    teams,
    getTeams,
    activeMedia,
    setActiveMedia,
    schedule,
    history,
    games,
    UIVisible,
    setUIVisible,
    getGame,
    getSchedule,
    gameContent,
    getGameContent,
    scheduleOffset,
    setScheduleOffset,
    loadedContentIndex,
    setLoadedContentIndex,
    indexInited,
    setIndexInited
}) => {

    const scheduleRef = useRef([])
    const gamesRef = useRef([])
    const [ gameSchedule, setGameSchedule ] = useState([])

    const gamesToLoad = 2
    const teamsLoaded = teams.length > 0 //&& teams[0].roster.roster[0].person.hasOwnProperty('stats')

    const loadMoreGames = (gameSchedule) => {
        console.error('LOAD MORE GAMES')
        const nextIndex = (loadedContentIndex + gamesToLoad <= gameSchedule.length) ? loadedContentIndex + gamesToLoad : gameSchedule.length

        //load only not loaded games
        const gamesBeingLoaded = gameSchedule
            .slice(loadedContentIndex, nextIndex)
            .map(game => game.gamePk)
            .filter(gameId => !games.find(game => String(game.gamePk) === String(gameId)))
            .map(gameId => getGame(gameId))

        if(gamesBeingLoaded.length === 0) console.error('BATCH IS ALREADY LOADED IN STORE')

        setLoadedContentIndex(nextIndex)
    }

    const loadMoreSchedule = () => {
        const start = moment.utc().subtract(scheduleOffset * 2 + 1, 'days')
        const end = moment.utc().subtract(scheduleOffset * 2, 'days')
        getSchedule(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))

        setScheduleOffset(scheduleOffset + 1)
    }

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(!teamsLoaded) {
            getTeams()
                .catch(console.error)
        }

        if(schedule.length === 0) loadMoreSchedule()

        // axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${yesterday}&endDate=${today}&hydrate=linescore,game(content(media(epg),highlights(scoreboard)))`)
        //     .then(r => setFeed(r.data.dates.reverse().reduce((acc, curr) => [...acc, ...curr.games], [])))
    }, [])

    useEffect(() => {

        if(schedule.length > 0 && scheduleRef.current !== schedule) {
            if(indexInited && scheduleRef.current.length === 0) {
                console.error('skedzly se nebudou tahat')
                scheduleRef.current = schedule
                return
            }

            console.error('stahl se skedzl loadni hry', scheduleRef.current, schedule)

            const gameSchedule = getGameSchedule(schedule)
            setGameSchedule(gameSchedule)
            loadMoreGames(gameSchedule)

            if(!indexInited) setIndexInited(true)
            scheduleRef.current = schedule
        }

        if(scheduleRef.current !== schedule && schedule.length > 0) {
            // setLoadedContentIndex(0)
            // setActiveMedia(0)
            //
            // const gameSchedule = getGameSchedule(schedule)
            // setGameSchedule(gameSchedule)
            // loadMoreGames(gameSchedule)
            //
            // scheduleRef.current = schedule
        }

        // if(schedule.length > 0 && scheduleRef.current !== schedule && schedule.length === scheduleOffset) {
        //     if(indexInited && scheduleRef.current.length === 0) return
        //     if(!indexInited) setIndexInited(true)
        //     console.error('SCHEDULE SUBSCRIBER', schedule, scheduleRef.current)
        //
        //     const gameSchedule = getGameSchedule(schedule)
        //     setGameSchedule(gameSchedule)
        //     loadMoreGames(gameSchedule)
        //     scheduleRef.current = schedule
        // }

        // if(scheduleRef.current !== playerSchedule && playerSchedule.length > 0) {
        //     setLoadedContentIndex(0)
        //     setActiveMedia(0)
        //
        //     loadMore()
        //
        //     scheduleRef.current = playerSchedule
        // }
    }, [schedule])

    useEffect(() => {


        if(games.length > 0 && gamesRef.current !== games && gamesRef.current.length !== 0) {

            // load more schedule if all games from schedule are loaded
            const gameIds = gameSchedule.map(game => game.gamePk)
            const loadedGamesChecklist = gameIds.map(gameId => !!games.find(game => game.gamePk === gameId))

            console.log(gameSchedule, gameIds, loadedGamesChecklist)

            const allGamesLoaded = loadedGamesChecklist.every(gameLoaded => gameLoaded === true)

            if(allGamesLoaded) {
                console.error('all gejmz loudyd => louding more skedzlz')
                loadMoreSchedule()
            }

        }

        gamesRef.current = games

    }, [games])

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded">

                <Title visible={true} />

                {games.map(game => (
                    <Game
                        key={game.gamePk}
                        game={game}
                        gameContent={game.content}
                        teams={teams}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                        date={game.gameDate}
                    />
                ))}

                <LoadMore loadMore={() => loadMoreGames(gameSchedule)} />

                <NavBar visible={UIVisible} history={history} />

            </div>
        </PageWrapper>
    )

}

HomePage.getInitialProps = async ({ store }) => {
    // await store.dispatch(getPhotos())
    return {}
}

HomePage.propTypes = {
}

const mapStateToProps = (state) => ({
    teams: state.app.teams,
    activeMedia: state.app.activeMedia,
    schedule: state.app.schedule,
    scheduleOffset: state.app.scheduleOffset,
    loadedContentIndex: state.app.loadedContentIndex,
    games: state.app.games,
    history: state.app.history,
    UIVisible: state.app.UIVisible,
    indexInited: state.app.indexInited
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getTeams,
        setActiveMedia,
        getSchedule,
        getGame,
        setScheduleOffset,
        setLoadedContentIndex,
        setUIVisible,
        setIndexInited
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(HomePage)
