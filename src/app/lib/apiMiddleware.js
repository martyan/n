import axios from 'axios'

export const CALL_API = 'Call API'
// export const ROOT_URI = process.env.NODE_ENV === 'production' ? '/api' : `https://${process.env.FIREBASE_AUTH_DOMAIN}/api`

const callApi = ({ endpoint, method, data, download }) => {
    const headers = {}

    try {
        if(window) {
            // headers['X-Origin'] = window.location.href

            // const ln = 'en' //window.localStorage.getItem('ln')
            // if(ln) headers['Accept-Language'] = ln

            // const token = window.localStorage.getItem('jwt')
            // if(token) headers['X-Authorization'] = token
        }
    } catch(err) {
        console.log(err)
    }

    const config = {
        method,
        url: endpoint,
        data: data || null,
        validateStatus: () => true,
        headers,
        responseType: download ? 'blob' : 'json'
    }

    return axios(config)
}

export default store => next => action => {
    const callAPI = action[CALL_API]
    if(typeof callAPI === 'undefined') return next(action)

    const { endpoint, method, data, download } = callAPI

    next({type: `${callAPI.type}_REQUEST`})

    return callApi({ endpoint, method, data, download })
        .then(response => {
            if(response.status >= 200 && response.status < 400) {
                //success
                const data = download ? response : response.data

                next({type: `${callAPI.type}_SUCCESS`, payload: data})

                return Promise.resolve(data)
            } else {
                //failure
                next({type: `${callAPI.type}_FAILURE`})

                return Promise.reject(response.data)
            }
        }, error => {
            //network error
            next({type: `${callAPI.type}_FAILURE`})

            return Promise.reject(error)
        })
}
