import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Router } from '../../functions/routes'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import NavBar from '../components/NavBar'
import {
    getTeams,
    setUIVisible,
    setFilter,
    getGame
} from '../lib/app/actions'
import Title from '../components/Title'
import { setScrollDir } from '../helpers/UI'
import { shuffle } from '../helpers/sort'
import PlayerListItem from '../components/PlayerListItem'
import './index.scss'

import flagCAN from '../static/img/flags/can.svg'
import flagUSA from '../static/img/flags/usa.svg'
import flagCZE from '../static/img/flags/cze.svg'
import flagFIN from '../static/img/flags/fin.svg'
import flagSWE from '../static/img/flags/swe.svg'
import flagSVK from '../static/img/flags/svk.svg'
import flagNOR from '../static/img/flags/nor.svg'
import flagGBR from '../static/img/flags/gbr.svg'
import flagGER from '../static/img/flags/ger.svg'
import flagRUS from '../static/img/flags/rus.svg'
import flagSWI from '../static/img/flags/swi.svg'
import flagSLO from '../static/img/flags/slo.svg'
import flagUKR from '../static/img/flags/ukr.svg'
import flagAUT from '../static/img/flags/aut.svg'
import flagLAT from '../static/img/flags/lat.svg'
import flagFRA from '../static/img/flags/fra.svg'
import flagDEN from '../static/img/flags/den.svg'
import TopPicks from '../components/TopPicks'

const flags = {
    CAN: flagCAN,
    USA: flagUSA,
    CZE: flagCZE,
    FIN: flagFIN,
    SWE: flagSWE,
    SVK: flagSVK,
    NOR: flagNOR,
    GBR: flagGBR,
    DEU: flagGER,
    RUS: flagRUS,
    CHE: flagSWI,
    SVN: flagSLO,
    UKR: flagUKR,
    AUT: flagAUT,
    LVA: flagLAT,
    FRA: flagFRA,
    DNK: flagDEN
}

const WelcomePage = ({ teams, getTeams, UIVisible, setUIVisible, history, allPlayers, nationalities, filters, setFilter, getGame, games }) => {

    // const [ selectedPosition, setSelectedPosition ] = useState(null)
    // const [ selectedNationality, setSelectedNationality ] = useState(null)
    const [ topPicksVisible, setTopPicksVisible ] = useState(false)

    const teamsLoaded = teams.length > 0 && teams[0].roster.roster[0].person.hasOwnProperty('stats')

    const getTrending = (selectedPosition) => {
        const trendingCounts = {
            goalie: 0,
            defense: 0,
            forward: 0
        }

        return allPlayers
            .filter((player, i) => {
                if((!selectedPosition || selectedPosition === 'G') && player.position.abbreviation === 'G') {
                    if(trendingCounts.goalie >= 15) return false
                    trendingCounts.goalie = trendingCounts.goalie + 1
                    return true
                }

                if((!selectedPosition || selectedPosition === 'D') && player.position.abbreviation === 'D') {
                    if(trendingCounts.defense >= 15) return false
                    trendingCounts.defense = trendingCounts.defense + 1
                    return true
                }

                if((!selectedPosition || selectedPosition === 'F') && (player.position.abbreviation === 'C' || player.position.abbreviation === 'RW' || player.position.abbreviation === 'LW')) {
                    if(trendingCounts.forward >= 15) return false
                    trendingCounts.forward = trendingCounts.forward + 1
                    return true
                }

                return false
            })
    }

    const setTeamId = (teamId) => {
        setFilter('teamId', filters.teamId === teamId ? null : teamId)
    }

    const setPosition = (position) => {
        setTrending(shuffle(getTrending(position)))
        setFilter('position', position)
    }

    const setNationality = (nationality) => {
        //setTrending()
        setFilter('nationality', nationality)
    }

    const getPosition = (position) => {
        if(position.abbreviation === 'C' || position.abbreviation === 'RW' || position.abbreviation === 'LW') return 'F'
        return position.abbreviation
    }

    useEffect(() => {
        setScrollDir(setUIVisible)

        if(!teamsLoaded) {
            getTeams(true)
                .catch(console.error)
        }
    }, [])

    const selectedTeam = teams.find(team => team.id === filters.teamId)

    const playerCounts = {
        goalie: 0,
        defense: 0,
        forward: 0
    }

    const searchResults = allPlayers.filter(player => {

        let noFilters = true
        for(let key in filters) {
            if(filters[key] !== null) noFilters = false
        }

        if(noFilters) {

            if(player.position.abbreviation === 'G') {
                if(playerCounts.goalie >= 15) return false
                playerCounts.goalie = playerCounts.goalie + 1
                return true
            }

            if(player.position.abbreviation === 'D') {
                if(playerCounts.defense >= 15) return false
                playerCounts.defense = playerCounts.defense + 1
                return true
            }

            if(player.position.abbreviation === 'C' || player.position.abbreviation === 'RW' || player.position.abbreviation === 'LW') {
                if(playerCounts.forward >= 15) return false
                playerCounts.forward = playerCounts.forward + 1
                return true
            }

            return false

        }

        const matchesNationality = player.person.nationality === filters.nationality
        const matchesTeam = player.person.currentTeam.id === filters.teamId
        const matchesPosition = filters.position === getPosition(player.position)

        return (filters.nationality === null || matchesNationality) && (filters.teamId === null || matchesTeam) && (filters.position === null || matchesPosition)

    })

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded welcome">

                <Title visible={true} />

                <p className="caption" onClick={() => setTopPicksVisible(!topPicksVisible)}>Top picks</p>
                {topPicksVisible && <TopPicks games={games} getGame={getGame} teams={teams} />}

                <p className="caption">Team</p>
                <div className="filter2 filter-team">
                    <div className="wrapper">
                        <ul>
                            <li className={filters.teamId === null ? 'active' : ''} onClick={() => setTeamId(null)}>
                                <div className="logo">
                                    <img src="https://www-league.nhlstatic.com/images/logos/league-dark/133-flat.svg" alt="NHL logo"/>
                                </div>
                                <div className="abbrev">All</div>
                            </li>
                            {teams.map(team => (
                                <li key={team.id} className={team.id === filters.teamId ? 'active' : ''} onClick={() => setTeamId(team.id)}>
                                    <div className="logo">
                                        <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${team.id}-dark.svg`} />
                                    </div>
                                    <div className="abbrev">{team.abbreviation}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="caption">Nationality</p>
                <div className="filter2 filter-default">
                    <div className="wrapper">
                        <ul className="nationality">
                            <li className={filters.nationality === null ? 'active' : ''} onClick={() => setNationality(null)}>All</li>
                            {nationalities.map(n => (
                                <li key={n} className={filters.nationality === n ? 'active' : ''} onClick={() => setNationality(n)}>
                                    {flags.hasOwnProperty(n.toUpperCase()) && <img src={flags[n.toUpperCase()]} alt={n} />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="caption">Position</p>
                <div className="filter2 filter-default">
                    <div className="wrapper">
                        <ul>
                            <li className={filters.position === null ? 'active' : ''} onClick={() => setPosition(null)}>All</li>
                            <li className={filters.position === 'G' ? 'active' : ''} onClick={() => setPosition('G')}>Goalie</li>
                            <li className={filters.position === 'D' ? 'active' : ''} onClick={() => setPosition('D')}>Defense</li>
                            <li className={filters.position === 'F' ? 'active' : ''} onClick={() => setPosition('F')}>Forward</li>
                        </ul>
                    </div>
                </div>

                <p className="caption">Trending players</p>
                <ul className="roster">
                    {searchResults.map(player => <PlayerListItem key={player.person.id} player={player} />)}
                </ul>

                <NavBar visible={UIVisible} history={history} />

            </div>
        </PageWrapper>
    )

}

WelcomePage.getInitialProps = async ({ store }) => {
    // await store.dispatch(getPhotos())
    return {}
}

WelcomePage.propTypes = {
}

const mapStateToProps = (state) => ({
    teams: state.app.teams,
    history: state.app.history,
    UIVisible: state.app.UIVisible,
    allPlayers: state.app.allPlayers,
    nationalities: state.app.nationalities,
    filters: state.app.filters,
    games: state.app.games
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getTeams,
        setUIVisible,
        setFilter,
        getGame
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(WelcomePage)
