import React from 'react'

const MessageInput = ({ newMessage, setNewMessage, sendMessage }) => {

    return (
        <div className="message-input">
            <input className="textbox" type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
            <button className="send_button" onClick={sendMessage}>Send</button>
        </div>
    )
}

export default MessageInput