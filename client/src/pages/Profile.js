import Nav from '../components/NavDashboard'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import "../css/Profile.css"
import "../index.css"

const Profile = () => {
    const [authenticated, setAuthenticated] = useState(false)
    const [userData, setUserData] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [newBio, setNewBio] = useState('')
    const [userImage, setUserImage] = useState(null)
    const [newUserImage, setNewUserImage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [bioCharactersLeft, setBioCharactersLeft] = useState(1000)
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
                    // Redirect to the login page if no valid token is found
                    navigate('/')
                }
            } catch (error) {
                console.error('Error checking authentication:', error)
            }
        }
        checkAuth()
    }, [navigate])

    useEffect(() => {
        // Update the number of characters left when the bio changes
        const charactersLeft = 1000 - newBio.length
        setBioCharactersLeft(charactersLeft)
    }, [newBio])

    // Fetching the user data to the user profile
    const fetchUserData = async () => {
        try {
            const response = await fetch('/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUserData(data)
                await fetchUserImage(data._id)
            } else if (response.status === 401) {
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
    const fetchUserImage = async () => {
        try {
            const response = await fetch('/user/image/fetching', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
            if (response.ok) {
                const imageData = await response.blob()
                setUserImage(URL.createObjectURL(imageData))
            } else if (response.status === 404) {
                console.log('User does not have an image.')
            } else {
                console.error('Error fetching user image')
            }
        } catch (error) {
            console.error('Error fetching user image:', error)
        }
    }
    
    // Handling the bio saving
    const handleSaveClick = async () => {
        try {
            // Update the user's bio on the server
            const response = await fetch('/user/bio', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ bio: newBio }),
            })
    
            if (response.ok) {
                // Update the local state with the new bio
                const updatedUserData = await response.json()
                setUserData(updatedUserData)
                handleMessageDisplay(updatedUserData.message)

            } else if (response.status === 401) {
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error updating bio:', error)
            }
        } catch (error) {
            console.error('Error updating bio:', error)
        } finally {
            setIsEditing(false)
        }
    }

    const handleEditClick = () => {
        setIsEditing(true)
    }

    // Reset the newBio state and exit editing mode
    const handleCancelClick = () => {
        setNewBio(userData.bio || '')
        setIsEditing(false)
    }

    //Handling file change for the image input
    const handleFileChange = (event) => {
        const file = event.target.files[0]
        setNewUserImage(file)
    }

    const handleMessageDisplay = (message) => {
        setSuccessMessage(message)
        setTimeout(() => {
            setSuccessMessage(null)
        }, 2000)
    }

    // Handling the profile image upload
    const handleNewImage = async () => {
        try {
            const formData = new FormData()
            formData.append('picture', newUserImage)

            const response = await fetch('/user/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: formData,
            })

            if (response.ok) {
                // Refresh user data and image after successful upload
                await fetchUserData()

                const responseData = await response.json()

                handleMessageDisplay(responseData.message)
            } else {
                console.error('Error uploading profile picture')
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error)
        }
    }

    return (
        <>
        {authenticated && (
                <>
                    <Nav />
                    {successMessage && (<div className="success-message">{successMessage}</div>)}
                    <div className="profile-container">
                        <div className="profile-header">
                            <h1>{userData.username}'s Profile</h1>
                            {userImage && <img src={userImage} className="profile-image" alt="User" />}
                            <p>Firstname: {userData.firstName}</p>
                            <p>Surname: {userData.surName}</p>
                            <p>Email: {userData.email}</p>
                            <p>Age: {userData.age}</p>
                        </div>
                        <div className="profile-body">
                            <h2>About Me</h2>

                            {isEditing ? (
                                <>
                                    <textarea className='bio_text'
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        rows="4"
                                        cols="50"
                                        maxLength="1000"
                                    />
                                    <p>Characters Left: {bioCharactersLeft}</p>
                                    <button className='edit_button' onClick={handleSaveClick}>Save</button>
                                    <button className='edit_button' onClick={handleCancelClick}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p>{userData.bio}</p>
                                    <button className='edit_button' onClick={handleEditClick}>Edit Bio</button>
                                </>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button className='edit_button' onClick={handleNewImage}>Update profile picture</button>
                    </div>
                </>
            )}
        </>
    )
}

export default Profile