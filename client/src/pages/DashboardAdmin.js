import React, { useState, useEffect } from 'react'
import Nav from '../components/NavAdmin'
import { useNavigate } from 'react-router-dom'

import "../css/Admin.css"

// Using the same pager logic as in matchedusers (explained there better)

const DashboardAdmin = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  const navigate = useNavigate()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    const isAdmin = localStorage.getItem('isAdmin')

    // making sure that only admins see this page
    if (!authToken) {
        navigate('/')
    } else if (isAdmin !== "true") {
        navigate('/')
    }
}, [navigate])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/admin/dashboard')
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }
      const userData = await response.json()
      setUsers(userData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const startNumber = (currentPage - 1) * perPage
  const endNumber = startNumber + perPage
  const currentUsers = users.slice(startNumber, endNumber)

  const totalPages = Math.ceil(users.length / perPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const updateUserBio = async (userId, newBio) => {
    try {
      const response = await fetch(`/admin/users/${userId}/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bio: newBio })
      })
      if (!response.ok) {
        throw new Error(`Failed to update user bio: ${response.status} ${response.statusText}`)
      }
      // Fetch updated user data after bio update
      fetchUsers()
    } catch (error) {
      console.error('Error updating user bio:', error)
      setError(error.message)
    }
  }

  const handleBioUpdate = (userId) => {
    const newBio = prompt('Enter new bio:')
    if (newBio !== null) {
      updateUserBio(userId, newBio)
    }
  }

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`)
      }
      // Remove the deleted user from the state
      setUsers(users.filter(user => user._id !== userId))

    } catch (error) {
      console.error('Error deleting user:', error)
      setError(error.message)
    }
  }

  return (
    <>
      <Nav />
      <h1>Dashboard</h1>
      <div>
        <h2>User List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div className="user-list">
              {currentUsers.map((user) => (
                <li key={user._id}>
                  <div>
                    <span className='name'>{user.firstName} {user.surName}</span>
                    <button className='button_bio' onClick={() => handleBioUpdate(user._id)}>Modify Bio</button>
                    <button className='button_delete' onClick={() => deleteUser(user._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </div>
            {/* Pager */}
            <div className="pager">
              <button className="button_pager" onClick={goToFirstPage} disabled={currentPage === 1}>{"<"}{"<"}</button>
              <button className="button_pager" onClick={goToPreviousPage} disabled={currentPage === 1}>{"<"}</button>
              {[...Array(totalPages).keys()].map((page) => (
                <button key={page + 1} onClick={() => handlePageChange(page + 1)} className={currentPage === page + 1 ? 'active' : ''}>
                  {page + 1}
                </button>
              ))}
              <button className="button_pager" onClick={goToNextPage} disabled={currentPage === totalPages}>{">"}</button>
              <button className="button_pager" onClick={goToLastPage} disabled={currentPage === totalPages}>{">"}{">"}</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default DashboardAdmin