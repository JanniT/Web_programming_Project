import React from 'react'

const MessageHistory = ({ messages, currentUserId, selectedUserId }) => {

    return (
        <div className="message-history">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender === currentUserId ? 'sent' : message.sender === selectedUserId ? 'selected' : 'received'}`}>
                    {message.content}
                </div>
            ))}
        </div>
    )
}

export default MessageHistory
