import React from "react"
import './Playlists_n_Albums.scss'

export default function Playlists_n_Albums({spotifyToken, selectedPlaylist, select, playlists,checkboxType}){

    return(
        <div style={ !spotifyToken ? {display: 'none'} : {} }>
          <div id='playlistWhole' style={selectedPlaylist ? {display: 'none'} : {}}>
            <h1 style={checkboxType == 'check' ? {display: 'none'} : {}}>Select one</h1>
            <div id='playlistContainer'>
              {playlists.map((playlist => {
                return (
                  <a href="#">
                        <div id='playlist' property={playlist.id} onClick={event => select(event)}>
                            <span>{playlist.name}</span>
                            <img src={playlist.images[0]?.url} />
                        </div>
                  </a>
                )
              }))}
            </div>
          </div>
      </div>
    )
}