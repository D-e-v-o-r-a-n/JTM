import React, { useRef } from "react"
import './Checkboxes.scss'

export default function Checkboxes({selectedPlaylist, spotifyToken, checkboxFunction}){



    return(
        <div  style={selectedPlaylist ? {display: 'none'} :{}} className="wholeCheckboxes">
        <div className='checkboxes' style={!spotifyToken ? {display: 'none'} : {}}>
          {/* <div>
            <input type="checkbox" name="check" attributes="Me"  onClick={event => checkboxFunction(event)}></input><span>Me</span>
          </div>
          <div>
            <input type="checkbox" name="check" attributes="Artist" onClick={event => checkboxFunction(event)}></input><span>Artist</span>
          </div>
          <div>
            <input type="checkbox" name="check" attributes="User"  onClick={event => checkboxFunction(event)}></input><span>User</span>
          </div> */}

          <ul>
            <li class="dropdown">
              <h1 class="dropdown">Hover to select type</h1>
              <div class="dropdown-content">
                <a href="#" onClick={event => checkboxFunction(event)}>Me</a>
                <a href="#" onClick={event => checkboxFunction(event)}>Artist</a>
                <a href="#" onClick={event => checkboxFunction(event)}>User</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
}