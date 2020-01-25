import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import Router from 'next/dist/client/router'
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

export const SettingsContext = React.createContext({})

class MyApp extends App {

    componentDidMount() {
        calculateVH()
        window.addEventListener('resize', calculateVH)

        Router.events.on('routeChangeComplete', () => {
            //scroll to top on page change
            try {
                window.scrollTo(0, 0)
            } catch(error) {}
        })
    }

    render () {
        const { Component, pageProps, store } = this.props

        return (
            <Container>
                <Provider store={store}>
                    <SettingsContext.Provider value={{
                        measure: store.getState().app.measure,
                        toggleMeasure: () => store.dispatch({ type: 'TOGGLE_MEASURE' })
                    }}>
                        <>
                            <Head>
                                <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
                            </Head>
                            <Component {...pageProps} />
                        </>
                    </SettingsContext.Provider>
                </Provider>
            </Container>
        )
    }

}

export default withRedux(createStore)(MyApp)
