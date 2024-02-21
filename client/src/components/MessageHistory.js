// I used these in help: 
// https://react.dev/reference/react/useRef
// https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up

import React, { useRef, useEffect } from 'react'

const MessageHistory = ({ messages, currentUserId, selectedUserId }) => {
    const initialMessagesToShow = 40
    const messageContainerRef = useRef(null)

    useEffect(() => {
        // Scroll to the bottom of the message container when component updates
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
        }
    }, [messages])

    // Making the timestamp look like 00:00 PM/AM
    const formatTimestamp = (timestamp) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true }
        return new Date(timestamp).toLocaleString('en-US', options)
    }

    return (
        <div className="message-history">
            <div ref={messageContainerRef} className="message-container">
                {messages.slice(-initialMessagesToShow).map((message, index) => (
                    // Making the classname based on if it sent or received message
                    <div key={index} className={`message ${message.sender === currentUserId ? 'sent' : message.sender === selectedUserId ? 'selected' : 'received'}`}>
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                    </div>   
                ))}
            </div>
        </div>
    )
}

export default MessageHistory