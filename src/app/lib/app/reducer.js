export const initialState = {
    photos: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_PHOTOS_SUCCESS':
            return {...state, photos: action.payload}

        case 'GET_PHOTO_SUCCESS': {
            const photo = state.photos.find(photo => photo.id === action.payload.id)

            if(photo) {
                return {...state, photos: state.photos.map(photo => {
                        if(photo.id === action.payload.id) return action.payload
                        return photo
                    })}
            }

            return {...state, photos: [action.payload, ...state.photos]}
        }

        case 'PHOTO_DELETED':
            return {...state, photos: state.photos.filter(photo => photo.id !== action.photoId)}

        default:
            return state
    }
}

export default reducer
