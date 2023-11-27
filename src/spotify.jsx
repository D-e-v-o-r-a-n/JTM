import secrets from './secrets';
const CLIENT_ID = secrets.clientID
const CLIENT_SECRET = secrets.clientSecret

export const authEndpoint = 'https://accounts.spotify.com/authorize';

// deploy
// const redirectUri = 'https://witm-2e81a.web.app/'

// lokalny developement
const redirectUri = 'http://localhost:3000/'

const clientId = CLIENT_ID

const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-top-read',
    'user-modify-playback-state',
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state'

]

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`

export const getTokenFromUrl = ()=>{
    return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial,item)=>{
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1])

        return initial
    }, {})
}