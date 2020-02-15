import React from 'react'

const Title = ({ visible, onClick }) => {
    return (
        <h1 className={visible ? 'title' : 'title hidden'} onClick={onClick}>NHLgram</h1>
    )
}

export default Title
