import React, { Component, useState, useEffect, useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

import mantinel from '../static/img/mantinel.png'
import lines from '../static/img/lines.png'
import net from '../static/img/net.png'
import tuukka from '../static/img/tuukka.png'
import puck from '../static/img/puck.png'
import panarin from '../static/img/panarin.png'

class ParallaxCover extends Component {

    render() {

        // const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)
        //
        // if(!canUseDOM) return null

        return (
            <div className="parallax-cover">
                <Parallax pages={2} ref={ref => this.parallax = ref}>
                    <ParallaxLayer offset={0} speed={-1.1} style={{ pointerEvents: 'none' }}>
                        <img className="tuukka" src={tuukka} alt="" />
                        <img className="panarin" src={panarin} alt="" />
                    </ParallaxLayer>
                    {/*<ParallaxLayer offset={1} speed={1} style={{ backgroundColor: '#805E73' }} />*/}
                    {/*<ParallaxLayer offset={2} speed={1} style={{ backgroundColor: '#87BCDE' }} />*/}
                    {/*<ParallaxLayer offset={0} speed={0.5}>*/}
                        {/*<span onClick={() => this.parallax.scrollTo(1)}>Layers can contain anything</span>*/}
                    {/*</ParallaxLayer>*/}
                </Parallax>
            </div>
        )
    }

    // return (
    //     <div className={cover ? 'cover active' : 'cover'} onClick={() => setCover(!cover)}>
    //         <div className="inner">
    //             <img className="mantinel" src={mantinel} alt="" />
    //             <img className="lines" src={lines} alt="" />
    //             <img className="net" src={net} alt="" />
    //             <img className="tuukka" src={tuukka} alt="" />
    //             <img className="puck" src={puck} alt="" />
    //             <animated.img style={{ transform: interpHeader }} className="panarin" src={panarin} />
    //         </div>
    //     </div>
    // )

}

export default ParallaxCover
