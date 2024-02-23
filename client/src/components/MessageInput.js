// I used this in help https://react.dev/reference/react/useRef

import React, { useRef, useState, useEffect } from 'react'

const MessageInput = ({ newMessage, setNewMessage, sendMessage, maxRows = 5, maxChars = 500 }) => {
    const textareaRef = useRef(null)
    const [charsLeft, setCharsLeft] = useState(maxChars)

    // adjusting the textarea height based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    // handling the text area change
    const handleChange = (event) => {
        const message = event.target.value
        if (message.length <= maxChars) {
            setNewMessage(message)
            adjustTextareaHeight()
            setCharsLeft(maxChars - message.length)
        }
    }

    // sending message
    const handleSendMessage = () => {
        sendMessage()
        textareaRef.current.style.height = 'auto'
    }

    // Effect to update characters left when new message is received
    useEffect(() => {
        setCharsLeft(maxChars - newMessage.length)
    }, [newMessage, maxChars])

    return (
        <div className="message-input">
            <textarea
                className="textbox"
                ref={textareaRef}
                value={newMessage}
                onChange={handleChange}
                onKeyPress={(event) => event.key === 'Enter' && handleSendMessage()}
                rows={1}
                maxLength={maxChars}
                style={{ maxHeight: `${maxRows * 1.5}em`, minHeight: `${maxRows * 0.5}em` }}
            />
            <div>
                <span>{charsLeft} characters left</span>
                <button className="send_button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    )
}

export default MessageInput