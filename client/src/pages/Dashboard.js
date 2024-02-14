import Nav from '../components/NavDashboard'
import Card from '../components/Card'

import "../index.css"
import "../css/Navbar.css"

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const [authenticated, setAuthenticated] = useState(false)
    const [userData, setUserData] = useState({})
    const [likedUsers, setLikedUsers] = useState([])
    const [matches, setMatches] = useState([])
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

    // Displaying the data to the card
    const fetchContent = () => {
        // Checking if the userData is an array and has at least one element
        if (Array.isArray(userData) && userData.length > 0) {

            // Extracting the user data from the first element of the array
            const user = userData[0].data || userData[0]

            // Checking if theres bio written
            const bioDescription = user.bio ? user.bio : ""

            return `${user.firstName} ${user.surName} - ${user.email} ${bioDescription}`
        } else {
            return 'NO MORE PEOPLE'
        }
    }

    const handleLike = async () => {
        const user = userData[0].data
        setLikedUsers([...likedUsers, user._id])
        const response = await fetch('/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ userId: user._id }),
        })
        const data = await response.json()
        if (data.matched) {
            setMatches([...matches, user._id])
        }
        // Update userData state to remove the current user
        setUserData(prevUserData => prevUserData.slice(1)) // Remove the first user
    }
    
    const handleDislike = () => {
        console.log('Disliked')
        setUserData(prevUserData => prevUserData.slice(1))
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
                            onLike={handleLike}
                            onDislike={handleDislike}
                        />
                        {/* Add more cards as needed */}
                    </div>
                </>
            )}
        </>
    )
}

export default Dashboard