import logo from './logo.svg';
import './App.css';
import secrets from './secrets';
import { useEffect, useState } from 'react';

const CLIENT_ID = secrets.clientID
const CLIENT_SECRET = secrets.clientSecret
const scope = 'playlist-read-private playlist-read-collaborative'

function App() {
  const [accessToken, setAccessToken] = useState()
  const [searchInput, setSearchInput] = useState()
  const [userID, setUserID] = useState()
  const [albums, setAlbums] = useState([])

  useEffect(() => {

    var authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=${scope}&redirect_uri=http://localhost:8888/callback}`
    }

    fetch('https://accounts.spotify.com/api/token', authParams)
      .then(response => response.json())
      .then(data => { setAccessToken(data.access_token); console.log(data) })
      .catch(error => console.log(`Error ocurred: ${error}`))

    setUserID('31vbfs3bupbisid7zcbomx633bna')

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

    if(returnedAlbums.items == undefined){
       setAlbums([{name:"NOT FOUND", images: [{url: 'https://www.computerhope.com/jargon/e/error.png'}]}])
       console.log(albums)
     } else{
      setAlbums(returnedAlbums.items)
     }
   
    // var playlistParams = {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + accessToken
    //   }
    // }


    // var playlistId = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,playlistParams)
    // .then(response => response.json())
    // .then(data => console.log(data))

  }


  console.log(albums)
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
    </>
  );
}

export default App;
