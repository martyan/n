import React from 'react'
import useDebounce from 'use-debounce/lib/useDebounce'

const PlayerSkeleton = ({ playerSkeletonVisible }) => {

    const [ debouncedPlayerSkeletonVisible ] = useDebounce(playerSkeletonVisible, 1500)

    // if(!playerSkeletonVisible && !debouncedPlayerSkeletonVisible) return null

    return (
        <div className={playerSkeletonVisible ? 'skeleton' : 'skeleton hidden'}>

            <div className="picture gradient"></div>
            <div className="number gradient"></div>
            <div className="name gradient"></div>
            <div className="team-logo gradient"></div>
            <div className="position gradient"></div>
            <div className="stats gradient"></div>
            <div className="video gradient"></div>
            <div className="row-1 gradient"></div>
            <div className="row-2 gradient"></div>

        </div>
    )

}

export default PlayerSkeleton
