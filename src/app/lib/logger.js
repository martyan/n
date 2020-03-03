export default store => next => action => {
    if(action.type.indexOf('SET_UI_VISIBLE') === -1) console.info(action.type, action)
    return next(action)
}
