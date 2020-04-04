import React, { useState, useEffect, useRef } from 'react'
import { useSpring, animated, interpolate } from 'react-spring'
import './Intro.scss'

import fans from '../static/img/fans.png'
import mantinel from '../static/img/mantinel.png'
import lines from '../static/img/lines.png'
import net from '../static/img/net.png'
import tuukka from '../static/img/tuukka.png'
import puck from '../static/img/puck.png'
import panarin from '../static/img/panarin.png'

const back = <svg viewBox="0 0 19 10"><g><polygon fill="#FFFFFF" points="19,1 9.5,10 0,1 1.1,0 9.5,8 17.9,0"/></g></svg>

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

const Intro = () => {

    const ref = useRef(null)
    const [ scrollY, setScrollY ] = useState(0)
    const [ prlxHeight, setPrlxHeight ] = useState(0)
    const [ introFixed, setIntroFixed ] = useState(true)
    const [ arrowVisible, setArrowVisible ] = useState(true)

    const parallaxActiveHeight = prlxHeight

    useEffect(() => {
        setPrlxHeight(ref.current.offsetHeight)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 1) setArrowVisible(false)
            if(window.scrollY > window.innerHeight) setIntroFixed(false)
            else if(window.scrollY <= window.innerHeight) setIntroFixed(true)
            setScrollY(window.scrollY)
        }
        // window.addEventListener("scroll", debounce(handleScroll))
        window.addEventListener("scroll", handleScroll)

        // return () => window.removeEventListener("scroll", debounce(handleScroll))
        return () => window.removeEventListener("scroll", handleScroll)
    }, [debounce])

    const [ { springscrollY }, springsetScrollY ] = useSpring(() => ({
        springscrollY: 0,
        config: {tension: 0, friction: 2, precision: 0.1}
    }))

    if(scrollY < parallaxActiveHeight) springsetScrollY({ springscrollY: scrollY })
    const spring = springscrollY.interpolate({range: [0, parallaxActiveHeight], output: [0, 100]})
    const springBlur = springscrollY.interpolate({range: [0, parallaxActiveHeight / 2 - 100, parallaxActiveHeight / 2, parallaxActiveHeight], output: [0, 0, 100, 100]})

    const iFans = spring.interpolate(
        o => `translateX(-${o * 0.15}%) translateY(${o * 2.9}%) scale(${1 + (0.1 / 100 * o)})`
    )

    const iMantinel = spring.interpolate(
        o => `translateX(-${o * 0.05}%) translateY(${o * 2.4}%) scale(${1 + (0.1 / 100 * o)})`
    )

    const iNet = spring.interpolate(
        o => `translateX(-${o * 0.28}%) translateY(${o * 2.8}%) scale(${1 + (0.15 / 100 * o)})`
    )

    const iLines = spring.interpolate(
        o => `translateX(-${o * 0.11}%) translateY(${o * 4.7}%) scaleX(${1 + (0.1 / 100 * o)}) scaleY(${1 + (0.5 / 100 * o)})`
    )

    const iTuukka = spring.interpolate(
        o => `translateX(-${o * 0.30}%) translateY(${o * 1.94}%) scale(${1 + (0.18   / 100 * o)})`
    )

    const iPanarin = spring.interpolate(
        o => `translateX(${o * 0.15}%) translateY(${o * 1.1}%) scale(${1 + (0.3 / 100 * o)})`
    )

    const iOtherBlur = springBlur.interpolate(
        o => `blur(${1 - (1 / 100 * o)}px)`
    )

    const iPanarinBlur = springBlur.interpolate(
        o => `blur(${0 + (1 / 100 * o)}px)`
    )

    const iPuck = spring.interpolate(
        o => `translateX(-${o * 11}%) translateY(${o * 20}%) scale(${1 - (0.2 / 100 * o)}) rotate(-10deg)`
    )

    const iWelcome = springscrollY.interpolate({range: [0, 60], output: [0, 100]}).interpolate(
        o => `${1 - (1 / 100 * o)}`
    )

    return (
        <div className={introFixed ? 'intro fixed' : 'intro'} ref={ref}>
            <div className="inner">
                <animated.div style={{ opacity: iWelcome }} className="overlay">
                    <h1>
                        <div className="gram">NHLgram</div>
                        <div className="dash">-</div>
                        <div className="feed">
                            {/*<span>unofficial</span>*/}
                            {/*<span>NHL</span>*/}
                            {/*<span>feed</span>*/}
                            <span>unofficial</span>
                            <span>video</span>
                            <span>feed</span>
                        </div>
                        <div className="videos">
                            {/*<span>with</span>*/}
                            {/*<span>latest</span>*/}
                            {/*<span>videos</span>*/}
                            {/*<span>of</span>*/}
                            {/*<span>play</span>*/}
                            <span>of</span>
                            <span>current</span>
                            <span>NHL</span>
                            <span>season</span>
                            {/*<span>of</span>*/}
                            {/*<span>current</span>*/}
                            {/*<span>NHL</span>*/}
                            {/*<span>season</span>*/}
                        </div>
                    </h1>
                    <div className={arrowVisible ? 'scroll' : 'scroll hidden'}>{back}</div>
                </animated.div>
                <div className="parallax">
                    <animated.img style={{ transform: iFans }} className="fans" src={fans} />
                    <animated.img style={{ transform: iMantinel }} className="mantinel" src={mantinel} />
                    <animated.img style={{ transform: iLines, filter: iOtherBlur }} className="lines" src={lines} />
                    <animated.img style={{ transform: iNet, filter: iOtherBlur }} className="net" src={net} />
                    <animated.img style={{ transform: iTuukka, filter: iOtherBlur }} className="tuukka" src={tuukka} />
                    <animated.img style={{ transform: iPuck }} className="puck" src={puck} />
                    <animated.img style={{ transform: iPanarin, filter: iPanarinBlur }} className="panarin" src={panarin} />
                </div>
            </div>
        </div>
    )

}

export default Intro
