import { sortTeamsByName, sortPlayersByPoints } from '../../helpers/sort'
import { getPlayersFromTeams } from '../../helpers/data'

export const initialState = {
    searchStr: 'cze',
    teams: [],
    allPlayers: [],
    player: null,
    playerSchedule: [],
    playerSkeletonVisible: false,
    team: null,
    teamSchedule: [],
    teamStats: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SEARCH_STR':
            return {...state, searchStr: action.searchStr }

        case 'SET_TEAM':
            return {...state, team: action.team}

        case 'GET_PLAYER_SUCCESS':
            return {...state, player: action.payload.people[0]}

        case 'GET_TEAM_SUCCESS':
            return {...state, team: action.payload.teams[0]}

        case 'GET_TEAM_SCHEDULE_SUCCESS':
            return {...state, teamSchedule: action.payload.dates}

        case 'GET_TEAM_STATS_SUCCESS':
            return {...state, teamStats: action.payload.stats}

        case 'GET_TEAMS_SUCCESS':
            const allPlayers = getPlayersFromTeams(action.payload.teams)
            return {...state, teams: sortTeamsByName(action.payload.teams), allPlayers: sortPlayersByPoints(allPlayers)}

        case 'SET_PLAYER_SKELETON_VISIBLE':
            return {...state, playerSkeletonVisible: action.playerSkeletonVisible}

        case 'GET_PLAYER_SCHEDULE_SUCCESS':
            return {...state, playerSchedule: action.payload.stats[0].splits}

        default:
            return state
    }
}

export default reducer
