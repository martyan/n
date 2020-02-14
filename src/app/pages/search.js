import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Router } from '../../functions/routes'
import { setSearchStr, getTeams } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import { useDebounce } from 'use-debounce'
import SearchInput from '../components/SearchInput'
import SearchResults from '../components/SearchResults'
import NavBar from '../components/NavBar'
import scrollDirObservable from 'scrolldir-observable'
import './index.scss'

const SearchPage = ({ searchStr, setSearchStr, teams, getTeams, allPlayers }) => {

    const [ UIVisible, setUIVisible ] = useState(true)
    const [ debouncedSearchStr ] = useDebounce(searchStr, 250)

    const teamsLoaded = teams.length > 0 && teams[0].roster.roster[0].person.hasOwnProperty('stats')

    useEffect(() => {
        const scrollDir = scrollDirObservable(window.document)
        scrollDir.subscribe(dir => setUIVisible(dir === 'up'))

        if(!teamsLoaded) {
            getTeams(true).catch(console.error)
        }
    }, [])

    const search = debouncedSearchStr.trim().toLowerCase()

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">
                <SearchInput searchStr={searchStr} setSearchStr={setSearchStr} />

                <SearchResults
                    searchStr={search}
                    teams={teams}
                    allPlayers={allPlayers}
                />

                <NavBar visible={UIVisible} />
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
    searchStr: state.app.searchStr,
    teams: state.app.teams,
    allPlayers: state.app.allPlayers
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        setSearchStr,
        getTeams
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(SearchPage)
