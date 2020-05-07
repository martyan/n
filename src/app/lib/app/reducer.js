import { sortTeamsByName, sortPlayersByPoints } from '../../helpers/sort'
import { getPlayersFromTeams } from '../../helpers/data'

export const initialState = {
    indexInited: false,
    scheduleOffset: 0,
    loadedContentIndex: 0,
    activeMedia: null,
    teams: [],
    allPlayers: [],
    player: null,
    playerSchedule: [],
    playerHistory: [],
    playerSkeletonVisible: false,
    team: null,
    teamSchedule: [],
    teamStats: [],
    gameContent: [],
    game: null,
    schedule: [],
    games: [],
    history: [],
    nationalities: [],
    UIVisible: false,
    standings: [],
    filters: {
        searchStr: '',
        teamId: null,
        position: null,
        nationality: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return {...state, filters: {...state.filters, [action.key]: action.value}}

        case 'SET_INDEX_INITED':
            return {...state, indexInited: action.indexInited}

        case 'SET_UI_VISIBLE':
            return {...state, UIVisible: action.UIVisible}

        case 'SET_HISTORY':
            return {...state, history: action.history}

        case 'SET_ACTIVE_MEDIA':
            return {...state, activeMedia: action.activeMedia}

        case 'SET_TEAM':
            return {...state, team: action.team}

        case 'SET_SCHEDULE_OFFSET':
            return {...state, scheduleOffset: action.scheduleOffset}

        case 'SET_LOADED_CONTENT_INDEX':
            return {...state, loadedContentIndex: action.loadedContentIndex}

        case 'GET_PLAYER_REQUEST':
            return {...state, player: null}

        case 'GET_PLAYER_SUCCESS':
            return {...state, player: action.payload.people[0]}

        case 'GET_PLAYER_HISTORY_REQUEST':
            return {...state, playerHistory: []}

        case 'GET_PLAYER_HISTORY_SUCCESS':
            return {...state, playerHistory: action.payload.people[0].stats[0].splits}

        case 'GET_TEAM_SUCCESS':
            return {...state, team: action.payload.teams[0]}

        case 'GET_TEAM_SCHEDULE_SUCCESS':
            return {...state, teamSchedule: action.payload.dates}

        case 'GET_TEAM_STATS_SUCCESS':
            return {...state, teamStats: action.payload.stats}

        case 'GET_TEAMS_SUCCESS':
            const allPlayers = getPlayersFromTeams(action.payload.teams)
            const nationalities = allPlayers.map(player => player.person.nationality)

            const nationalitiesCount = {}
            nationalities.map(nationality => {
                nationalitiesCount[nationality] = nationalitiesCount.hasOwnProperty(nationality) ? nationalitiesCount[nationality] + 1 : 1
            })

            const uniqueNationalities = nationalities
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort((a, b) => {
                    if(nationalitiesCount[a] > nationalitiesCount[b]) return -1
                    if(nationalitiesCount[a] < nationalitiesCount[b]) return 1
                    return 0
                })

            return {...state, teams: sortTeamsByName(action.payload.teams), allPlayers: sortPlayersByPoints(allPlayers), nationalities: uniqueNationalities}

        case 'SET_PLAYER_SKELETON_VISIBLE':
            return {...state, playerSkeletonVisible: action.playerSkeletonVisible}

        case 'GET_PLAYER_SCHEDULE_REQUEST':
            return {...state, playerSchedule: [], gameContent: []}

        case 'GET_PLAYER_SCHEDULE_SUCCESS':
            return {...state, playerSchedule: action.payload.stats[0].splits}

        case 'GET_GAME_REQUEST':
            return {...state, game: null}

        case 'GET_GAME_SUCCESS':
            return {...state, games: [...state.games, action.payload.dates[0].games[0]]}

        case 'GET_GAME_CONTENT_SUCCESS':
            return {...state, gameContent: [...state.gameContent, action.payload]}

        case 'GET_SCHEDULE_SUCCESS':
            return {...state, schedule: [...state.schedule, [...action.payload.dates.reverse()]]}

        case 'GET_STANDINGS_SUCCESS':
            return {...state, standings: action.payload.records}

        default:
            return state
    }
}

export default reducer
