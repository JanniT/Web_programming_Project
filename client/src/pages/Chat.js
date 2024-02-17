import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Nav from '../components/NavDashboard'
import MatchedUsers from '../components/MatchedUsers'
import MessageHistory from '../components/MessageHistory'
import MessageInput from '../components/MessageInput'

import "../index.css"
import "../css/Chat.css"

const Chat = () => {

    const [authenticated, setAuthenticated] = useState(false)
    const [matches, setMatches] = useState([])

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedUserName, setSelectedUserName] = useState('')
    const [currentUserId, setCurrentUserId] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if the user is authenticated to display the page or not
                const authToken = localStorage.getItem('authToken')
                if (authToken) {
                    await fetchMatches()
                    setAuthenticated(true)

                    // Saving the userId to a variable
                    const currentUserId = localStorage.getItem('userId')
                    setCurrentUserId(currentUserId)
                } else {
                    setAuthenticated(false)
                    // Redirect to the login page if no valid token is found
                    navigate('/')
                }
            } catch (error) {
                console.error('Error checking authentication:', error)
            }
        }
        checkAuth()
    }, [navigate])

    // Fetching the matches
    const fetchMatches = async () => {
        try {
            const response = await fetch('/matches', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setMatches(data.matches)
            } else if (response.status === 401) {
                // Token is invalid, redirect to login
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error fetching matched users:', error)
            }
        } catch (error) {
            console.error('Error fetching matched users:', error)
        }
    }

    // Handle chat opening
    const handleChat = (userId, userName) => {
        setSelectedUser(userId)
        setSelectedUserName(userName)
        console.log("Opened chat with: ", userId)
        fetchMessages(userId)
    }    

    // Fetching the chat messages
    const fetchMessages = async (userId) => {
        try {
            const response = await fetch(`/messages/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setMessages(data.messages)
                setSelectedUser(userId)

            } else if (response.status === 401) {
                // Token is invalid, redirect to login
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error fetching messages:', error)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    // Handling the chat sending 
    const sendMessage = async () => {
        try {
            if (!selectedUser || !newMessage.trim()) {
                // Inform the user that the message cannot be empty
                console.error('Message cannot be empty')
                return
            }
        
            const response = await fetch('/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    userId: selectedUser,
                    content: newMessage.trim(), // Ensure 'content' is included
                }),
            })
    
            if (response.ok) {
                // Update the messages state after sending the message
                fetchMessages(selectedUser)
                setNewMessage('')
            } else if (response.status === 401) {
                // Token is invalid, redirect to login
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error sending message:', error)
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <>
            {authenticated && (
                <>
                    <Nav />
                    <div className="container_chat">
                        <div className="row">
                            <MatchedUsers matches={matches} handleChat={handleChat} />
                            <div className="col">
                                <div className="message-container">
                                    <h2>Chat</h2>
                                    {selectedUser && (
                                        <>
                                            <p>Chatting with: {selectedUserName}</p>
                                            <MessageHistory messages={messages} currentUserId={currentUserId} />
                                            <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Chat