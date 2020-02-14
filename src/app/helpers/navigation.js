import { Router } from '../../functions/routes'

export const goToPlayerFeed = (playerId) => {
    Router.pushRoute(`/player/${playerId}`)
}

export const goToTeamFeed = (teamId) => {
    Router.pushRoute(`/team/${teamId}`)
}

export const goToGameFeed = (gameId) => {
    Router.pushRoute(`/game/${gameId}`)
}

export const goToSearch = () => {
    Router.pushRoute(`/search`)
}

export const goToHome = () => {
    Router.pushRoute(`/`)
}
