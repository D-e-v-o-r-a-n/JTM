import React from "react"
import './Input.scss'

export default function Input({spotifyToken, selectedPlaylist, appStarted, submitAnswer, skipFunction, showTracks, setSearchInput, myBtn, myInput,toggleFocus,trackIndex, setTrackIndex}){

    return(
        <div style={(!spotifyToken ? { display: 'none' } : { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' })}>
            <div style={(!selectedPlaylist ? { display: 'none' } : {}) && (!appStarted ? { display: 'none' } : {})}>
                <input type="text" name="" id="guessInput"  ref={myInput} onFocus={toggleFocus} onBlur={toggleFocus} onChange={event => { setSearchInput(event.target.value) }} onKeyDown={event => {
                    if(trackIndex == 0){
                        if (event.key === 'Enter') {
                            submitAnswer(event)
                            setTrackIndex(0)
                        }else if(event.key === 'ArrowUp'){
                            trackIndex != 0 ? setTrackIndex(trackIndex - 1) : setTrackIndex(0)
                        }else if(event.key === 'ArrowDown'){
                           trackIndex != 4 ? setTrackIndex(trackIndex + 1) : setTrackIndex(4)
                        }    
                    }else if(trackIndex > 0){
                        if (event.key === 'Enter') {
                            let answer = document.getElementById(trackIndex).childNodes[1].childNodes[0].textContent
                            let fakeEvent = {
                                target: {
                                    value: answer
                                }
                            }
                            submitAnswer(fakeEvent)
                            setTrackIndex(0)
                        }else if(event.key === 'ArrowUp'){
                            trackIndex != 0 ? setTrackIndex(trackIndex - 1) : setTrackIndex(0)
                        }else if(event.key === 'ArrowDown'){
                           trackIndex != 4 ? setTrackIndex(trackIndex + 1) : setTrackIndex(4)
                        } 
                    }

                    
                }} />
                <button className="skipButton" onClick={skipFunction}>Skip</button>
            </div>
            <button ref={myBtn} onClick={event => showTracks(event)} style={(!selectedPlaylist ? { display: 'none' } : {})}>START</button>
        </div>
    )
}