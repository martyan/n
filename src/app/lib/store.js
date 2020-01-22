import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from './promiseMiddleware'
import apiMiddleware from './apiMiddleware'
import logger from './logger'
import reducer, { initialState } from './reducer'

export default (initialState = initialState) => {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware, apiMiddleware, promiseMiddleware, logger))
    )
}
