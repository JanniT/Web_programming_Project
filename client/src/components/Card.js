import React from 'react';
import "../css/Card.css"

const Card = ({ content, onLike, onDislike }) => {
    return (
        <div className="card">
            <div className="card-content">
                {content}
            </div>
            <div className="card-actions">
                <button onClick={onLike}>Like</button>
                <button onClick={onDislike}>Dislike</button>
            </div>
        </div>
    );
};

export default Card;
