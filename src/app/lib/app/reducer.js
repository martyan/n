import { sortTeamsByName, sortPlayersByPoints } from '../../helpers/sort'

export const initialState = {
    measure: 'imperial',
    searchStr: 'cze',
    teams: [],
    allPlayers: [],
    player: null,
    team: null,
    teamSchedule: [],
    teamStats: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_MEASURE':
            console.log(state.measure)
            return {...state, measure: state.measure === 'imperial' ? 'metric' : 'imperial'}

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
            const allPlayers = sortPlayersByPoints(action.payload.teams.reduce((acc, currVal) => {
                const roster = currVal.roster.roster.map(roster => ({...roster, teamId: currVal.id}))
                return [...acc, ...roster]
            }, []))

            return {...state, teams: sortTeamsByName(action.payload.teams), allPlayers}

        default:
            return state
    }
}

export default reducer
