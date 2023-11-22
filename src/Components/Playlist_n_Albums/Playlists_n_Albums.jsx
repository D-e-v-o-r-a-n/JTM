import React from "react"
// import './.scss'

export default function Playlists_n_Albums({spotifyToken, selectedPlaylist, select, playlists}){



    return(
        <div style={ !spotifyToken ? {display: 'none'} : {} }>
        <div id='playlistWhole' style={selectedPlaylist ? {display: 'none'} : {}}>
          <span>Your playlists</span>
          <div id='playlistContainer'>
            {playlists.map((playlist => {
              return (
                <div id='playlist'>
                  <span>{playlist.name}</span>
                  <img src={playlist.images[0].url} />
                  <button property={playlist.id} onClick={event => select(event)} ><a href="#">Select</a></button>
                </div>
              )
            }))}
          </div>
        </div>
      </div>
    )
}