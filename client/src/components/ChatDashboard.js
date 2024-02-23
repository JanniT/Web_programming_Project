import React from 'react'
import "../css/ChatDashboard.css"

const ChatDashboard = ({ onClose, messages }) => {
    
    // Displaying the closing button of the message field 
    return (
        <div className="chat-dashboard">
            <div className="header">
                <button className="close_button" onClick={onClose}>Close Chat</button>
            </div>

            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className={message.sender === 'user' ? 'user-message' : 'other-message'}>
                        {message.content}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatDashboard