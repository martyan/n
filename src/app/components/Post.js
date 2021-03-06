import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useDebounce } from 'use-debounce'
import moment from 'moment'
import { getDateText } from '../helpers/data'
import { goToPlayerFeed } from '../helpers/navigation'
import stringReplace from 'react-string-replace'
import { play } from './icons'
import './Post.scss'

const Video = ({ media }) => {
    const LQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_450K') > -1)
    const HQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_1800K') > -1)
    if(!LQ || !HQ) return null

    return <iframe key={HQ.url} src={HQ.url} frameBorder="0"></iframe>
}

const Thumb = ({ media, activeMedia, setActiveMedia }) => {
    const thumb = media.image.cuts['640x360']
    if(!thumb) return null

    // return (
    //     <img
    //         src={thumb.src}
    //         alt=""
    //         className={activeMedia === media.id ? 'hidden' : ''}
    //         onClick={() => setActiveMedia(media.id)}
    //     />
    // )

    return (
        <LazyLoadImage
            threshold={0}
            // alt={image.alt}
            // width={'100vw'}
            // height={360}
            src={thumb.src} // use normal <img> attributes as props
            onClick={() => setActiveMedia(media.id)}
            className={activeMedia === media.id ? 'hidden' : ''}
        />
    )
}

const Post = ({ playerOnly, date, game, media, players, activeMedia, setActiveMedia }) => {

    const [ debouncedActiveMedia ] = useDebounce(activeMedia, 500)
    const [ ref, inView, entry ] = useInView({
        threshold: 1,
        rootMargin: '-25% 0% -25%',
    })

    const gameDate = moment(date)

    useEffect(() => {
        if(inView) setActiveMedia(media.id)
    }, [inView])

    let desc = media.description
    players.forEach(player => {
        desc = desc.replace(player.person.fullName, player.person.id)
    })

    const enhancedDesc = stringReplace(desc, /(\d{7})/g, (match, i) => {
        const player = players.find(player => player.person.id === parseInt(match))

        return <a key={i} href={`/player/${match}`} onClick={e => goToPlayerFeed(match, e)}>{player.person.fullName}</a>
    })

    return (
        <div className="post">
            <div className="media" ref={ref}>
                <span className={media.id === activeMedia ? 'play is-playing' : 'play'}>
                    {play}
                </span>

                {media.id === debouncedActiveMedia && <Video media={media} />}

                <Thumb
                    media={media}
                    activeMedia={debouncedActiveMedia}
                    setActiveMedia={setActiveMedia}
                />
            </div>
            <div className="caption">
                {enhancedDesc}
            </div>
        </div>
    )

}

export default Post
