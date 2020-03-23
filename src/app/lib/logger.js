export default store => next => action => {
    if(
        action.type.indexOf('SET_UI_VISIBLE') === -1 &&
        action.type.indexOf('_SKELETON_') === -1 &&
        action.type.indexOf('SET_HISTORY') === -1
    ) console.info(action.type, action)
    return next(action)
}
