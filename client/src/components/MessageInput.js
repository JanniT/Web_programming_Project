// I used this in help https://react.dev/reference/react/useRef

import React, { useRef } from 'react'

const MessageInput = ({ newMessage, setNewMessage, sendMessage, maxRows = 5 }) => {
    const textareaRef = useRef(null)

    // adjusting the textarea height based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    // handling the text area change
    const handleChange = (event) => {
        setNewMessage(event.target.value)
        adjustTextareaHeight()
    }

    // sending message
    const handleSendMessage = () => {
        sendMessage()
        textareaRef.current.style.height = 'auto'
    }

    return (
        <div className="message-input">
            <textarea
                className="textbox"
                ref={textareaRef}
                value={newMessage}
                onChange={handleChange}
                onKeyPress={(event) => event.key === 'Enter' && handleSendMessage()}
                rows={1}
                maxLength={500}
                style={{ maxHeight: `${maxRows * 1.5}em`, minHeight: `${maxRows * 0.5}em` }}
            />
            <button className="send_button" onClick={handleSendMessage}>Send</button>
        </div>
    )
}

export default MessageInput