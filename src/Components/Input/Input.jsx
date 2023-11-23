import React from "react"
import './Input.scss'

export default function Input({spotifyToken, selectedPlaylist, appStarted, submitAnswer, skipFunction, showTracks, setSearchInput, myBtn, myInput,toggleFocus}){



    return(
        <div style={(!spotifyToken ? { display: 'none' } : { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' })}>
            <div style={(!selectedPlaylist ? { display: 'none' } : {}) && (!appStarted ? { display: 'none' } : {})}>
                <input type="text" name="" id="guessInput"  ref={myInput} onFocus={toggleFocus} onBlur={toggleFocus} onChange={event => { setSearchInput(event.target.value) }} onKeyDown={event => {
                    if (event.key === 'Enter') {
                        submitAnswer(event)
                        
                    }
                }} />
                <button className="skipButton" onClick={skipFunction}>Skip</button>
            </div>
            <button ref={myBtn} onClick={event => showTracks(event)} style={(!selectedPlaylist ? { display: 'none' } : {})}>START</button>
        </div>
    )
}