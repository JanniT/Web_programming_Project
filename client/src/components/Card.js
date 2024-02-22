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
            setPositionX(0)
        } else {
            setPositionX(0)
        }
    }

    const swipeHandlers = useSwipeable({
        onSwiping: ({ deltaX }) => setPositionX(deltaX),
        onSwiped: ({ deltaX }) => handleSwipe(deltaX),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    })

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
            } else if (event.mozMovementX !== undefined) {
                deltaX = event.mozMovementX
            } else if (event.targetTouches && event.targetTouches[0]) {
                deltaX = event.screenX - event.targetTouches[0].screenX
            } else {
                deltaX = 0
            }
            setPositionX(prevPositionX => prevPositionX + deltaX)
        }
    };

    const handleMouseUp = () => {
        if (!isLastCard) {
            setIsDragging(false)
            handleSwipe(positionX)
        }
    }

    const handleKeyDown = (event) => {
        if (!isLastCard) {
            if (event.key === 'ArrowRight') {
                onLike && onLike();
                setPositionX(500); // Move card to the right
            } else if (event.key === 'ArrowLeft') {
                onDislike && onDislike();
                setPositionX(-500); // Move card to the left
            }
            setTimeout(() => {
                setPositionX(0); // Return card to the middle after 0.6s
            }, 600);
        }
    };

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
            onKeyDown={handleKeyDown} // Handle arrow key press
            tabIndex={0}
        >
            <div className="card-content">{content}</div>
        </div>
    )
}

export default Card