import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const Video = ({ media }) => {
    const HQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_1800K') > -1)
    if(!HQ) return null

    return <iframe key={HQ.url} src={HQ.url} frameBorder="0"></iframe>
}

const Thumb = ({ media, activeMedia, setActiveMedia }) => {
    const thumb = media.image.cuts['640x360']
    if(!thumb) return null

    return (
        <LazyLoadImage
            // alt={image.alt}
            width={'100vw'}
            // height={360}
            src={thumb.src} // use normal <img> attributes as props
            onClick={() => setActiveMedia(media.id)}
            className={activeMedia === media.id ? 'hidden' : ''}
        />
    )
}

const Media = ({ media, activeMedia, setActiveMedia }) => {

    const [ ref, inView, entry ] = useInView({
        threshold: 1,
        rootMargin: '-25% 0% -25%',
    })

    useEffect(() => {
        if(inView) setActiveMedia(media.id)
    }, [inView])

    return (
        <div className="media" ref={ref}>
            {media.id === activeMedia && <Video media={media} />}
            <Thumb media={media} activeMedia={activeMedia} setActiveMedia={setActiveMedia} />
        </div>
    )

}

export default Media
