import React from 'react'
import { Router } from '../../functions/routes'
import { arrow } from './icons'

const BackBtn = () => {
    return (
        <button className="back-btn" onClick={() => window.history.back()}>
            {arrow}
        </button>
    )
}

export default BackBtn
