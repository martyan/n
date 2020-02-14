import React from 'react'
import { Router } from '../../functions/routes'
import { arrow } from './icons'

const BackBtn = ({ visible }) => {
    return (
        <button className={visible ? 'back-btn' : 'back-btn hidden'} onClick={() => window.history.back()}>
            {arrow}
        </button>
    )
}

export default BackBtn
