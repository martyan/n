import React, { useRef, useState } from 'react'

const SearchInput = ({ searchStr, setSearchStr }) => {

    const searchRef = useRef(null)
    const [ searchFocused, setSearchFocused ] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        searchRef.current.blur()
    }

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                ref={searchRef}
                type="text"
                value={searchStr}
                onChange={e => setSearchStr(e.target.value)}
                onFocus={e => setSearchFocused(true)}
                onBlur={e => setSearchFocused(false)}
                placeholder="Search"
            />

            {searchStr.length > 0 && (
                <button className="clear" type="button" onClick={() => setSearchStr('')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                        <path d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"></path>
                    </svg>
                </button>
            )}
        </form>
    )

}

export default SearchInput
