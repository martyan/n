import { Router } from '../../functions/routes'

export const goToPlayerFeed = (playerId) => {
    Router.pushRoute(`/player/${playerId}`)
}

export const goToPlayerTeamFeed = (teamId) => {
    Router.pushRoute(`/team/${teamId}`)
}
