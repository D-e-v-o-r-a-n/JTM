import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { loginUrl, getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Components/Player/Player';
import TrackSearchResult from './Components/TrackSearchResult/TrackSearchResult';
import Checkboxes from './Components/Checkboxes/Checkboxes';
import Input from './Components/Input/Input';
import Playlists_n_Albums from './Components/Playlist_n_Albums/Playlists_n_Albums';
import Summary from './Components/Summary/Summary';
import ArtistSearchResult from './Components/ArtistSearchResult/ArtistSearchResult';

const spotify = new SpotifyWebApi()

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [trackName, setTrackName] = useState();
  const [trackUri, setTrackUri] = useState();
  const [trackPreview, setTrackPreview] = useState();
  const [selectedPlaylist,setSelectedPlaylist] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [playTrack, setPlayTrack] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState('Guess!')
  const [appStarted, setAppStarted] = useState(false)
  const [playback, setPlayback] = useState()
  const [tracksPlayed, setTracksPlayed] = useState([])
  const [allTracks,setAllTracks] = useState(['index1','index2'])
  const [answer, setAnswer] = useState()
  const [stateTracks, setStateTracks] = useState([])
  const [checkboxType, setCheckboxType] = useState('check')
  const [skipped,setSkipped] = useState([])
  const [guessed,setGuessed] = useState([])
  const [answered, setAnswered] = useState(false)
  const [trackNumber, setTrackNumber] = useState(1)

  const [trackIndex, setTrackIndex] = useState(0)

  const myBtn = useRef(null)
  const myInput = useRef(null)
  const lastAnswer = useRef(null)
  const myH1 = useRef(null)
  const inputFocused = useRef(false)
  const counter = useRef(null)
  const myDiv = useRef(null)

  const score = useRef()
  const guessingFinished = useRef(false)


  const [query, setQuery] = useState()
  const [ArtistSearchResultArray, setArtistSearchResultArray] = useState([])

  const artistInputFocused = useRef(false)
  const [artistID,setArtistID] = useState()
  const ARTISTID = useRef()
  const USERID = useRef()
  const typeInput = useRef(null)




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

    spotify.searchTracks(searchInput, {limit: 4}).then(res =>{
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
    if(checkboxType == 'Artist'){
      if(!query) return setArtistSearchResultArray([])
      if(!spotifyToken) return
  
      ARTISTID.current = undefined
      
      spotify.searchArtists(query, {limit: 4}).then(res =>{
        setArtistSearchResultArray(
          res.artists.items.map(artist=>{
          const smallestImage = artist.images.reduce((
            smallest, image) => {
              if(image.height < smallest.height) return image
              return smallest
            }, artist.images[0])
          return{
            name: artist.name,
            id: artist.id,
            imageUrl: smallestImage.url
          }
        })
      )
      console.log(ArtistSearchResultArray)
  
      }).catch(err=>console.log(err))
    }
  }, [query,checkboxType])









  useEffect(()=>{
    if(trackName) setAnswer(trackName)
  },[trackName])

  useEffect(()=>{
    let myAnswer = myInput.current.value
    lastAnswer.current = myAnswer
  },[answered])

  useEffect(()=>{
    if(spotifyToken) showPlaylist()
    ARTISTID.current = 'x'
  },[spotifyToken,checkboxType])
  
  useEffect(()=>{
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach(item=>{
      if (item.checked){setCheckboxType(item.attributes[2]['value'])}
    })

  },[checkboxType])

  useEffect(()=>{
    if(appStarted) myBtn.current.style='display: none'
  }, [appStarted])


  async function showPlaylist() {
    switch(checkboxType){
      case 'Me':
        spotify.getUserPlaylists({limit: 50})
         .then(function(data) {
           console.log('User playlists', data);
           setPlaylists(data.items)
         }, function(err) {
           console.error(err);
         });
         break;
         
      case 'Artist':
        console.log(artistID, 'artists id')
        console.log(ARTISTID.current, 'ARTIST id')
        spotify.getArtistAlbums(ARTISTID.current,{limit: 50, include_groups: 'album'})
          .then(function (data) {
             setPlaylists(data.items)
          }, function (err) {
            console.error(err);
           });


          ARTISTID.current = undefined
          break;

      // case 'User':
      //    spotify.getUserPlaylists('31vbfs3bupbisid7zcbomx633bna',{limit: 50})
      //      .then(function (data) {
      //        setPlaylists(data.items)
      //      }, function (error) {
      //        console.log(error)
      //      })
      //      break;
      default:
        console.log("Unexpected value in showPlaylist swtich case")
    }
  }


  async function showTracks(event){
    let setTracks = [...(new Set(allTracks))]

    if ((setTracks.length === 2 && (setTracks[0] === undefined || setTracks[1] === undefined)) || setTracks.length === 1){
      guessingFinished.current = true
      setPlayTrack(false)     
    }else{
      // if there is more than one unplayed song, and here there isn't any played yet, because its the beginning we request album or playlist
      if(event?.target.textContent === 'START'){
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
          setAnswer(trackName)
          setAnswered(false)

          
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
            setAnswer(trackName)
            setAnswered(false)

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
            setPlayTrack(true)
    
            setAppStarted(true)
            setAnswer(trackName)
            setAnswered(false)

            
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


            setTracksPlayed(tracksPlayed => [...tracksPlayed,track.uri] )

            // console.log(tracksPlayed, ' tracks played')
            
            
            // console.log(track.uri, "track track uri switchcase second time")
            
            setAllTracks(stateTracks.map((track)=>{
              if(!tracksPlayed.includes(track.track.uri)){
                return track.track.uri
                
              }
            }))

            // setting the hook values
            if(!tracksPlayed.includes(track.uri)){
              setTrackName(track.name)
              setTrackUri(track.uri)
              console.log(track.name)
              setPlayTrack(true)
      
              setAppStarted(true)
              setAnswer(trackName)

              setAnswered(false)
              
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



  function toggleFocus(){
    inputFocused.current = !inputFocused.current
    // console.log(inputFocused.current)
  }
  function toggleArtistFocus(){
    artistInputFocused.current = !artistInputFocused.current
    console.log(artistInputFocused.current, 'artist input focused')
  }

  function skip(){
    // removing skipped track from ' to be played' playlist
    setSkipped(skipped => [...skipped, trackName])
    setPlayTrack(false)
    myH1.current.style.color = 'red'
    setAnswerFeedback('Skipped')
    setAllTracks(current =>
      current.filter(track => {
        return track !== trackUri;
      }))
    setTimeout(()=>{
      myH1.current.style.color = 'white'
      setAnswerFeedback('Guess!')
      setTrackNumber(trackNumber+1)
      myInput.current.value = null
      clearTimeout(playback)
      showTracks()
    },1000)
  }

  function submitAnswer(event){

    const answer = event.target.value

    if(answer.length > 0 && answer.trim().toLowerCase() == trackName.toLowerCase()){
      setGuessed(guessed => [...guessed, trackName])

      setAnswered(true)
      setPlayTrack(false)

      myH1.current.style.color = 'lime'
      setAnswerFeedback('Correct')
      // removing guessed track from ' to be played' playlist
      setAllTracks(current =>
        current.filter(track => {
          return track !== trackUri;
        }))

      clearTimeout(playback)

      setTimeout(()=>{
        myInput.current.value = null
      },10)

      setTimeout(() => {
        myH1.current.style.color = 'white'
        setAnswerFeedback('Guess!')
        setTrackNumber(trackNumber+1)

        showTracks(event)
      }, 3_000);
    }
    else{
      myH1.current.style.color = 'yellow'
      setAnswerFeedback("Wrong!")
      console.log(trackName)
      console.log(answer)
      myInput.current.value = null
      setTimeout(()=>{
        myH1.current.style.color = 'white'
        setAnswerFeedback("Guess!")
      }, 2000)
    }
  }

  // selecting a playlist
  function select(event){
    setSelectedPlaylist(event.currentTarget.attributes[1]['value'])
    // console.log(event.currentTarget.attributes[1]['value'])
  }

  function onlyOne(event) {
    setCheckboxType(event.target.text)
  }

 
  function submitArtist(id){
    console.log(typeInput.current)
    if(typeInput.current != undefined ){ typeInput.current.value = "" };
    setArtistID(id)
    ARTISTID.current = id
    showPlaylist()
    ARTISTID.current = 'x'
    }
  
  function tamagotchi(answer){
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
        <div style={selectedPlaylist ? { display: 'none' } : { display: 'flex', flexDirection: 'column', color: 'white', justifyContent: 'center', alignItems: 'center', padding: '0px' }} className='info'>
          <h1>Choose one of your playlists and try to guess a song!</h1>
          <span>For each track you have 20 seconds of listening</span>
        </div>
        <Summary guessingFinished={guessingFinished} guessed={guessed} skipped={skipped} setGuessed={setGuessed} setSkipped={setSkipped} stateTracks={stateTracks} setAppStarted={setAppStarted} setSelectedPlaylist={setSelectedPlaylist}
        spotifyToken={spotifyToken} setPlaylists={setPlaylists} setSearchResult={setSearchResult} setTracksPlayed={setTracksPlayed} setStateTracks={setStateTracks} setAllTracks={setAllTracks}
        setCheckboxType={setCheckboxType} setAnswered={setAnswered} score={score} setTrackNumber={setTrackNumber} setPlayTrack={setPlayTrack}
        />
        
        <Checkboxes spotifyToken={spotifyToken} selectedPlaylist={selectedPlaylist} checkboxFunction={onlyOne} checkboxType={checkboxType} setQuery={setQuery} toggleArtistFocus={toggleArtistFocus} submitArtist={submitArtist} typeInput={typeInput}
        />

        <div  style={selectedPlaylist ? {display: 'none'} :{}}>
          <div style={ARTISTID.current == 'x' ? {display:'none'}:{}}>
              <div className='artistSearch' style={checkboxType != 'Artist' ? {display: 'none'} : {}}>
                {ArtistSearchResultArray.map((artist)=>(
                  <ArtistSearchResult artist={artist}  artistFunction={submitArtist} />
                ))}
            </div>
          </div>
        </div>
        <header className="App-header" style={guessingFinished.current ? {display: 'none'}:{}}>
          
          <div id='feedback' style={appStarted ? {} : {visibility:'hidden'}}>
            <h1 ref={myH1} >{answerFeedback}</h1>
            <h1 ref={counter}>{`Track ${trackNumber} out of ${stateTracks.length}`}</h1>
          </div>
          

          <a href={loginUrl} id='signInId' style={spotifyToken ? {display: 'none'} : {}} >Sign in with Spotify</a>

          <Input spotifyToken={spotifyToken} selectedPlaylist={selectedPlaylist} appStarted={appStarted} showTracks={showTracks} submitAnswer={submitAnswer} setSearchInput={setSearchInput}
            myBtn={myBtn} myInput={myInput} skipFunction={skip}  toggleFocus={toggleFocus} trackIndex={trackIndex} setTrackIndex={setTrackIndex}/>

          <div>
            {searchResult.map((track,i)=>(
              <TrackSearchResult track={track} key={track.uri} trackFunction={tamagotchi} setTrackIndex={setTrackIndex} trackIndex={trackIndex} id={i+1} inputFocused={inputFocused} />
            ))}
          </div>
        </header>

        <Playlists_n_Albums spotifyToken={spotifyToken} selectedPlaylist={selectedPlaylist} select={select} playlists={playlists} checkboxType={checkboxType}/>

        <div style={{display: 'none'}}>
          <Player accessToken={spotifyToken} trackUri={trackUri} playTrack={playTrack}/>
        </div>
    </>
  );
}

export default App;