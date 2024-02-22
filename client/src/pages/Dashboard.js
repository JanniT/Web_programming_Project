import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Nav from '../components/NavDashboard'
import Card from '../components/Card'

import "../index.css"

const Dashboard = () => {

    const [authenticated, setAuthenticated] = useState(false)
    const [userData, setUserData] = useState({})
    const [matches, setMatches] = useState([])
    const [userImage, setUserImage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if the user is authenticated to display the page or not
                const authToken = localStorage.getItem('authToken')
                if (authToken) {
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
        checkAuth()
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
    const fetchContent = () => {
        // Checking if the userData is an array and has at least one element
        if (Array.isArray(userData) && userData.length > 0) {

            // Extracting the user data from the first element of the array
            const user = userData[0].data || userData[0]

            // Checking if theres bio written
            const bioDescription = user.bio ? user.bio : ""

            return (
                <div>
                    <div>
                        <span className="name">{user.firstName} {user.surName}</span>
                    </div>
                    {userImage && <img src={userImage} alt="User" />}
                    <div>
                        <span className="age">Age: {user.age}</span>
                    </div>
                    <div className='bio_component'>
                        <span className="bio">{bioDescription || ""}</span>
                    </div>
                </div>
            )
        } else {
            return 'NO MORE PEOPLE'
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
                // If user wants to chat, navigate to chat page with the matched user's ID
                navigate(`/chat`)
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
                        <Card
                            content={fetchContent()}
                            onLike={Array.isArray(userData) && userData.length > 0 ? handleLike : null}
                            onDislike={Array.isArray(userData) && userData.length > 0 ? handleDislike : null}
                        />
                        {/* Add more cards as needed */}
                    </div>
                </>
            )}
        </>
    )
}

export default Dashboard