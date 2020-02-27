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
import { setActiveMedia, getTeams, getSchedule, setScheduleOffset, setLoadedContentIndex, getGame } from '../lib/app/actions'
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
    getGame,
    getSchedule,
    gameContent,
    getGameContent,
    scheduleOffset,
    setScheduleOffset,
    loadedContentIndex,
    setLoadedContentIndex
}) => {

    const [ UIVisible, setUIVisible ] = useState(true)
    const [ gameSchedule, setGameSchedule ] = useState([])

    const gamesToLoad = 2
    const teamsLoaded = teams.length > 0 //&& teams[0].roster.roster[0].person.hasOwnProperty('stats')

    const loadMoreGames = (gameSchedule) => {
        console.log('load more')
        const nextIndex = (loadedContentIndex + gamesToLoad <= gameSchedule.length) ? loadedContentIndex + gamesToLoad : gameSchedule.length

        gameSchedule.slice(loadedContentIndex, nextIndex).map(game => getGame(game.gamePk))
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
        if(schedule.length > 0 && schedule.length === scheduleOffset) {
            console.info('dotahaly se skedzly')
            const gameSchedule = getGameSchedule(schedule)
            setGameSchedule(gameSchedule)
            loadMoreGames(gameSchedule)
        }
    }, [schedule])

    useEffect(() => {
        //load more schedule if all games from schedule are loaded
        const gameIds = gameSchedule.map(game => game.gamePk)
        const loadedGamesChecklist = gameIds.map(gameId => !!games.find(game => game.gamePk === gameId))
        const allGamesLoaded = loadedGamesChecklist.every(gameLoaded => gameLoaded === true)
        if(allGamesLoaded) console.log('all gejmz loudyd')

        if(games.length > 0 && allGamesLoaded) loadMoreSchedule()
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
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getTeams,
        setActiveMedia,
        getSchedule,
        getGame,
        setScheduleOffset,
        setLoadedContentIndex
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(HomePage)
