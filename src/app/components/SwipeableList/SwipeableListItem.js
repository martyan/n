import React, { useRef, useEffect } from 'react'
import './SwipeableListItem.css'

function SwipeableListItem(props) {
    const listElementRef = useRef()
    const wrapperRef = useRef()
    const backgroundRef = useRef()

    const dragStartXRef = useRef(0)
    const leftRef = useRef(0)
    const draggedRef = useRef(false)

    useEffect(() => {
        window.addEventListener('mouseup', onDragEndMouse)
        window.addEventListener('touchend', onDragEndTouch)
        return () => {
            window.removeEventListener("mouseup", onDragEndMouse);
            window.removeEventListener("touchend", onDragEndTouch);
        }
    }, [])

    function onDragStartMouse(evt) {
        onDragStart(evt.clientX)
        window.addEventListener('mousemove', onMouseMove)
    }

    function onDragStartTouch(evt) {
        const touch = evt.targetTouches[0]
        onDragStart(touch.clientX)
        window.addEventListener('touchmove', onTouchMove)
    }

    function onDragStart(clientX) {
        draggedRef.current = true
        dragStartXRef.current = clientX

        listElementRef.current.className = 'ListItem'

        requestAnimationFrame(updatePosition)
    }

    function updatePosition() {
        if(draggedRef.current) {
            requestAnimationFrame(updatePosition);
        }

        listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;

        // Fade the opacity
        const opacity = (Math.abs(leftRef.current) / 100).toFixed(2);
        if(opacity < 1 && opacity.toString() !== backgroundRef.current.style.opacity) {
            backgroundRef.current.style.opacity = opacity.toString();
        }
        if(opacity >= 1) {
            backgroundRef.current.style.opacity = "1";
        }
    }

    function onMouseMove(evt) {
        const left = evt.clientX - dragStartXRef.current
        if(left < 0) {
            leftRef.current = left
        }
    }

    function onTouchMove(evt) {
        const touch = evt.targetTouches[0]
        const left = touch.clientX - dragStartXRef.current
        if(left < 0) {
            leftRef.current = left
        }
    }

    function onDragEndMouse(evt) {
        window.removeEventListener('mousemove', onMouseMove)
        onDragEnd()
    }

    function onDragEndTouch(evt) {
        window.removeEventListener('touchmove', onTouchMove)
        onDragEnd()
    }

    function onDragEnd() {
        if(draggedRef.current) {
            draggedRef.current = false
            const threshold = props.threshold || 0.3

            if(leftRef.current < listElementRef.current.offsetWidth * threshold * -1) {
                leftRef.current = (-listElementRef.current.offsetWidth * 2)

                wrapperRef.current.style.maxHeight = 0
                onSwiped()
            } else {
                leftRef.current = 0
            }

            listElementRef.current.className = 'BouncingListItem'
            listElementRef.current.style.transform = `translateX(${leftRef.current}px)`
        }
    }

    function onSwiped() {
        if(props.onSwipe) {
            props.onSwipe()
        }
    }

    return (
        <>
            <div className='Wrapper' ref={wrapperRef}>
                <div className='Background' ref={backgroundRef}>
                    <span>Delete</span>
                </div>
                <div className='ListItem' ref={listElementRef}
                     onMouseDown={onDragStartMouse}
                     onTouchStart={onDragStartTouch}>
                    {props.children}
                </div>
            </div>
        </>
    )
}


export default SwipeableListItem
