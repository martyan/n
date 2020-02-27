import { CALL_API } from '../apiMiddleware'
import { getThisSeason, getThisSeasonSecondMonth, getThisSeasonStart } from '../../helpers/data'

const NHL_API = 'https://statsapi.web.nhl.com/api/v1'

export const setHistory = (history) => ({ type: 'SET_HISTORY', history })

export const setScheduleOffset = (scheduleOffset) => ({ type: 'SET_SCHEDULE_OFFSET', scheduleOffset })

export const setLoadedContentIndex = (loadedContentIndex) => ({ type: 'SET_LOADED_CONTENT_INDEX', loadedContentIndex })

export const setActiveMedia = (activeMedia) => ({ type: 'SET_ACTIVE_MEDIA', activeMedia })

export const setSearchStr = (searchStr) => ({ type: 'SET_SEARCH_STR', searchStr })

export const setTeam = (team) => ({ type: 'SET_TEAM', team })

export const setPlayerSkeletonVisible = (playerSkeletonVisible) => ({ type: 'SET_PLAYER_SKELETON_VISIBLE', playerSkeletonVisible })

export const getPlayer = (playerId) => ({
    [CALL_API]: {
        type: 'GET_PLAYER',
        endpoint: `${NHL_API}/people/${playerId}?expand=person.stats&stats=statsSingleSeason,regularSeasonStatRankings`,
        method: 'GET'
    }
})

export const getGame = (gameId) => ({
    [CALL_API]: {
        type: 'GET_GAME',
        endpoint: `${NHL_API}/schedule?gamePk=${gameId}&expand=schedule.game.content.media.epg,schedule.game.content.highlights.scoreboard,schedule.linescore`,
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
        endpoint: `${NHL_API}/people/${playerId}/stats?stats=gameLog&season=${getThisSeason()}`,
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
        endpoint: `${NHL_API}/schedule?teamId=${teamId}&season=${getThisSeason()}`,
        method: 'GET'
    }
})

export const getSeasonStartDate = () => ({
    [CALL_API]: {
        type: 'GET_SEASON_START_DATE',
        endpoint: `${NHL_API}/schedule?season=${getThisSeason()}&startDate=${getThisSeasonStart()}&endDate=${getThisSeasonSecondMonth()}`,
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

export const getSchedule = (startDate, endDate) => ({
    [CALL_API]: {
        type: 'GET_SCHEDULE',
        endpoint: `${NHL_API}/schedule?startDate=${startDate}&endDate=${endDate}`,
        method: 'GET'
    }
})
