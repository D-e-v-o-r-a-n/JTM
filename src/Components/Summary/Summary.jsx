import React from "react";
import './Summary.scss'

export default function Summary({guessingFinished, guessed, skipped, setGuessed, setSkipped, stateTracks,setSelectedPlaylist,setAppStarted,
     setPlaylists,setSearchResult,setTracksPlayed,setStateTracks,setAllTracks,setCheckboxType,setAnswered, score, setTrackNumber, setPlayTrack}){
    
    function play(){
        setPlayTrack(false)
        setPlaylists([])
        setSearchResult([])
        setTracksPlayed([])
        setStateTracks([])
        setAllTracks(['index1','index2'])
        setSkipped([])
        setGuessed([])
        setCheckboxType('check')
        setAnswered(false)
        setSelectedPlaylist(false)
        setAppStarted(false)
        setTrackNumber(1)
        guessingFinished.current = false
    }

    score.current = `${guessed.length}/${stateTracks.length}`
    return(
        <div style={guessingFinished.current ? {} : {display: 'none'}} id="WholeSummary">
            <h1 id="Score">Score: {score.current} </h1>
            <div id="Summary">
                <div className="sections">
                    <h1>Guessed:</h1>
                    <div id="Guessed">
                        {guessed.map(track => (
                            <h3>{track}</h3>
                        ))}
                    </div>
                </div>
                <div className="sections">
                    <h1>Skipped:</h1>
                    <div id="Skipped">
                        {
                            skipped.map(track => (
                                <h3>{track}</h3>
                            ))}
                    </div>
                </div>
                </div>
                
            <button onClick={play}>Play Again!</button>
        </div>
    )
}