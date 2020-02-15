import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Router } from '../../functions/routes'
import withAuthentication from '../lib/withAuthentication'
import scrollDirObservable from 'scrolldir-observable'
import PageWrapper from '../components/PageWrapper'
import moment from 'moment'
import axios from 'axios'
import NavBar from '../components/NavBar'
import Game from '../components/Game'
import { setActiveMedia, getTeams } from '../lib/app/actions'
import './index.scss'

const HomePage = ({ teams, getTeams, activeMedia, setActiveMedia }) => {

    const [ UIVisible, setUIVisible ] = useState(true)
    const [ feed, setFeed ] = useState([])

    const teamsLoaded = teams.length > 0 && teams[0].roster.roster[0].person.hasOwnProperty('stats')

    useEffect(() => {
        const scrollDir = scrollDirObservable(window.document)
        scrollDir.subscribe(dir => setUIVisible(dir === 'up'))

        if(!teamsLoaded) {
            getTeams(true).catch(console.error)
        }

        const today = moment.utc().format('YYYY-MM-DD')
        const yesterday = moment.utc().subtract(1.5, 'day').format('YYYY-MM-DD')

        axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${yesterday}&endDate=${today}&hydrate=team(leaders(categories=[points,goals,assists],gameTypes=[R])),game(content(media(epg),highlights(scoreboard)),seriesSummary),decisions,scoringplays,seriesSummary(series)`)
            .then(r => setFeed(r.data.dates.reverse().reduce((acc, curr) => [...acc, ...curr.games], [])))
    }, [])

    console.log(feed)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <h1 className="title">NHLgram</h1>

                {feed.map(game => (
                    <div key={game.gamePk} className="game">
                        <Game
                            game={game}
                            gameContent={game.content}
                            teams={teams}
                            activeMedia={activeMedia}
                            setActiveMedia={setActiveMedia}
                            date={game.gameDate}
                        />
                    </div>
                ))}

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
    activeMedia: state.app.activeMedia
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getTeams,
        setActiveMedia
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(HomePage)
