import React from 'react'
import "../css/Card.css"

// Displaying the content of the user cards
const Card = ({ content, onLike, onDislike }) => {
    return (
        <div className="card">
            <div className="card-content">
                {content}
            </div>
            <div className="card-actions">

                {/* Showing the buttons when there's users to display */}
                {onLike && onDislike && (
                    <>
                        <button className="user_button" onClick={onDislike}>Dislike</button>
                        <button className="user_button" onClick={onLike}>Like</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Card