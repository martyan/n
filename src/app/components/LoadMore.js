import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const LoadMore = ({ loadMore }) => {

    const [ ref, inView, entry ] = useInView({
        threshold: 1,
        rootMargin: '-50% 0% 0%',
    })

    useEffect(() => {
        if(inView) loadMore()
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
