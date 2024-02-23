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
    const [selectedUserImage, setSelectedUserImage] = useState(null)
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

        // Fetching the image of the selected user
        fetchUserImage(userId)
        fetchMessages(userId)
    }    

    // Fetching the user image of the selected user
    const fetchUserImage = async (userId) => {
        try {
            const response = await fetch(`/user/image/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })

            if (response.ok) {
                // Set the image URL in the state
                const imageURL = URL.createObjectURL(await response.blob())
                setSelectedUserImage(imageURL)
            } else if (response.status === 404) {
                // User image not found
                setSelectedUserImage(null)
            } else if (response.status === 401) {
                // Token is invalid, redirect to login
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error fetching user image:', error)
            }
        } catch (error) {
            console.error('Error fetching user image:', error)
        }
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
                        <div className="container_row">
                            <MatchedUsers matches={matches} handleChat={handleChat} />
                            <div className="col">
                                <h2>Chat</h2>
                                {selectedUserImage && (
                                    <img src={selectedUserImage} alt="Selected User" className="selected-user-image" />)}
                                {selectedUser && (
                                    <p>Chatting with: {selectedUserName}</p>
                                )}
                                
                                {selectedUser && (
                                    <MessageHistory messages={messages} currentUserId={currentUserId} />)}

                                <div className="messageSending">
                                    {selectedUser && (
                                        <><MessageInput newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} /></>)}
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