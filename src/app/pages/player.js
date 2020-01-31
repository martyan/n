import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import PlayerFeed from '../components/PlayerFeed'
import { getPlayer, getTeams } from '../lib/app/actions'
import './index.scss'

const PlayerPage = ({ playerId, player, teams, getPlayer, getTeams }) => {

    useEffect(() => {
        if(teams.length === 0) getTeams().catch(console.error)

        // axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=20192020`)
        //     .then(response => setFeed(response.data.stats[0].splits))
        //     .catch(console.error)
    }, [])

    useEffect(() => {
        if(!player || player.id !== playerId) {
            getPlayer(playerId).catch(console.error)

            // axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=20192020`)
            //     .then(response => setFeed(response.data.stats[0].splits))
            //     .catch(console.error)
        }
    }, [playerId])



    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <PlayerFeed
                    playerId={playerId}
                    player={player}
                    teams={teams}
                />

            </div>
        </PageWrapper>
    )

}

PlayerPage.getInitialProps = async ({ store, query }) => {
    // await store.dispatch(getProduct(query.id))
    return {
        playerId: query.id
    }
}

PlayerPage.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.object).isRequired,
    player: PropTypes.object
}

const mapStateToProps = (state) => ({
    player: state.app.player,
    teams: state.app.teams
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getPlayer,
        getTeams
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(PlayerPage)
