import { CALL_API } from '../apiMiddleware'
import moment from 'moment'

const NHL_API = 'https://statsapi.web.nhl.com/api/v1'

const thisSeason = `${moment().subtract(1, 'year').get('year')}${moment().get('year')}`

export const setSearchStr = (searchStr) => ({ type: 'SET_SEARCH_STR', searchStr })

export const setTeam = (team) => ({ type: 'SET_TEAM', team })

export const setPlayerSkeletonVisible = (playerSkeletonVisible) => ({ type: 'SET_PLAYER_SKELETON_VISIBLE', playerSkeletonVisible })

export const getPlayer = (playerId) => ({
    [CALL_API]: {
        type: 'GET_PLAYER',
        endpoint: `${NHL_API}/people/${playerId}?expand=person.stats&stats=statsSingleSeason,regularSeasonStatRankings&expand=stats.team`,
        method: 'GET'
    }
})

export const getGameContent = (gameId) => ({
    [CALL_API]: {
        type: 'GET_GAME_CONTENT',
        endpoint: `${NHL_API}/game/${gameId}/content`,
        method: 'GET'
    }
})

export const getPlayerSchedule = (playerId) => ({
    [CALL_API]: {
        type: 'GET_PLAYER_SCHEDULE',
        endpoint: `${NHL_API}/people/${playerId}/stats?stats=gameLog&season=${thisSeason}`,
        method: 'GET'
    }
})

export const getTeams = (withStats) => ({
    [CALL_API]: {
        type: 'GET_TEAMS',
        endpoint: `${NHL_API}/teams${withStats ? '?hydrate=roster(person(stats(splits=statsSingleSeason)))' : '?expand=team.roster'}`,
        method: 'GET'
    }
})

export const getTeam = (teamId) => ({
    [CALL_API]: {
        type: 'GET_TEAM',
        endpoint: `${NHL_API}/teams/${teamId}?hydrate=roster(person(stats(splits=statsSingleSeason)))`,
        method: 'GET'
    }
})

export const getTeamSchedule = (teamId) => ({
    [CALL_API]: {
        type: 'GET_TEAM_SCHEDULE',
        endpoint: `${NHL_API}/schedule?teamId=${teamId}&season=${thisSeason}`, //&startDate=${moment().subtract(7, 'days').format('YYYY-MM-DD')}&endDate=${moment().add(1, 'month').format('YYYY-MM-DD')}`,
        method: 'GET'
    }
})

export const getTeamStats = (teamId) => ({
    [CALL_API]: {
        type: 'GET_TEAM_STATS',
        endpoint: `${NHL_API}/teams/${teamId}/stats`,
        method: 'GET'
    }
})
