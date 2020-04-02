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
    const [ prlxHeight, setPrlxHeight ] = useState(0)


    useEffect(() => {
        setPrlxHeight(window.innerHeight)
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", debounce(handleScroll))
        // window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", debounce(handleScroll))
        // return () => window.removeEventListener("scroll", handleScroll)
    }, [debounce])

    const [ { springscrollY }, springsetScrollY ] = useSpring(() => ({
        springscrollY: 0,
        config: {
            mass: 100,
            tension: 0,
            friction: 1
        }
    }))

    const parallaxActiveHeight = prlxHeight / 1.5
    if(scrollY < parallaxActiveHeight) springsetScrollY({ springscrollY: scrollY })
    const spring = springscrollY.interpolate({range: [0, parallaxActiveHeight], output: [0, 100]})
    const springBlur = springscrollY.interpolate({range: [0, parallaxActiveHeight / 2 - 100, parallaxActiveHeight / 2, parallaxActiveHeight], output: [0, 0, 100, 100]})

    const iMantinel = spring.interpolate(
        o => `translateX(-${o * 0.05}%) translateY(${o * 2.4}%) scale(${1 + (0.1 / 100 * o)})`
    )

    const iNet = spring.interpolate(
        o => `translateX(-${o / 6}%) translateY(${o * 2.6}%) scale(${1 + (0.1 / 100 * o)})`
    )

    const iLines = spring.interpolate(
        o => `translateX(-${o / 12}%) translateY(${o * 5.45}%) scaleY(${1 + (0.5 / 100 * o)})`
    )

    const iTuukka = spring.interpolate(
        o => `translateX(-${o * 0.19}%) translateY(${o * 1.72}%) scale(${1 + (0.07 / 100 * o)})`
    )

    const iPanarin = spring.interpolate(
        o => `translateX(${o * 0.25}%) translateY(${o / 1.5}%) scale(${1 + (0.1 / 100 * o)})`
    )

    const iOtherBlur = springBlur.interpolate(
        o => `blur(${1 - (1 / 100 * o)}px)`
    )

    const iPanarinBlur = springBlur.interpolate(
        o => `blur(${0 + (1 / 100 * o)}px)`
    )

    const iPuck = spring.interpolate(
        o => `translateX(-${o * 8.9}%) translateY(${o * 12}%) scale(${1 - (0.3 / 100 * o)}) rotate(-10deg)`
    )

    // const [{ st, xy }, set] = useSpring(() => ({ st: 0, xy: [0, 0] }))
    // const interpPanarin = interpolate([st, xy], (o, xy) => `translate(${xy[0] / 25},${xy[1] / 25 + -10 + o / 8})`)

    return (
        <div className={cover ? 'cover active' : 'cover'} onClick={() => setCover(!cover)}>
            <div className="inner">
                <animated.img style={{ transform: iMantinel }} className="mantinel" src={mantinel} />
                <animated.img style={{ transform: iLines, filter: iOtherBlur }} className="lines" src={lines} />
                <animated.img style={{ transform: iNet, filter: iOtherBlur }} className="net" src={net} />
                <animated.img style={{ transform: iTuukka, filter: iOtherBlur }} className="tuukka" src={tuukka} />
                <animated.img style={{ transform: iPuck }} className="puck" src={puck} />
                <animated.img style={{ transform: iPanarin, filter: iPanarinBlur }} className="panarin" src={panarin} />
            </div>
        </div>
    )

}

export default ParallaxCover
