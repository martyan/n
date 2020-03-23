import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const LoadMore = ({ loadMore }) => {

    const [ ref, inView, entry ] = useInView({
        threshold: 1,
        rootMargin: '-50% 0% 0%',
    })

    useEffect(() => {
        if(inView) {
            console.error('LOAD MORE triggered by INTERSECTION OBSERVER')
            loadMore()
        }
    }, [inView])

    return (
        <div
            onClick={() => loadMore()}
            ref={ref}
            className="load-more"
        >
            load more
        </div>
    )

}

export default LoadMore
