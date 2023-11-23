import React from "react"
import './Checkboxes.scss'

export default function Checkboxes({selectedPlaylist, spotifyToken, checkboxFunction}){



    return(
        <div  style={selectedPlaylist ? {display: 'none'} :{}} className="wholeCheckboxes">
        <div className='checkboxes' style={!spotifyToken ? {display: 'none'} : {}}>
          <div>
            <input type="checkbox" name="check" attributes="Me"  onClick={event => checkboxFunction(event)}></input><span>Me</span>
          </div>
          <div>
            <input type="checkbox" name="check" attributes="Artist" onClick={event => checkboxFunction(event)}></input><span>Artist</span>
          </div>
          <div>
            <input type="checkbox" name="check" attributes="User"  onClick={event => checkboxFunction(event)}></input><span>User</span>
          </div>
        </div>
      </div>
    )
}