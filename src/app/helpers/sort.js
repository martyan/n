import { getStats } from '../components/TeamFeed'

export const sortTeamsByName = (teams) => {
    return teams.sort((a, b) => {
        if(a.name > b.name) return 1
        if(a.name < b.name) return -1
        return 0
    })
}

export const sortPlayersByTOI = (roster) => {
    return roster.sort((a, b) => {
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
