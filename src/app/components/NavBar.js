import React from 'react'
import { goToSearch, goToHome } from '../helpers/navigation'
import { Router } from '../../functions/routes'
import { home, search, user, back } from './icons'

const NavBar = ({ visible, history }) => {

    const canGoBack = history.length > 1

    return (
        <div className={visible ? 'nav-bar' : 'nav-bar hidden'}>
            <div className="inner">
                <button onClick={() => Router.back()} className={canGoBack ? 'back' : 'back hidden'}>{back}</button>
                <button onClick={() => goToHome()}>{home}</button>
                <button onClick={() => goToSearch()}>{search}</button>
                {/*<button>{user}</button>*/}
            </div>
        </div>
    )

}

export default NavBar
