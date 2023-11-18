import React from "react";
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({accessToken, trackUri}){
    if(!accessToken) return null 
    return(
        <div id="player">
            <SpotifyPlayer 
             styles={{
                activeColor: '#0000ff',
                bgColor: '#282c34',
                color: '#0000ff',
                loaderColor: '#0000ff',
                sliderColor: '#0000ff',
                trackArtistColor: '#0000ff',
                trackNameColor: '#0000ff',
              }}
            token={accessToken}
            uris={trackUri ? [trackUri]: []}
            />
        </div>
    )
}