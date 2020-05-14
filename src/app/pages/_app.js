import React from 'react'
import App, { AppInitialProps, AppContext } from 'next/app'
import { connect } from 'react-redux'
import Router from 'next/dist/client/router'
import { setHistory, setPlayerSkeletonVisible } from '../lib/app/actions'
import ReactGA from 'react-ga'
import { wrapper } from '../lib/store'

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

    static getInitialProps = async ({ Component, ctx }) => {

        // ctx.store.dispatch({type: 'TOE', payload: 'was set in _app'})

        return {
            pageProps: {
                // Call page-level getInitialProps
                ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
                // Some custom thing for all pages
                pathname: ctx.pathname
            }
        }

    }

    componentDidMount() {
        const { dispatch } = this.props

        calculateVH()
        window.addEventListener('resize', calculateVH)

        dispatch(setHistory([Router.router.asPath]))

        try {
            ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID)
            logPageView(window)
        } catch(error) {}

        Router.beforePopState(({url, as, opts}) => {
            const { history } = this.props
            if(history.length < 2) return true

            const lastHistory = history[history.length - 2]
            const isGoBack = as === lastHistory

            if(isGoBack) dispatch(setHistory(history.slice(0, history.length - 1)))
            return true
        })

        Router.events.on('routeChangeStart', (route) => {
            if(route === Router.asPath) return

            if(route.indexOf('/player/') > -1) dispatch(setPlayerSkeletonVisible(true))

            const { history } = this.props
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
        const { Component, pageProps } = this.props

        return (
            <Component {...pageProps} />
        )
    }

}

const mapStateToProps = (state) => ({
    history: state.app.history
})

export default wrapper.withRedux(connect(mapStateToProps)(MyApp))
