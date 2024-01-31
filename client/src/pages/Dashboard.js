import "../index.css"
import "../css/Navbar.css"
import Nav from '../components/NavDashboard'
import Card from '../components/Card'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const [authenticated, setAuthenticated] = useState(false)
    const [userData, setUserData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        // Check if the user is authenticated to display the page or not
        const authToken = localStorage.getItem('authToken')
        if (authToken) {
            fetchUserData()
            setAuthenticated(true)
        } else {
            // Redirect to the login page if no valid token is found
            navigate('/')
        }
    }, [navigate])

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
              const error = await response.json();
              console.error('Error fetching user details:', error)
            }
          } catch (error) {
            console.error('Error fetching user details:', error)
          }
    }

    const fetchContent = () => {
        return `${userData.firstName} ${userData.surName} - ${userData.email}`
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