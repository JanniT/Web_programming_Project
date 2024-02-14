import React from 'react';
import "../css/Card.css"

const Card = ({ content, onLike, onDislike }) => {
    return (
        <div className="card">
            <div className="card-content">
                {content}
            </div>
            <div className="card-actions">
                <button onClick={onDislike}>Dislike</button>
                <button onClick={onLike}>Like</button>
            </div>
        </div>
    );
};

export default Card;
