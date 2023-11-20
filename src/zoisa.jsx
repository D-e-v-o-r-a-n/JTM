import logo from './logo.svg';
import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { loginUrl, getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Components/Player/Player';
import TrackSearchResult from './Components/TrackSearchResult/TrackSearchResult';

const spotify = new SpotifyWebApi()

function Zoisa(){
    const [playlsits, setPlaylists] = useState([])
    const [artist, setArtist] = useState()
    const [name, setName] = useState()
    const [coolString, setCoolString] = useState()
    const [tracksTable,setTracksTable] = useState([])
      function showPlaylist(){
        spotify.getPlaylistTracks("1f841NwRDJhp0vvYay6XYF")
        .then(function(data){
          setPlaylists(data.items)
        },function(error){
          console.log(error)
        })

        for (let index = 0; index < playlsits.length; index++) {
            let x = playlsits[index].track.name
            let y = playlsits[index].track.artists[0].name


            let string = `${x}+by+${y}`;
            console.log(`${x} by ${y}`);
            setTracksTable(tracksTable => [...tracksTable,string] )
            console.log(tracksTable)
        }
      }
      function youtubeUrls(){
        let xT = []
        tracksTable.forEach(element => {
            let url = `https://www.youtube.com/results?search_query=${element}`;
            xT.push(url)
        });
        console.log(xT)
      }
    return(
        <div style={{color: 'black', width: '30rem',height: '20rem' ,backgroundColor: "white"}} >
            <button onClick={showPlaylist}>button add to list</button>
            <button onClick={youtubeUrls}>button b</button>

        </div>
    )
}


export default Zoisa