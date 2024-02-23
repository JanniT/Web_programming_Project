import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

import "../css/Profile.css"

import NavProfilePage from './NavProfilePage'

const ProfilePage = () => {
    const location = useLocation()
    const { user, userImage  } = location.state || {}

    // Checking if theres bio written
    const bioDescription = user.bio ? user.bio : ""

    return (
        <>
            <NavProfilePage />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>{user.firstName}</h1>
                </div>
                <div className="profile-body">
                    {userImage && <img className="profile-image" src={userImage} alt="User" />}
                    <p>Age: {user.age}</p>
                    <p>Username: {user.username}</p>
                    <h2>Bio:</h2>
                    <p className="bio_text">{bioDescription}</p>
                </div>
            </div>
        </>
    )
}

export default ProfilePage
