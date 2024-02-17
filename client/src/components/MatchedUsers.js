import React from 'react'

const MatchedUsers = ({ matches, handleChat }) => {
  return (
    <div className="col">
        
        <div className="matched-users-container">
            <h2>Matched Users</h2>
            {matches.map((match) => (
            <button key={match.userId} onClick={() => handleChat(match.userId, match.userName)}>
                {match.userName}
            </button>
            ))}
        </div>
    </div>
  )
}

export default MatchedUsers