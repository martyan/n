import { CALL_API } from '../apiMiddleware'
import moment from 'moment'

const NHL_API = 'https://statsapi.web.nhl.com/api/v1'

export const setSearchStr = (searchStr) => ({ type: 'SET_SEARCH_STR', searchStr })

export const setTeam = (team) => ({ type: 'SET_TEAM', team })

export const getPlayer = (playerId) => ({
    [CALL_API]: {
        type: 'GET_PLAYER',
        endpoint: `${NHL_API}/people/${playerId}?expand=person.stats&stats=statsSingleSeason,regularSeasonStatRankings&expand=stats.team`,
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
        endpoint: `${NHL_API}/schedule?teamId=${teamId}&season=${moment().subtract(1, 'year').get('year')}${moment().get('year')}`, //&startDate=${moment().subtract(7, 'days').format('YYYY-MM-DD')}&endDate=${moment().add(1, 'month').format('YYYY-MM-DD')}`,
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
