import React from "react";
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({accessToken, trackUri, playTrack}){
    if(!accessToken) return null 
    return(
        <div id="player">
            <SpotifyPlayer 
            styles={{
                bgColor: '#191414',
                color: "#fff",
                sliderHandleColor: '#fff'
            }}
            hideCoverArt={true}
            hideAttribution={true}
            initialVolume={1}
            play={playTrack}
            token={accessToken}
            uris={trackUri ? [trackUri]: []}
            />
        </div>
    )
}