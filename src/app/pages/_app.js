import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import createStore from '../lib/store'

let resizeTimeout = null
const calculateVH = () => {
    if(resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
        console.log('resize')
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }, 200)
}

class MyApp extends App {

    componentDidMount() {
        calculateVH()
        window.addEventListener('resize', calculateVH)
    }

    render () {
        const { Component, pageProps, store } = this.props

        return (
            <Container>
                <Provider store={store}>
                    <>
                        <Head>
                            <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
                        </Head>
                        <Component {...pageProps} />
                    </>
                </Provider>
            </Container>
        )
    }

}

export default withRedux(createStore)(MyApp)
