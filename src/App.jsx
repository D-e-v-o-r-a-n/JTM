import logo from './logo.svg';
import './App.css';
import secrets from './secrets';
import { useEffect, useState } from 'react';
import { loginUrl, getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Components/Player/Player';

const spotify = new SpotifyWebApi()


const CLIENT_ID = secrets.clientID
const CLIENT_SECRET = secrets.clientSecret
const scope = 'playlist-read-private playlist-read-collaborative'

function App() {
  const [spotifyToken, setSpotifyToken] = useState("")
  const [accessToken, setAccessToken] = useState()
  const [searchInput, setSearchInput] = useState()
  const [userID, setUserID] = useState()
  const [albums, setAlbums] = useState([])
  const [trackName, setTrackName] = useState()
  const [trackImage, setTrackImage] = useState()
  const [trackUri, setTrackUri] = useState()
  const [trackPreview, setTrackPreview] = useState()


  useEffect(() => {

    // var authParams = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=${scope}&redirect_uri=http://localhost:8888/callback}`
    // }

    // fetch('https://accounts.spotify.com/api/token', authParams)
    //   .then(response => response.json())
    //   .then(data => { setAccessToken(data.access_token); console.log(data) })
    //   .catch(error => console.log(`Error ocurred: ${error}`))

    // setUserID('31vbfs3bupbisid7zcbomx633bna')    

    console.log("this is what we derived from url ", getTokenFromUrl())

    const _spotifyToken = getTokenFromUrl().access_token;

    window.location.hash = ""

    console.log("This is our spotify token: ", _spotifyToken)

    if (_spotifyToken){
      setSpotifyToken(_spotifyToken)

      spotify.setAccessToken(_spotifyToken)
    }
  }, [])








  async function Search() {
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })
      .catch(error => console.log(`Error ocurred: ${error}`))


    var returnedAlbums = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, searchParams)
      .then(response => response.json())
      .then(data => { return data })

    // if(returnedAlbums.items == undefined){
    //    setAlbums([{name:"NOT FOUND", images: [{url: 'https://www.computerhope.com/jargon/e/error.png'}]}])
    //    console.log(albums)
    //  } else{
    //   setAlbums(returnedAlbums.items)
    //  }
  
     spotify.getUserPlaylists()
      .then(function(data) {
        console.log('User playlists', data);
        setAlbums(data.items)
      }, function(err) {
        console.error(err);
      });
  }

  async function showTracks(){
    var tracksParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      }
    }

    var tracks = await fetch('https://api.spotify.com/v1/playlists/1f841NwRDJhp0vvYay6XYF/tracks',tracksParams)
    .then(response => response.json())
    .then(data => { return data.items})

    const index = Math.floor(Math.random() * tracks.length)
    const track = tracks[index].track
    setTrackName(track.name)
    setTrackImage(track.album.images[0].url)
    setTrackUri(track.uri)
    setTrackPreview(track?.preview_url)
    console.log(track?.preview_url)

  
    console.log(trackName, trackImage, trackUri)
    // tracks.forEach(track  => {
    //   setTrackName(track.track.name)
    //   setTrackImage(track.track.album.images[0].url)
    //   setTrackUri(track.track.uri)
    //   console.log(trackName, trackImage, trackUri)
    // })
  }


  return (
    <>
      <div className="App">
        <header className="App-header">
          <input type="search" name="" id="" onChange={event => { setSearchInput(event.target.value) }} onKeyDown={event => {
            if (event.key === 'Enter') {
              Search()
            }
          }} />
          <button type="button" onClick={Search}>Search</button>
        </header>
      </div>
      <a href={loginUrl}>Sign in with spotify</a>
      <div id='container'>
        {albums.map((album)=>{
          return(
            <div id="card">
            <img src={album.images[0].url} />
            <span>{album.name}</span>
          </div>
          ) 
        })}
      </div>
      <div>
        <button onClick={showTracks}>Show Tracks</button>
        <span style={{color:' #ffffff'}}>{trackPreview}</span>
        <a href={trackPreview} target={'_blank'}>Preview</a>
      
        {/* <Player accessToken={spotifyToken} trackUri={trackUri}/> */}
      </div>

    </>
  );
}

export default App;
