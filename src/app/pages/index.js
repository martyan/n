import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createPhoto, getPhoto, uploadFile, getPhotos } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import axios from 'axios'
import PageWrapper from '../components/PageWrapper'
import { useDebounce } from 'use-debounce'
import PlayerFeed from '../components/PlayerFeed'
import TeamFeed from '../components/TeamFeed'
import Modal from '../components/common/Modal'
import { Player, sortByPoints } from '../components/Roster'
import './index.scss'

const sortTeamsByName = (teams) => {
    return teams.sort((a, b) => {
        if(a.name > b.name) return 1
        if(a.name < b.name) return -1
        return 0
    })
}

const NHLgram = ({ user }) => {

    const searchRef = useRef(null)
    const [ searchStr, setSearchStr ] = useState('')
    const [ searchFocused, setSearchFocused ] = useState(false)
    const [ teams, setTeams ] = useState([])
    const [ activeTeam, setActiveTeam ] = useState(null)
    const [ activePlayer, setActivePlayer ] = useState(null)
    const [ activeMedia, setActiveMedia ] = useState(null)
    const [ debouncedSearchStr ] = useDebounce(searchStr, 250);

    const allPlayers = sortByPoints(teams.reduce((acc, currVal) => {
        const roster = currVal.roster.roster.map(roster => ({...roster, teamId: currVal.id}))
        return [...acc, ...roster]
    }, []))

    // const sorted = sortByPoints(roster)

    useEffect(() => {
        setActivePlayer('8477956')

        axios.get('https://statsapi.web.nhl.com/api/v1/teams?hydrate=roster(person(stats(splits=statsSingleSeason)))')
            .then(response => setTeams(sortTeamsByName(response.data.teams)))
            .catch(console.error)
    }, [])

    console.log(allPlayers)

    const search = debouncedSearchStr.trim().toLowerCase()

    const teamSearchCondition = (team) => {
        const abbrev = team.abbreviation.toLowerCase()
        const name = team.name.toLowerCase()

        const matchesAbbrev = abbrev.indexOf(search) > -1
        const matchesName = name.indexOf(search) > -1

        return !/[c|lw|rw|d|g]{1,2}/i.test(search) && (matchesAbbrev || matchesName)
    }
    const teamSearchResults = teams.filter(teamSearchCondition)

    const playerSearchCondition = (player) => {
        const name = player.person.fullName.toLowerCase()
        const position = player.position.abbreviation.toLowerCase()
        const nationality = player.person.nationality.toLowerCase()
        const isShort = search.length <= 2
        const is3Long = search.length === 3
        const isNumber = !isNaN(parseInt(search))
        const matchesPosition = position.indexOf(search) > -1
        const matchesName = name.indexOf(search) > -1
        const matchesNumber = player.jerseyNumber === search
        const matchesNationality = nationality === search
        // const matchesTeam = teamSearchResults.length > 0 ? !!teamSearchResults.find(team => team.id === player.teamId) : false

        return isShort ? (isNumber ? matchesNumber : matchesPosition) : is3Long ? matchesNationality : matchesName
    }
    const playerSearchResults = debouncedSearchStr.length > 0 ? allPlayers.filter(playerSearchCondition) : []

    const handleSubmit = (e) => {
        e.preventDefault()
        searchRef.current.blur()
    }

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <form className="search" onSubmit={handleSubmit}>
                    <input
                        ref={searchRef}
                        type="text"
                        value={searchStr}
                        onChange={e => setSearchStr(e.target.value)}
                        onFocus={e => setSearchFocused(true)}
                        onBlur={e => setSearchFocused(false)}
                        placeholder="Search for team or player"
                    />
                    {searchStr.length > 0 && (
                        <button className="clear" type="button" onClick={() => setSearchStr('')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                                <path d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"></path>
                            </svg>
                        </button>
                    )}
                </form>

                {teamSearchResults.map(team => (
                    <div key={team.id} className="team" onClick={() => setActiveTeam(team.id)}>
                        <div className="avatar">
                            <img className="photo" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${team.id}-dark.svg`} />
                        </div>
                        <div className="info">
                            <div className="top">
                                <span className="name">{team.name}</span>
                                {/*<span className="number">#{player.jerseyNumber}</span>*/}
                            </div>
                            <div className="conference">{team.conference.name}/{team.division.name}</div>
                        </div>
                    </div>
                ))}

                <ul>
                    {playerSearchResults.map(player => <Player key={player.person.id} player={player} onClick={setActivePlayer} />)}
                </ul>

                <Modal
                    visible={activeTeam !== null}
                    onClose={() => setActiveTeam(null)}
                    classNames={{modal: 'nhl no-padding', overlay: 'no-padding'}}
                    noPadding
                >
                    <TeamFeed
                        teamId={activeTeam}
                        onPlayerClick={setActivePlayer}
                    />
                </Modal>

                <Modal
                    visible={activePlayer !== null}
                    onClose={() => setActivePlayer(null)}
                    classNames={{modal: 'nhl no-padding', overlay: 'no-padding'}}
                    noPadding
                >
                    <PlayerFeed
                        playerId={activePlayer}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                    />
                </Modal>

            </div>
        </PageWrapper>
    )

}

NHLgram.getInitialProps = async ({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

NHLgram.propTypes = {
    createPhoto: PropTypes.func.isRequired,
    getPhoto: PropTypes.func.isRequired,
    getPhotos: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    photos: [...state.app.photos, ...state.app.photos, ...state.app.photos, ...state.app.photos, ...state.app.photos]
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createPhoto,
        getPhoto,
        getPhotos,
        uploadFile
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(NHLgram)
