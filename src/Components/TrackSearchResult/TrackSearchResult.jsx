import React, { useEffect, useRef } from "react";
import './TrackSearchResult.scss'

export default function TrackSearchResult({track, trackFunction, id,trackIndex, setTrackIndex, inputFocused,}){
    const element = useRef(null)

    useEffect(()=>{
        console.log(element)
        if(inputFocused){
            if(element.current.id != trackIndex){
                element.current.className = 'trackSearchResult'
             }else{
                element.current.className = 'trackSearchResultArrows'
             }
        }
    },[trackIndex])
    function resetIndex(){
        setTrackIndex(0)
    }
    return(
        <a href="#">
        <div ref={element} className="trackSearchResult" onClick={()=>{trackFunction(track.title)}} id={id} onMouseOver={resetIndex}>
            <img src={track.albumUrl} />
            <div className="text">
                <div className="title">{track.title}</div>
                <div>{track.artist}</div>
            </div>
        </div>
        </a>
    )
}