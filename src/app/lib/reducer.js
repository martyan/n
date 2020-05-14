import { combineReducers } from 'redux'
import auth, { initialState as initialStateAuth } from './auth/reducer'
import app, { initialState as initialStateApp } from './app/reducer'

export const initialState = {
    auth: initialStateAuth,
    app: initialStateApp
}

export default combineReducers({
    auth,
    app
})
