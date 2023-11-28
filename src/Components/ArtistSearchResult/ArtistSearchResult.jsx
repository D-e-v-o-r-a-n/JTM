import React from "react";
import './ArtistSearchResult.scss'


export default function ArtistSearchResult({artist, artistFunction}){

    return(
        <div className="ArtistSearchResult" onClick={()=>{artistFunction(artist.id)}}>
            <img src={artist.imageUrl} />
            <div className="text">
                <div className="title">{artist.name}</div>
            </div>
        </div>
    )
}