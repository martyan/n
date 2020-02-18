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
import { setActiveMedia, getTeams, getSchedule, getGameContent, setScheduleOffset, setLoadedContentIndex } from '../lib/app/actions'
import Title from '../components/Title'
import './index.scss'
import { getGameIdFromLink } from '../helpers/data'
import GameTitle from '../components/GameTitle'
import LoadMore from '../components/LoadMore'
import { setScrollDir } from '../helpers/UI'

const getGamesFromSchedule = (schedule) => {
    const games = [].concat
        .apply([], schedule)
        .reduce((acc, curr) => [...acc, ...curr.games.reverse()], [])
        .filter(game => game.status.abstractGameState === 'Final')
        .sort((a, b) => {
            if(a.gameDate > b.gameDate) return -1
            if(a.gameDate < b.gameDate) return 1
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
    getSchedule,
    gameContent,
    getGameContent,
    scheduleOffset,
    setScheduleOffset,
    loadedContentIndex,
    setLoadedContentIndex
}) => {

    const [ UIVisible, setUIVisible ] = useState(true)
    const [ scheduleVisible, setScheduleVisible ] = useState(false)

    const teamsLoaded = teams.length > 0 //&& teams[0].roster.roster[0].person.hasOwnProperty('stats')

    const loadMoreContent = (games) => {
        console.log('load more')
        const increaseAmount = 2
        const nextIndex = (loadedContentIndex + increaseAmount <= games.length) ? loadedContentIndex + increaseAmount : games.length

        games.slice(loadedContentIndex, nextIndex).map(game => getGameContent(game.gamePk))
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

        if(schedule.length === 0) loadMoreSchedule(true)

        // axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${thisMonth}&endDate=${today}`)
        //     .then(r => console.log(r.data.dates.reverse().reduce((acc, curr) => [...acc, ...curr.games], [])))

        // const today = moment.utc().format('YYYY-MM-DD')
        // const yesterday = moment.utc().subtract(1, 'day').format('YYYY-MM-DD')
        //
        // axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${yesterday}&endDate=${today}&hydrate=linescore,game(content(media(epg),highlights(scoreboard)))`)
        //     .then(r => setFeed(r.data.dates.reverse().reduce((acc, curr) => [...acc, ...curr.games], [])))
    }, [])

    useEffect(() => {
        if(schedule.length > 0 && schedule.length === scheduleOffset) {
            console.info('dotahaly se skedzly')
            const games = getGamesFromSchedule(schedule)
            loadMoreContent(games)
        }
    }, [schedule])

    useEffect(() => {
        if(gameContent.length > 0 && gameContent.length === games.length) {
            loadMoreSchedule()
        }
    }, [gameContent])

    const games = getGamesFromSchedule(schedule)
    const feed = games.slice(0, loadedContentIndex).map(game => {
        const content = gameContent.find(content => getGameIdFromLink(content.link) === String(game.gamePk))
        return ({...game, content})
    })

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded">

                <Title visible={UIVisible} onClick={() => setScheduleVisible(!scheduleVisible)} />

                {scheduleVisible ? (
                    <div>
                        {feed.map(game => <GameTitle key={game.gamePk} game={game} />)}
                    </div>
                ) : (
                    <div>
                        {feed.map(game => (
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

                        <LoadMore loadMore={() => loadMoreContent(games)} />
                    </div>
                )}

                <NavBar visible={UIVisible} />

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
    gameContent: state.app.gameContent,
    scheduleOffset: state.app.scheduleOffset,
    loadedContentIndex: state.app.loadedContentIndex
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getTeams,
        setActiveMedia,
        getSchedule,
        getGameContent,
        setScheduleOffset,
        setLoadedContentIndex
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(HomePage)
