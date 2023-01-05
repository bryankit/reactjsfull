import React from 'react'

const SearchItem = ({search, setSearch}) => {
  return (
    <div>
        <form className='searchFrom' onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search">Search</label>
            <input 
                id='search'
                type="text" 
                role='searchBox'
                placeholder='Search Items'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </form>
    </div>
  )
}

export default SearchItem