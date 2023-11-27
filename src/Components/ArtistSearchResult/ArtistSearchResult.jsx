import React,{useEffect, useRef} from "react";
import './ArtistSearchResult.scss'


export default function ArtistSearchResult({artist, id, artistFunction}){

    return(
        <div className="ArtistSearchResult"  id={id} onClick={()=>{artistFunction(artist.id)}}>
            <img src={artist.imageUrl} />
            <div className="text">
                <div className="title">{artist.name}</div>
            </div>
        </div>
    )
}