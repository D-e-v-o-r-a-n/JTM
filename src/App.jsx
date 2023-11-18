import logo from './logo.svg';
import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { loginUrl, getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Components/Player/Player';
import TrackSearchResult from './Components/TrackSearchResult/TrackSearchResult';

const spotify = new SpotifyWebApi()

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [trackName, setTrackName] = useState();
  const [trackImage, setTrackImage] = useState();
  const [trackUri, setTrackUri] = useState();
  const [trackPreview, setTrackPreview] = useState();
  const [selectedPlaylist,setSelectedPlaylist] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const myBtn = useRef(null)
  const myInput = useRef(null)


  useEffect(() => {
    const _spotifyToken = getTokenFromUrl().access_token;

    window.location.hash = ""

    if (_spotifyToken){
      setSpotifyToken(_spotifyToken)

      spotify.setAccessToken(_spotifyToken)
    }
  }, [])

  useEffect(()=>{
    if(!searchInput) return setSearchResult([])
    if(!spotifyToken) return
    
    spotify.searchTracks(searchInput).then(res =>{
      setSearchResult(res.tracks.items.map(track=>{
        const smallestAlbumImage = track.album.images.reduce((
          smallest, image) => {
            if(image.height < smallest.height) return image
            return smallest
          }, track.album.images[0])
          
          setTrackPreview(track?.preview_url)
        return{
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url
        }
      }))
    }).catch(err=>console.log(err))
  }, [searchInput, spotifyToken])


  async function showPlaylist() {
     spotify.getUserPlaylists()
      .then(function(data) {
        console.log('User playlists', data);
        setPlaylists(data.items)
        console.log(playlists)
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

    // request for tracks from selected playlists
    var tracks = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,tracksParams)
    .then(response => response.json())
    .then(data => { return data.items})

    // picking a random track from this list
    const index = Math.floor(Math.random() * tracks.length)
    const track = tracks[index].track

    // setting the hook values
    setTrackName(track.name)
    setTrackImage(track.album.images[0].url)
    setTrackUri(track.uri)
    setTrackPreview(track?.preview_url)

  
  }

  function submitAnswer(event){
    const answer = event.target.value

    if(answer.length > 0 && answer.trim().toLowerCase() == trackName.toLowerCase()){
      console.log("brawo")
      myBtn.current.click()
      myInput.current.value = null
      console.log(trackPreview)
    }else{
      console.log("Próbuj dalej")
    }
  }

  // selecting a playlist
  function select(event){
    setSelectedPlaylist(event.currentTarget.attributes[0]['value'])
  }

  return (
    <>
      <span id="#"></span>
      <div className="App">
        <header className="App-header">
          <div style={{ display: 'flex', flexDirection: 'column', color: 'white', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
            <span>{trackName} </span>
            <img src={trackImage} style={{ height: '100%', maxWidth: '30%' }} />
            <span> {trackUri}  </span>
          </div>
          <a href={loginUrl} id='signInId' style={spotifyToken ? {visibility: 'collapse'} : {}}>Sign in with Spotify</a>

          <div style={ (!spotifyToken ? {visibility: 'collapse'} : {display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem'}) }>
            <button onClick={showPlaylist} style={!selectedPlaylist ? {display: 'flex', justifyContent: 'center', alignItems: 'center'} : {visibility: 'collapse'}}>Show Playlists</button>
            <input type="text" name="" id="guessInput" ref={myInput} style={!selectedPlaylist ? {visibility:'collapse'} :{}}  onChange={event => { setSearchInput(event.target.value) }} onKeyDown={event => {
              if (event.key === 'Enter') {
                submitAnswer(event)
              }
            }} />
            <button ref={myBtn} onClick={showTracks} style={!selectedPlaylist ? {visibility:'collapse'} : {display: 'flex', justifyContent: 'center', alignItems: 'center'}}><a href={trackPreview} target={'_blank'}>START</a></button>
          </div>
          <div>
            {searchResult.map(track=>(
              <TrackSearchResult track={track} key={track.uri} />
            ))}

          </div>
        </header>
      </div>

      <div id='playlistContainer' style={!selectedPlaylist ? {visibility: 'visible'} : {visibility: 'collapse'}}>
        <span style={{color:' #ffffff'}} hidden={true}>{trackPreview}</span>
        <a href={trackPreview} target={'_blank'} hidden={true}>Preview</a>

        {playlists.map((playlist=>{
          return(
            <div id='playlist'>
              <span>{playlist.name}</span>
              <img src={playlist.images[0].url} />
              <button property={playlist.id} onClick={event=> select(event)} ><a href="#">Select</a></button>
            </div>
          )
        }))}
      </div>
      <span>{selectedPlaylist}</span>

      <Player accessToken={spotifyToken} trackUri={trackUri}/>
    </>
  );
}

export default App;
