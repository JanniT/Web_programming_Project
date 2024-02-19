import React from 'react'

const MatchedUsers = ({ matches, handleChat }) => {
  return (
    <div className="col">
        <h2>Matched Users</h2>
        <div className="matched-users-container">
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