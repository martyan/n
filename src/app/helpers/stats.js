export const getRankText = (rank) => {
    switch(rank) {
        case 'rankPowerPlayGoals':
            return 'Power play goals'
        case 'rankBlockedShots':
            return 'Blocked shots'
        case 'rankAssists':
            return 'Assists'
        case 'rankShotPct':
            return 'Shot percentage'
        case 'rankGoals':
            return 'Goals'
        case 'rankHits':
            return 'Hits'
        case 'rankPenaltyMinutes':
            return 'Penalty minutes'
        case 'rankShortHandedGoals':
            return 'Short-handed goals'
        case 'rankPlusMinus':
            return '+ -'
        case 'rankShots':
            return 'Shots'
        case 'rankPoints':
            return 'Points'
        case 'rankOvertimeGoals':
            return 'Overtime goals'
        case 'rankGamesPlayed':
            return 'Games played'
        case 'shutOuts':
            return 'Shutouts'
        case 'shotsAgainst':
            return 'Shots against'
        case 'ot':
            return 'Overtime'
        case 'timeOnIce':
            return 'Time on ice'
        case 'saves':
            return 'Saves'
        case 'losses':
            return 'Losses'
        case 'goalsAgainst':
            return 'Goals against'
        case 'savePercentage':
            return 'Save percentage'
        case 'games':
            return 'Games'
        case 'goalsAgainstAverage':
            return 'Goals against average'
        case 'wins':
            return 'Wins'
        default:
            return rank
    }
}

export const getStatName = (rank) => {
    switch(rank) {
        case 'rankPowerPlayGoals':
            return 'powerPlayGoals'
        case 'rankBlockedShots':
            return 'blocked'
        case 'rankAssists':
            return 'assists'
        case 'rankShotPct':
            return 'shotPct'
        case 'rankGoals':
            return 'goals'
        case 'rankHits':
            return 'hits'
        case 'rankPenaltyMinutes':
            return 'penaltyMinutes'
        case 'rankShortHandedGoals':
            return 'shortHandedGoals'
        case 'rankPlusMinus':
            return 'plusMinus'
        case 'rankShots':
            return 'shots'
        case 'rankPoints':
            return 'points'
        case 'rankOvertimeGoals':
            return 'overTimeGoals'
        case 'rankGamesPlayed':
            return 'games'
        case 'shutOuts':
            return 'shutouts'
        case 'shotsAgainst':
            return 'shotsAgainst'
        case 'ot':
            return 'ot'
        case 'timeOnIce':
            return 'timeOnIce'
        case 'saves':
            return 'saves'
        case 'losses':
            return 'losses'
        case 'goalsAgainst':
            return 'goalsAgainst'
        case 'savePercentage':
            return 'savePercentage'
        case 'games':
            return 'games'
        case 'goalsAgainstAverage':
            return 'goalAgainstAverage'
        case 'wins':
            return 'wins'
        default:
            return rank
    }
}
