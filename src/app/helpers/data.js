import moment from 'moment'

export const getPlayersFromTeams = (teams) => {
    return teams.reduce((acc, currVal) => {
        const roster = currVal.roster.roster.map(roster => ({...roster, teamId: currVal.id}))
        return [...acc, ...roster]
    }, [])
}

const getMonthStart = (date) => date.clone().set('date', 1).format('YYYY-MM-DD')
const getMonthEnd = (date) => date.clone().set('date', 1).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD')

export const gameHasContent = (game) => game.content.highlights.scoreboard.items.length > 0

export const isGoalie = (player) => player.primaryPosition.code === 'G'

export const getPlayersMedia = (player, media) => media.filter(m => m.description.indexOf(player.lastName) > -1)

export const getDateWZero = (d) => (d < 10 ? '0' : '') + d

export const getDateText = (d) => {
    const now = moment.utc()
    const today = moment.utc(now.format('YYYY-MM-DD'))
    const yesterday = moment.utc(now.format('YYYY-MM-DD')).subtract(1, 'day')
    const daysDiff = today.diff(d, 'days')
    const hoursDiff = now.diff(d, 'hours')

    if(d.isSame(today, 'day')) {
        if(hoursDiff === 1) return 'hour ago'
        return `${hoursDiff} hours ago`
    }

    if(d.isSame(yesterday, 'day')) return 'Yesterday'
    if(d.isSame(today, 'week')) return `on ${d.format('dddd')}`
    else {
        if(daysDiff < 4) return `${daysDiff} days ago`
        if(now.get('year') > d.get('year')) return d.format('D MMM YYYY')
        return d.format('D MMM')
    }
}

export const getPlayedGames = (teamSchedule) => {
    const today = moment.utc()
    return teamSchedule.filter(schedule => schedule.games[0].status.abstractGameState === 'Final' && schedule.date <= today.format('YYYY-MM-DD')).reverse()
}

export const getGameIdFromLink = (link) => {
    const [ string, gameId ] = /\/(\d+)\//g.exec(link)
    return gameId
}

export const getThisSeason = () => {
    const today = moment.utc()
    if(today.get('month') + 1 <= 9) return `${moment.utc().subtract(1, 'year').get('year')}${moment.utc().get('year')}`
    return `${moment.utc().get('year')}${moment().add(1, 'year').get('year')}`
}

export const getThisSeasonStart = () => {
    const today = moment.utc()
    const firstDayOfMonth = today.clone().set('date', 1)

    //nhl season starts ~september
    if(today.get('month') + 1 <= 9) return `${firstDayOfMonth.subtract(1, 'year').set('month', 8).format('YYYY-MM-DD')}`
    return `${firstDayOfMonth.format('YYYY-MM-DD')}`
}

export const getThisSeasonSecondMonth = () => {
    const today = moment.utc()
    const firstDayOfMonth = today.clone().set('date', 1)
    if(today.get('month') + 1 <= 9) return `${firstDayOfMonth.subtract(1, 'year').set('month', 9).format('YYYY-MM-DD')}`
    return `${firstDayOfMonth.add(1, 'month').format('YYYY-MM-DD')}`
}
