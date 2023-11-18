import React from "react";
import './TrackSearchResult.scss'

export default function TrackSearchResult({track}){

    return(
        <div className="trackSearchResult">
            <img src={track.albumUrl} />
            <div className="text">
                <div className="title">{track.title}</div>
                <div>{track.artist}</div>
            </div>
        </div>
    )
}