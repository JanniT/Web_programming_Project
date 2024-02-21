import React, { useState } from 'react'

const MatchedUsers = ({ matches, handleChat }) => {
  // Number of matches to display per page
  const perPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  // calculating the total number of pages
  const totalPages = Math.ceil(matches.length / perPage)

  const startNumber = (currentPage - 1) * perPage
  const endNumber = startNumber + perPage;
  const currentMatches = matches.slice(startNumber, endNumber)

  // Functions to handle page navigation
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

  // Function to generate the page numbers to display in the pager
  const getPageNumbers = () => {
    // setting the maximum number of the displayed pages on the pager
    const maxPageNumbers = 2 
    const pageNumbers = []
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2))
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1)

    // Adjust startPage and endPage if total pages are less than maxPageNumbers
    if (totalPages <= maxPageNumbers) {
      startPage = 1
      endPage = totalPages
    } else {
      if (endPage - startPage < maxPageNumbers - 1) {
        startPage = endPage - maxPageNumbers + 1
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  return (
    <div className="col">
      <h2>Matched Users</h2>
      <div className="matched-users-container">
        {/* Displaying the matches as buttons which have functionality to open the chat */}
        {currentMatches.map((match) => (
          <button key={match.userId} onClick={() => handleChat(match.userId, match.userName)}>
            {match.userName}
          </button>
        ))}
      </div>
      {/* Pager */}
      <div className="pager">
        <button className="button_pager" onClick={goToFirstPage} disabled={currentPage === 1}>{"<"}{"<"}</button>
        <button className="button_pager" onClick={goToPreviousPage} disabled={currentPage === 1}>{"<"}</button>
        {getPageNumbers().map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>
            {page}
          </button>
        ))}
        <button className="button_pager" onClick={goToNextPage} disabled={currentPage === totalPages}>{">"}</button>
        <button className="button_pager" onClick={goToLastPage} disabled={currentPage === totalPages}>{">"}{">"}</button>
      </div>
    </div>
  )
}

export default MatchedUsers