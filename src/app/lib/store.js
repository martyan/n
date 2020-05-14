import { createStore, applyMiddleware } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from './apiMiddleware'
import promiseMiddleware from './promiseMiddleware'
import logger from './logger'
import reducer, { initialState } from './reducer'

const makeStore = (context) => {
    const store = createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware, apiMiddleware, promiseMiddleware, logger))
    )

    return store
}

export const wrapper = createWrapper(makeStore, {debug: true})
