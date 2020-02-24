import React from 'react'

const Title = ({ visible }) => {
    return (
        <h1 className={visible ? 'title' : 'title hidden'}>NHLgram</h1>
    )
}

export default Title
