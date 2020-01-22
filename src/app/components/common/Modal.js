import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveModal from 'react-responsive-modal'
import './Modal.scss'

const mergeClassNames = (classNames) => {
    const classes = {
        modal: 'modal',
        overlay: 'modal-overlay',
        closeButton: 'modal-close'
    }

    if(!classNames) return classes

    if(classNames.modal) classes.modal += ` ${classNames.modal}`
    if(classNames.overlay) classes.overlay += ` ${classNames.overlay}`
    if(classNames.closeButton) classes.closeButton += ` ${classNames.closeButton}`

    return classes
}

const Modal = ({ visible, onClose, classNames, children}) => {
    const mergedClassNames = mergeClassNames(classNames)

    return (
        <ResponsiveModal
            open={visible}
            onClose={onClose ? onClose : () => {}}
            classNames={mergedClassNames}
            showCloseIcon={true}
            center
        >
            {children}
        </ResponsiveModal>
    )
}

Modal.propTypes = {
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    classNames: PropTypes.object
}

export default Modal
