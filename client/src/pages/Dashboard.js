import Nav from '../components/NavDashboard'
import Card from '../components/Card'

import "../index.css"
import "../css/Navbar.css"

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const [authenticated, setAuthenticated] = useState(false)
    const [userData, setUserData] = useState({})
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
                console.log(data)

            } else if (response.status === 401) {
                // Token is invalid, redirect to login
                navigate('/')
            } else {
                const error = await response.json();
                console.error('Error fetching user details:', error)
            }
        } catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    // Displaying the data to the card
    const fetchContent = () => {
        // Check if userData is an array with at least one element
        if (Array.isArray(userData) && userData.length > 0) {

            // Extract the user data from the first element of the array
            const user = userData[0].data || userData[0]

            return `${user.firstName} ${user.surName} - ${user.email} ${user.bio}`
        } else {
            // Handle the case where userData is not in the expected format
            console.error('Invalid userData format:', userData)
            return 'Error: Invalid user data format'
        }
    }

    const handleLike = () => {
        console.log('Liked')
    }
    
    const handleDislike = () => {
        console.log('Disliked')
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