import React from 'react';
import "../css/Card.css"

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
                        <button onClick={onDislike}>Dislike</button>
                        <button onClick={onLike}>Like</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Card;
