import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const LoadMore = ({ loadMore, noMore }) => {

    const [ ref, inView, entry ] = useInView({
        threshold: 1,
        rootMargin: '-50% 0% 0%',
    })

    useEffect(() => {
        if(inView && !noMore) loadMore()
    }, [inView])

    return (
        <div
            onClick={() => loadMore()}
            ref={ref}
            className="load-more"
        >
            {!noMore ? 'load more' : 'no more'}
        </div>
    )

}

export default LoadMore
