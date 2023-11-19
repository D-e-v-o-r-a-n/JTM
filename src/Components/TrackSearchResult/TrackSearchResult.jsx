import React from "react";
import './TrackSearchResult.scss'

export default function TrackSearchResult({track, trackFunction}){

    return(
        <div className="trackSearchResult" onClick={()=>{trackFunction(track.title)}}>
            <img src={track.albumUrl} />
            <div className="text">
                <div className="title">{track.title}</div>
                <div>{track.artist}</div>
            </div>
        </div>
    )
}