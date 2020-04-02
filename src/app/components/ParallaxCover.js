import React, { useState, useEffect } from 'react'
import { useSpring, animated, interpolate } from 'react-spring'

import mantinel from '../static/img/mantinel.png'
import lines from '../static/img/lines.png'
import net from '../static/img/net.png'
import tuukka from '../static/img/tuukka.png'
import puck from '../static/img/puck.png'
import panarin from '../static/img/panarin.png'

const debounce = (func, wait = 5, immediate = true) => {
    let timeout
    return function() {
        const context = this
        const args = arguments
        const later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

const ParallaxCover = () => {

    const [ cover, setCover ] = useState(false)
    const [ scrollY, setScrollY ] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", debounce(handleScroll))

        return () => window.removeEventListener("scroll", debounce(handleScroll))
    }, [debounce])

    const [ { springscrollY }, springsetScrollY ] = useSpring(() => ({
        springscrollY: 0
    }))

    const parallaxLevel = 20
    springsetScrollY({ springscrollY: scrollY })

    const interpHeader = springscrollY.interpolate(
        o => `translateX(${o / parallaxLevel}px) translateY(-${o / parallaxLevel}px)`
    )

    // const [{ st, xy }, set] = useSpring(() => ({ st: 0, xy: [0, 0] }))
    // const interpPanarin = interpolate([st, xy], (o, xy) => `translate(${xy[0] / 25},${xy[1] / 25 + -10 + o / 8})`)

    return (
        <div className={cover ? 'cover active' : 'cover'} onClick={() => setCover(!cover)}>
            <div className="inner">
                <img className="mantinel" src={mantinel} alt="" />
                <img className="lines" src={lines} alt="" />
                <img className="net" src={net} alt="" />
                <img className="tuukka" src={tuukka} alt="" />
                <img className="puck" src={puck} alt="" />
                <animated.img style={{ transform: interpHeader }} className="panarin" src={panarin} />
            </div>
        </div>
    )

}

export default ParallaxCover
