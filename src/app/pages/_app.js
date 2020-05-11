import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import Router from 'next/dist/client/router'
import withRedux from 'next-redux-wrapper'
import { setHistory, setPlayerSkeletonVisible } from '../lib/app/actions'
import createStore from '../lib/store'
import ReactGA from 'react-ga'

let resizeTimeout = null
const calculateVH = () => {
    if(resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
        console.log('resize')
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }, 200)
}

const logPageView = (window) => {
    ReactGA.pageview(window.location.pathname + window.location.search)
}

class MyApp extends App {

    componentDidMount() {
        const { dispatch, getState } = this.props.store

        calculateVH()
        window.addEventListener('resize', calculateVH)

        dispatch(setHistory([Router.router.asPath]))

        try {
            ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID)
            logPageView(window)
        } catch(error) {}

        Router.beforePopState(({url, as, opts}) => {
            const { history } = getState().app
            if(history.length < 2) return true

            const lastHistory = history[history.length - 2]
            const isGoBack = as === lastHistory

            if(isGoBack) dispatch(setHistory(history.slice(0, history.length - 1)))
            return true
        })

        Router.events.on('routeChangeStart', (route) => {
            if(route === Router.asPath) return

            if(route.indexOf('/player/') > -1) dispatch(setPlayerSkeletonVisible(true))

            const { history } = getState().app
            const currentPage = history[history.length - 1]
            const nextRouteIsSame = currentPage === route
            if(!nextRouteIsSame) dispatch(setHistory([...history, route]))
        })

        Router.events.on('routeChangeComplete', () => {
            //scroll to top on page change
            try {
                logPageView(window)
                window.scrollTo(0, 0)
            } catch(error) {}
        })
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
