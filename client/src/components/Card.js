// I used this in help: https://www.npmjs.com/package/react-swipeable

import React, { useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import '../css/Card.css'

const Card = ({ content, onLike, onDislike, isLastCard }) => {
    const [positionX, setPositionX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const cardRef = useRef(null)

    const handleSwipe = (deltaX) => {
        if (!isLastCard) {
            if (Math.abs(deltaX) > 50) {
                deltaX > 0 ? onLike && onLike() : onDislike && onDislike()
            }
            const newPosition = deltaX > 0 ? window.innerWidth : -window.innerWidth
            setPositionX(newPosition)

            setTimeout(() => {
                setPositionX(0)
            }, 600)
        } else {
            setPositionX(0)
        }
    }

    const swipeHandlers = useSwipeable({
        onSwiping: ({ deltaX }) => setPositionX(deltaX),
        onSwiped: ({ deltaX }) => handleSwipe(deltaX),
        preventDefaultTouchmoveEvent: true,
    })

    // Handling the situation when the card is moved
    const handleMouseDown = (event) => {
        if (!isLastCard) {
            setIsDragging(true)
            setPositionX(0)
        }
    }

    const handleMouseMove = (event) => {
        if (!isLastCard && isDragging) {
            let deltaX
            if (event.movementX !== undefined) {
                deltaX = event.movementX
            } else if (event.targetTouches && event.targetTouches[0]) {
                deltaX = event.screenX - event.targetTouches[0].screenX
            } else {
                deltaX = 0
            }

            const newPosition = positionX + deltaX
            setPositionX(newPosition)
        }
    }

    // Handling the let go of the card
    const handleMouseUp = () => {
        if (!isLastCard && isDragging) {
            setIsDragging(false)

            if (positionX > 50) {
                onLike && onLike()
                setPositionX(500)
            } else if (positionX < -50) {
                onDislike && onDislike()
                setPositionX(-500) 
            }

            setTimeout(() => {
                setPositionX(0)
            }, 600)
        }
    }

    // Handling the swipe with arrowkeys
    const handleKeyDown = (event) => {
        if (!isLastCard && !isDragging) {
            if (event.key === 'ArrowRight') {
                onLike && onLike()
                setPositionX(500) 
            } else if (event.key === 'ArrowLeft') {
                onDislike && onDislike()
                setPositionX(-500)
            }
            setTimeout(() => {
                setPositionX(0)
            }, 600)
        }
    }

    return (
        <div
            ref={cardRef}
            {...swipeHandlers}
            className="card"
            style={{
                transform: `translateX(${positionX}px)`,
                cursor: isDragging && !isLastCard ? 'grabbing' : isLastCard ? 'not-allowed' : 'grab',
                pointerEvents: isLastCard ? 'none' : 'auto',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="card-content">{content}</div>
        </div>
    )
}

export default Card