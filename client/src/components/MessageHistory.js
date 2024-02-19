import React from 'react'

const MessageHistory = ({ messages, currentUserId, selectedUserId }) => {
    const initialMessagesToShow = 20
    return (
        <div className="message-history">
            <div className="message-container">
                {messages.slice(-initialMessagesToShow).map((message, index) => (
                    <div key={index} className={`message ${message.sender === currentUserId ? 'sent' : message.sender === selectedUserId ? 'selected' : 'received'}`}>
                        {message.content}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MessageHistory
