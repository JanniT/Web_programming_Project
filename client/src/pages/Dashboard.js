import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Nav from '../components/NavDashboard'
import Card from '../components/Card'
import MessageInput from '../components/MessageInput'
import ChatDashboard from '../components/ChatDashboard'

// import "../index.css"
import "../css/ChatDashboard.css"

const Dashboard = () => {

    const [authenticated, setAuthenticated] = useState(false)
    const [userData, setUserData] = useState({})
    const [matches, setMatches] = useState([])
    const [userImage, setUserImage] = useState(null)

    const [showChat, setShowChat] = useState(false)
    const [matchUser, setMatchUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if the user is authenticated to display the page or not
                const authToken = localStorage.getItem('authToken')
                const isAdmin = localStorage.getItem('isAdmin')
                if (authToken && isAdmin !== 'true') {
                    await fetchUserData()
                    setAuthenticated(true)
                } else {
                    setAuthenticated(false)
                    // Redirect to the login page if no valid token is found
                    navigate('/')
                }
            } catch (error) {
                console.error('Error checking authentication:', error)
            }
        }
        checkAuth() // eslint-disable-next-line
    }, [navigate])

    // Making sure that the image is fetched everytime the the user displayed is changed
    useEffect(() => {
        // Check if userData is not null and has at least one element
        if (userData && userData.length > 0) {
            const userId = userData[0].data._id
            fetchUserImage(userId)
        }
    }, [userData])

    // fetching the user data to display on the dashboard
    const fetchUserData = async () => {
        try {
            const response = await fetch('/dashboard', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
            
            if (response.ok) {
                const data = await response.json()
                setUserData(data)
            } else if (response.status === 401) {
                // Token is invalid, redirect to login
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error fetching user details:', error)
            }
        } catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    // Fetching the image if user has one 
    const fetchUserImage = async (userId) => {
        try {
            const response = await fetch(`/user/image/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
            if (response.ok) {
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.startsWith('image')) {
                    const imageData = await response.blob()
                    setUserImage(URL.createObjectURL(imageData))
                } else {
                    setUserImage(null)
                }
            } else if (response.status === 404) {
                // User image not found, set userImage to null
                setUserImage(null)
            } else {
                console.error('Error fetching user image')
            }
        } catch (error) {
            console.error('Error fetching user image:', error)
        }
    }

    // Displaying the data to the card
    const FetchContent = ({ userData, userImage, navigate }) => {
        // Checking if the userData is an array and has at least one element
        if (Array.isArray(userData) && userData.length > 0) {
            // Extracting the user data from the first element of the array
            const user = userData[0].data || userData[0]
            return (
                <div>
                    <div>
                        <span className="name">{user.firstName} {user.surName}</span>
                        <br />
                        {/* making the username as a link to the profile page */}
                        <a href={`/profile/${user.username}`} className="username" onClick={(event) => { event.preventDefault(); navigate(`/profile/${user.username}`, { state: { user, userImage } }) }}>{user.username}</a>
                    </div>
                    {/* Making sure that the image cannot be "painted" */}
                    {userImage && <img src={userImage} alt="User" style={{ pointerEvents: 'none' }} />}
                </div>
            )
        } else {
            return 'NO MORE PEOPLE'
        }
    }

    // Handling the sending of a message to the match 
    const sendMessage = async () => {
        try {
            if (!matchUser || !newMessage.trim()) {
                // Inform the user that the message cannot be empty
                console.error('Message or matchUser cannot be empty')
                return
            }

            const response = await fetch('/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    userId: matchUser._id, // Sending message to the matched user
                    content: newMessage.trim(), // Ensure 'content' is included
                }),
            })

            if (response.ok) {
                // Update the messages state after sending the message
                setMessages([...messages, { content: newMessage.trim(), sender: 'user' }])
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

    const handleLike = () => handleInteraction('like')
    const handleDislike = () => handleInteraction('dislike')

    const handleInteraction = async (action) => {
        const user = userData[0].data
        const response = await fetch('/interaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ userId: user._id, action }),
        })
        const data = await response.json()
        if (data.matched) {
            // If matched, add user ID to matches
            setMatches([...matches, user._id])
            // Prompt user to start chatting or continue swiping
            const startChatting = window.confirm('You have a match! Do you want to start chatting now?')
            if (startChatting) {
                setShowChat(true)
                setMatchUser(user)
                setMessages([])
                // Remove matched user from potential matches
                setUserData(prevUserData => prevUserData.slice(1))
            } else {
                // If user wants to continue swiping, remove current user from display
                setUserData(prevUserData => prevUserData.slice(1))
            }
        } else {
            // // Update userData state to remove the current user
            setUserData(prevUserData => prevUserData.slice(1))
        }
    }

    return (
        <>
            {authenticated && (
                <>
                    <Nav />
                    <div className="container_dashboard">
                        <h1>Dashboard</h1>
                        {showChat ? (
                            <ChatDashboard
                                matchUser={matchUser}
                                onClose={() => setShowChat(false)}
                                messages={messages}
                            />
                        ) : (
                            <Card
                                content={<FetchContent userData={userData} userImage={userImage} navigate={navigate} />}
                                onLike={Array.isArray(userData) && userData.length > 0 ? handleLike : null}
                                onDislike={Array.isArray(userData) && userData.length > 0 ? handleDislike : null}
                            />
                        )}
                        {showChat && (
                            <div className="message-input-container">
                                <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default Dashboard