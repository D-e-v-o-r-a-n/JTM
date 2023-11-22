import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { loginUrl, getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Components/Player/Player';
import TrackSearchResult from './Components/TrackSearchResult/TrackSearchResult';
import Zoisa from './zoisa';
import Checkboxes from './Components/Checkboxes/Checkboxes';
import Input from './Components/Input/Input';
import Playlists_n_Albums from './Components/Playlist_n_Albums/Playlists_n_Albums';

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
    if(spotifyToken) showPlaylist()
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

  async function showPlaylist() {
    console.log(checkboxType, 'checkboxtypeshowplaylist')
    switch(checkboxType){
      case 'Me':
        spotify.getUserPlaylists({limit: 50})
         .then(function(data) {
           console.log('User playlists', data);
           setPlaylists(data.items)
           console.log(playlists)
         }, function(err) {
           console.error(err);
         });
         break;
         
      case 'Artist':
          // to działa na taco
         spotify.getArtistAlbums('7CJgLPEqiIRuneZSolpawQ',{limit: 50, include_groups: 'album'})
           .then(function (data) {
             console.log('User playlists', data);
             setPlaylists(data.items)
             console.log(playlists)
           }, function (err) {
             console.error(err);
           });
           break;

      case 'User':
         spotify.getUserPlaylists('31vbfs3bupbisid7zcbomx633bna',{limit: 50})
           .then(function (data) {
             console.log(data)
             setPlaylists(data.items)
           }, function (error) {
             console.log(error)
           })
           break;
      default:
        console.log("Unexpected value in showPlaylist swtich case")
    }
  }


  async function showTracks(event){
    let setTracks = [...(new Set(allTracks))]
    console.log(setTracks, 'setTracks on the top')

    if ((setTracks.length == 2 && (setTracks[0] == undefined || setTracks[1] == undefined)) || setTracks.length == 0){
      console.log("thats the end")
    }else{
      // if there is more than one unplayed song, and here there isn't any played yet, because its the beginning we request album or playlist
      if(event?.target.textContent == 'START'){
        if(checkboxType == 'Artist'){
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
          
        }
        
        } else if (checkboxType == 'Me' || checkboxType == 'User') {

          const tracks = await spotify.getPlaylistTracks(selectedPlaylist, { limit: 50 })
            .then(function (data) {
              return data.items
            }, function (error) {
              console.log(error)
            })

          setStateTracks(tracks.map(track => {
            return track
          }))
          console.log(stateTracks, 'state tracks on top')

          // picking a random track from this list
          const index = Math.floor(Math.random() * (tracks.length))
          const track = tracks[index].track
          setTracksPlayed(tracksPlayed => [...tracksPlayed, track.uri])

          // setting the hook values
          if (!tracksPlayed.includes(track.uri)) {
            setTrackName(track.name)
            setTrackUri(track.uri)

            setPlayTrack(true)

            setAppStarted(true)

            let playbackPlayer = setTimeout(() => {
              setPlayTrack(false)
            }, 20_000)
            setPlayback(playbackPlayer)

          }

        }
    }else {
      // if it isn't the first time, we dont have to get request for playlist or album, because we already have it, but getting a track is diffrent when it's an album and diffrent
      // when it's playlist so we check which case it is here
      switch(checkboxType){

        case 'Artist':
          const indexArtist = Math.floor(Math.random() * (stateTracks.length))
          const trackArtist = stateTracks[indexArtist]
          setTracksPlayed(tracksPlayed => [...tracksPlayed,trackArtist.uri] )
    
          
          
          
          // setAllTracks(stateTracks.map((track)=>{
          //   if(!tracksPlayed.includes(track.uri)){
          //     return track.uri
              
          //   }
          // }))
          

          // setting the hook values
          if(!tracksPlayed.includes(trackArtist.uri)){
            setTrackName(trackArtist.name)
            setTrackUri(trackArtist.uri)
            console.log(trackArtist.name)
            setPlayTrack(true)
    
            setAppStarted(true)
        
            let playbackPlayer = setTimeout(()=>{
              setPlayTrack(false)
            },20_000)
            setPlayback(playbackPlayer)
            
          } else{
              showTracks(event)
          }
          break;

          case 'Me':
          case 'User':
            const index = Math.floor(Math.random() * (stateTracks.length))
            const track = stateTracks[index].track

            console.log(track.uri, 'track.uri before tracks played')

            setTracksPlayed(tracksPlayed => [...tracksPlayed,track.uri] )

            // console.log(tracksPlayed, ' tracks played')
            
            
            // console.log(track.uri, "track track uri switchcase second time")
            
            setAllTracks(stateTracks.map((track)=>{
              if(!tracksPlayed.includes(track.track.uri)){
                return track.track.uri
                
              }
            }))

            console.log(allTracks)
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
            break;
            
          default:
            console.log("Unexpected argument in switch case")
        }
      }         
    }
  }



  function submitAnswer(event){
    const answer = event.target.value

    if(answer.length > 0 && answer.trim().toLowerCase() == trackName.toLowerCase()){
      myInput.current.value = null
      setPlayTrack(false)
      setAnswerFeedback('Brawo, za 3 sekundy następna piosenka')
      // setAllTracks(current =>
      //   current.filter(track => {
      //     return track !== trackUri;
      //   }))
      clearTimeout(playback)
      setTimeout(() => {
        setAnswerFeedback(' ')
        showTracks(event)
      }, 3_000);
    }
    else{
      setAnswerFeedback(" PRÓBUJ DALEJ!")
      console.log({trackName})
      setTimeout(()=>{
        setAnswerFeedback(' ')
      }, 2000)
    }
  }

  // selecting a playlist
  function select(event){
    setSelectedPlaylist(event.currentTarget.attributes[1]['value'])
    // console.log(event.currentTarget.attributes[1]['value'])
  }

  function onlyOne(event) {
    console.log(checkboxType)
    var checkboxes = document.getElementsByName("check");
    checkboxes.forEach((item) => {
        if (item !== event.target) item.checked = false
    })
    setCheckboxType(event.target.attributes[2]['value'])
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
        <header className="App-header">
          <div style={selectedPlaylist ? {display: 'none'} : { display: 'flex', flexDirection: 'column', color: 'white', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
            <h1>Choose one of your playlists and try to guess a song!</h1>
            <span>For each track you have 20 seconds of listening</span>
          </div>
          <h1>{answerFeedback}</h1>

          <Checkboxes spotifyToken={spotifyToken} selectedPlaylist={selectedPlaylist} checkboxFunction={onlyOne}/>

          <a href={loginUrl} id='signInId' style={spotifyToken ? {display: 'none'} : {}} >Sign in with Spotify</a>

          <Input spotifyToken={spotifyToken} selectedPlaylist={selectedPlaylist} appStarted={appStarted} showTracks={showTracks} submitAnswer={submitAnswer} setSearchInput={setSearchInput}
            myBtn={myBtn} myInput={myInput}/>

          <div>
            {searchResult.map(track=>(
              <TrackSearchResult track={track} key={track.uri} trackFunction={tamagotchi}/>
            ))}
          </div>
        </header>

        <Playlists_n_Albums spotifyToken={spotifyToken} selectedPlaylist={selectedPlaylist} select={select} playlists={playlists}/>

        <div style={{display: 'none'}}>
          <Player accessToken={spotifyToken} trackUri={trackUri} playTrack={playTrack}/>
        </div>
    </>
  );
}

export default App;