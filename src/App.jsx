import logo from './logo.svg';
import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { loginUrl, getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Components/Player/Player';
import TrackSearchResult from './Components/TrackSearchResult/TrackSearchResult';
import Zoisa from './zoisa';

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
  const [playTrack, setPlayTrack] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState()
  const [appStarted, setAppStarted] = useState(false)
  const [playback, setPlayback] = useState()
  const [tracksPlayed, setTracksPlayed] = useState([])
  const [allTracks,setAllTracks] = useState(['index1','index2'])
  const [answer, setAnswer] = useState()
  const [stateTracks, setStateTracks] = useState([])
  const [checkboxType, setCheckboxType] = useState('check')
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


  useEffect(()=>{
    if(spotifyToken) showPlaylist(checkboxType)
  },[spotifyToken,checkboxType])
  
  useEffect(()=>{
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach(item=>{
      if (item.checked){setCheckboxType(item.attributes[2]['value'])}
    })

    console.log(checkboxType, 'useeffect')
  },[checkboxType])

  useEffect(()=>{
    if(appStarted) myBtn.current.style='display: none'
  }, [appStarted])

  async function showPlaylist(type) {
    console.log(checkboxType, 'checkboxtypeshowplaylist')
    if(type == 'User'){
     spotify.getUserPlaylists({limit: 50})
      .then(function(data) {
        console.log('User playlists', data);
        setPlaylists(data.items)
        console.log(playlists)
      }, function(err) {
        console.error(err);
      });

    } else if(type == 'Taco'){
       // to działa na taco
      spotify.getArtistAlbums('7CJgLPEqiIRuneZSolpawQ',{limit: 50, include_groups: 'album'})
        .then(function (data) {
          console.log('User playlists', data);
          setPlaylists(data.items)
          console.log(playlists)
        }, function (err) {
          console.error(err);
        });

    } else if(type == 'Special'){
      spotify.getUserPlaylists('31vbfs3bupbisid7zcbomx633bna',{limit: 50})
        .then(function (data) {
          console.log(data)
          setPlaylists(data.items)
        }, function (error) {
          console.log(error)
        })
    } 
  }


  async function showTracks(event){
    let setTracks = [...(new Set(allTracks))]

    if ((setTracks.length == 2 && (setTracks[0] == undefined || setTracks[1] == undefined)) || setTracks.length == 0){
      console.log("thats the end")
    }else{
      if(event?.target.textContent == 'START'){
        var tracks = await spotify.getAlbumTracks(selectedPlaylist,{limit: 50})
        .then(function(data){
          return data.items
        }, function(error){
          console.log(error)
        })
        
        setStateTracks(tracks.map(track=>{
          return track
        }))
        

      // picking a random track from this list
      const index = Math.floor(Math.random() * (tracks.length))
      const track = tracks[index]
      setTracksPlayed(tracksPlayed => [...tracksPlayed,track.uri] )

      
      
      
      setAllTracks(tracks.map((track)=>{
        if(!tracksPlayed.includes(track.uri)){
          return track.uri
          
        }
      }))

      // setting the hook values
      if(!tracksPlayed.includes(track.uri)){
        setTrackName(track.name)
        setTrackUri(track.uri)

        setPlayTrack(true)

        setAppStarted(true)
    
        let playbackPlayer = setTimeout(()=>{
          setPlayTrack(false)
        },20_000)
        setPlayback(playbackPlayer)
        
      }}else {
        const index = Math.floor(Math.random() * (stateTracks.length))
        const track = stateTracks[index]
        setTracksPlayed(tracksPlayed => [...tracksPlayed,track.uri] )
  
        
        
        
        setAllTracks(stateTracks.map((track)=>{
          if(!tracksPlayed.includes(track.uri)){
            return track.uri
            
          }
        }))
  
        // setting the hook values
        if(!tracksPlayed.includes(track.uri)){
          setTrackName(track.name)
          setTrackUri(track.uri)
          console.log(track.name)
          setPlayTrack(true)
  
          setAppStarted(true)
      
          let playbackPlayer = setTimeout(()=>{
            setPlayTrack(false)
          },20_000)
          setPlayback(playbackPlayer)
          
        } else{
            showTracks(event)
        }
      }
      // // to działa na taco




      // const tracks = await spotify.getPlaylistTracks(selectedPlaylist, { limit: 50 })
      //   .then(function (data) {
      //     return data.items
      //   }, function (error) {
      //     console.log(error)
      //   })

      //   // picking a random track from this list
      // const index = Math.floor(Math.random() * (tracks.length ))
      // const track = tracks[index].track
      // console.log(track.uri, '.uri')
      // setTracksPlayed(tracksPlayed => [...tracksPlayed,track.uri] )

      // console.log(tracksPlayed, 'tracks played')
        
        
      // setAllTracks(tracks.map((track)=>{
      //   console.log(track.track, 'track.track inside of map')
      //     if(!tracksPlayed.includes(track.track.uri)){
      //       return track.track.uri
            
      //     }
      //   }))
      //   console.log(allTracks, 'allTracks')

      //   // setting the hook values
      // if(!tracksPlayed.includes(track.uri)){
      //    setTrackName(track.name)
      //     setTrackUri(track.uri)

      //     setPlayTrack(true)

      //     setAppStarted(true)
      
      //     let playbackPlayer = setTimeout(()=>{
      //       setPlayTrack(false)
      //     },20_000)
      //     setPlayback(playbackPlayer)
          
      //   } else{
      //       showTracks()
      //   }
         
    }
  }

  function onlyOne(event) {
    console.log(checkboxType)
    var checkboxes = document.getElementsByName("check");
    checkboxes.forEach((item) => {
        if (item !== event.target) item.checked = false
    })
    setCheckboxType(event.target.attributes[2]['value'])
  }

  function submitAnswer(event){
    const answer = event.target.value

    if(answer.length > 0 && answer.trim().toLowerCase() == trackName.toLowerCase()){
      myInput.current.value = null
      setPlayTrack(false)
      setAnswerFeedback('Brawo, za 3 sekundy następna piosenka')
      setAllTracks(current =>
        current.filter(track => {
          return track !== trackUri;
        }))
      clearTimeout(playback)
      setTimeout(() => {
        setAnswerFeedback('')
        showTracks(event)
      }, 3_000);
    }
    else{
      setAnswerFeedback(" PRÓBUJ DALEJ!")
      console.log({trackName})
      setTimeout(()=>{
        setAnswerFeedback('')
      }, 2000)
    }
  }

  // selecting a playlist
  function select(event){
    setSelectedPlaylist(event.currentTarget.attributes[0]['value'])
  }

  function tamagotchi(answer){
    setAnswer(answer)
    myInput.current.value = answer
    let fakeEvent = {
      target: {
        value: answer
      }
    }
    submitAnswer(fakeEvent)
  }
  return (
    <>
      <span id="#"></span>
      <div className="App">
        <header className="App-header">
          <div style={{ display: 'flex', flexDirection: 'column', color: 'white', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
            <h1>Choose one of your playlists and try to guess a song!</h1>
            <span>For each track you have 20 seconds of listening</span>
            <h1>{answerFeedback}</h1>
          </div>
          <div  style={selectedPlaylist ? {display: 'none'} :{}}>
            <div className='checkboxes' style={!spotifyToken ? {display: 'none'} : {}}>
              <div>
                <input type="checkbox" name="check" attributes="User" onClick={event => onlyOne(event)}></input><span>User</span>
              </div>
              <div>
                <input type="checkbox" name="check" attributes="Taco" onClick={event => onlyOne(event)}></input><span>Taco</span>
              </div>
              <div>
                <input type="checkbox" name="check" attributes="Special"  onClick={event => onlyOne(event)}></input><span>Special</span>
              </div>
            </div>
          </div>


          <a href={loginUrl} id='signInId' style={spotifyToken ? {display: 'none'} : {}} >Sign in with Spotify</a>

          <div style={ (!spotifyToken ? {display: 'none'} : {display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem'}) }>
            <input type="text" name="" id="guessInput" ref={myInput} style={(!selectedPlaylist ? {display: 'none'} :{}) && (!appStarted ? {display: 'none'} : {} )}  onChange={event => { setSearchInput(event.target.value) }} onKeyDown={event => {
              if (event.key === 'Enter') {
                submitAnswer(event)
              }
            }} />
            <button ref={myBtn} onClick={event => showTracks(event)} style={(!selectedPlaylist ? {display: 'none'} :{})}>START</button>
          </div>
          <div>
            {searchResult.map(track=>(
              <TrackSearchResult track={track} key={track.uri} trackFunction={tamagotchi}/>
            ))}

          </div>
        </header>
      </div>
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

        <div style={{display: 'none'}}>
          <Player accessToken={spotifyToken} trackUri={trackUri} playTrack={playTrack}/>
        </div>
    </>
  );
}

export default App;