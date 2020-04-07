import { Router } from '../../functions/routes'

export const goToPlayerFeed = (playerId, e) => {
    if(e) e.preventDefault()
    Router.pushRoute(`/player/${playerId}`)
}

export const goToTeamFeed = (teamId, e) => {
    if(e) e.preventDefault()
    Router.pushRoute(`/team/${teamId}`)
}

export const goToGameFeed = (gameId, e) => {
    if(e) e.preventDefault()
    Router.pushRoute(`/game/${gameId}`)
}

export const goToSearch = (e) => {
    if(e) e.preventDefault()
    Router.pushRoute(`/search`)
}

export const goToHome = (e) => {
    if(e) e.preventDefault()
    Router.pushRoute(`/`)
}
