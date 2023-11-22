import React from "react"
import './Input.scss'

export default function Input({spotifyToken, selectedPlaylist, appStarted, submitAnswer, showTracks, setSearchInput, myBtn, myInput}){



    return(
        <div style={(!spotifyToken ? { display: 'none' } : { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' })}>
            <input type="text" name="" id="guessInput" ref={myInput} style={(!selectedPlaylist ? { display: 'none' } : {}) && (!appStarted ? { display: 'none' } : {})} onChange={event => { setSearchInput(event.target.value) }} onKeyDown={event => {
                if (event.key === 'Enter') {
                    submitAnswer(event)
                }
            }} />
            <button ref={myBtn} onClick={event => showTracks(event)} style={(!selectedPlaylist ? { display: 'none' } : {})}>START</button>
        </div>
    )
}