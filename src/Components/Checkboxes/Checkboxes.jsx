import React from "react"

import './Checkboxes.scss'

export default function Checkboxes({selectedPlaylist, spotifyToken, checkboxFunction,checkboxType, setQuery, toggleArtistFocus, typeInput}){

  
    return(
        <div  style={selectedPlaylist ? {display: 'none'} :{}} className="wholeCheckboxes">
        <div className='checkboxes' style={!spotifyToken ? {display: 'none'} : {}}>
          <ul>
            <li class="dropdown">
              <h1 class="dropdown">Hover to select type</h1>
              <div class="dropdown-content">
                <a href="#" onClick={event => checkboxFunction(event)}>Me</a>
                <a href="#" onClick={event => checkboxFunction(event)}>Artist</a>
                {/* <a href="#" onClick={event => checkboxFunction(event)}>User</a> */}
              </div>
            </li>
          </ul>
          {checkboxType == 'Artist' ?   
          <input id="typeInput" ref={typeInput} onChange={event => setQuery(event.target.value)} onFocus={toggleArtistFocus} onBlur={toggleArtistFocus}/> :
          null}
        </div>
      </div>
    )
}