import { getStats } from './data'

export const sortTeamsByName = (teams) => {
    return teams.sort((a, b) => {
        if(a.name > b.name) return 1
        if(a.name < b.name) return -1
        return 0
    })
}

export const sortPlayersByTOI = (roster) => {
    return roster.sort((a, b) => {
        if(!a.person.hasOwnProperty('stats') || !b.person.hasOwnProperty('stats')) return 0

        const statsA = getStats('statsSingleSeason', a.person.stats)
        const statsB = getStats('statsSingleSeason', b.person.stats)

        if(!statsA) return 1
        if(!statsB) return -1

        const [ mA, sA ] = statsA.timeOnIce.split(':').map(stat => parseInt(stat))
        const [ mB, sB ] = statsB.timeOnIce.split(':').map(stat => parseInt(stat))
        const totalA = mA * 60 + sA
        const totalB = mB * 60 + sB

        if(totalA < totalB) return 1
        if(totalA > totalB) return -1

        return 0
    })
}

export const sortPlayersByPoints = (roster) => {
    return roster.sort((a, b) => {
        if(!a.person.hasOwnProperty('stats') || !b.person.hasOwnProperty('stats')) return 0

        const statsA = getStats('statsSingleSeason', a.person.stats)
        const statsB = getStats('statsSingleSeason', b.person.stats)

        if(!statsA) return 1
        if(!statsB) return -1

        const isGoalie = (stat) => !stat.hasOwnProperty('points')

        if(isGoalie(statsA) && isGoalie(statsB)) {
            if(statsA.savePercentage > statsB.savePercentage) return -1
            if(statsA.savePercentage < statsB.savePercentage) return 1
        } else {
            if(isGoalie(statsA)) return -1
            if(isGoalie(statsB)) return 1
        }

        if(statsA.points < statsB.points) return 1
        if(statsA.points > statsB.points) return -1

        return 0
    })
}

export const shuffle = (a) => {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}
