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
import PlayerListItem from '../components/PlayerListItem'
import SearchInput from '../components/SearchInput'
import flags from '../components/flags'
import TopPicks from '../components/TopPicks'
import { shuffle } from '../helpers/sort'
import './index.scss'
import { useDebounce } from 'use-debounce'

const SearchPage = ({ teams, getTeams, UIVisible, setUIVisible, history, allPlayers, nationalities, filters, setFilter, getGame, games }) => {

    const [ topPicksVisible, setTopPicksVisible ] = useState(false)
    const [ filtersVisible, setFiltersVisible ] = useState(false)
    const [ debouncedFilters] = useDebounce(filters, 500)

    const teamsLoaded = teams.length > 0 && teams[0].roster.roster[0].person.hasOwnProperty('stats')

    // const getTrending = (selectedPosition) => {
    //     const trendingCounts = {
    //         goalie: 0,
    //         defense: 0,
    //         forward: 0
    //     }
    //
    //     return allPlayers
    //         .filter((player, i) => {
    //             if((!selectedPosition || selectedPosition === 'G') && player.position.abbreviation === 'G') {
    //                 if(trendingCounts.goalie >= 15) return false
    //                 trendingCounts.goalie = trendingCounts.goalie + 1
    //                 return true
    //             }
    //
    //             if((!selectedPosition || selectedPosition === 'D') && player.position.abbreviation === 'D') {
    //                 if(trendingCounts.defense >= 15) return false
    //                 trendingCounts.defense = trendingCounts.defense + 1
    //                 return true
    //             }
    //
    //             if((!selectedPosition || selectedPosition === 'F') && (player.position.abbreviation === 'C' || player.position.abbreviation === 'RW' || player.position.abbreviation === 'LW')) {
    //                 if(trendingCounts.forward >= 15) return false
    //                 trendingCounts.forward = trendingCounts.forward + 1
    //                 return true
    //             }
    //
    //             return false
    //         })
    // }

    const setTeamId = (teamId) => {
        setFilter('teamId', filters.teamId === teamId ? null : teamId)
    }

    const setPosition = (position) => {
        // setTrending(shuffle(getTrending(position)))
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
        setUIVisible(true)

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
        for(let key in debouncedFilters) {
            if(typeof debouncedFilters[key] === 'string' ? (debouncedFilters[key].length !== 0) : (debouncedFilters[key] !== null)) noFilters = false
        }

        if(noFilters) {

            if(player.position.abbreviation === 'G') {
                if(playerCounts.goalie >= 5) return false
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

        const matchesName = player.person.fullName.toLowerCase().indexOf(debouncedFilters.searchStr.toLowerCase()) > -1
        const matchesNationality = player.person.nationality === debouncedFilters.nationality
        const matchesTeam = player.person.currentTeam.id === debouncedFilters.teamId
        const matchesPosition = debouncedFilters.position === getPosition(player.position)

        return (debouncedFilters.searchStr.length === 0 || matchesName) &&
            (debouncedFilters.nationality === null || matchesNationality) &&
            (debouncedFilters.teamId === null || matchesTeam) &&
            (debouncedFilters.position === null || matchesPosition)

    })

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl padded zearch">

                <SearchInput searchStr={filters.searchStr} setSearchStr={searchStr => setFilter('searchStr', searchStr)} />

                {/*<p className="caption" onClick={() => setTopPicksVisible(!topPicksVisible)}>Top picks</p>*/}
                {/*{topPicksVisible && <TopPicks games={games} getGame={getGame} teams={teams} />}*/}

                {filtersVisible && (
                    <>
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
                    </>
                )}

                <div className="filters">
                    <button className={filtersVisible ? 'toggle active' : 'toggle'} onClick={() => setFiltersVisible(!filtersVisible)}>Filters</button>
                </div>

                <ul className="roster">
                    {searchResults.map(player => <PlayerListItem key={player.person.id} player={player} withTeamBadge />)}
                </ul>

                <NavBar visible={UIVisible} history={history} />

            </div>
        </PageWrapper>
    )

}

SearchPage.getInitialProps = async ({ store }) => {
    // await store.dispatch(getPhotos())
    return {}
}

SearchPage.propTypes = {
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

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(SearchPage)
