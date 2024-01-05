import http from 'http'
import url from 'url'
import opn from 'open'
import destroyer from 'server-destroy'

import { google } from 'googleapis'
import { type IPlaylist, Playlist } from './entities/playlist.entity'
import { type ISong, Song } from './entities/song.entity'
import { getRandomColor } from './utils'
const people = google.people('v1')
const youtube = google.youtube('v3')

const oauth2Client = new google.auth.OAuth2(
  '864817918865-1id7p6p7dfknf3oh9omjnruv4thvqadn.apps.googleusercontent.com',
  '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',
  'http://localhost:7173/oauth2callback'
)
google.options({ auth: oauth2Client })

const scopes = [
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/youtube.readonly'
]

export async function authenticate () {
  return await new Promise((resolve, reject) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    })
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.includes('/oauth2callback')) {
            const qs = new url.URL(req.url, 'http://localhost:7173')
              .searchParams
            res.end('Authentication successful! Close this window')
            server.destroy()
            const response = await oauth2Client.getToken(qs.get('code'))
            const { tokens } = response
            oauth2Client.credentials = tokens
            resolve(oauth2Client)
          }
        } catch (e) {
          reject(e)
        }
      })
      .listen(7173, () => {
        opn(authorizeUrl, { wait: false }).then(cp => { cp.unref() })
      })
    destroyer(server)
  })
}

export async function getProfile () {
  const res = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names,photos'
  })
  const profile = {
    name: res.data.names[0].displayName,
    email: res.data.emailAddresses[0].value,
    image: res.data.photos[0].url
  }
  console.log(profile)
  return profile
}

async function getAllPlaylists (etag) {
  let allPlaylists = []
  let pageToken = null
  do {
    const response = await getPlaylistData(etag, pageToken)
    etag = response.data.etag
    allPlaylists = allPlaylists.concat(response.data.items)
    pageToken = response.data.nextPageToken
  } while (pageToken)
  return allPlaylists
}

async function getPlaylistData (etag, pageToken) {
  const headers = {}
  if (etag) {
    headers['If-None-Match'] = etag
  }
  const res = await youtube.playlists.list({
    part: 'id,snippet',
    mine: true,
    maxResults: 50,
    pageToken,
    headers
  })
  console.log('Status code: ' + res.status)
  return await res
}

async function getPlaylistItems (playlistId) {
  let allItems = []
  let pageToken = null
  do {
    const response = await youtube.playlistItems.list({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: 1000,
      pageToken
    })
    allItems = allItems.concat(response.data.items)
    pageToken = response.data.nextPageToken
  } while (pageToken)

  return allItems
}

export async function getDatasFromYoutube () {
  const playlists = await getAllPlaylists(null)
  const playlistsPlayed: IPlaylist[] = []
  const songsPlayed: ISong[] = []

  const items = await getPlaylistItems(playlists[0].id)
  const newPlaylist = new Playlist({
    id: playlists[0].id,
    albumId: playlists[0].id,
    title: playlists[0].snippet.title,
    color: getRandomColor(),
    cover: playlists[0].snippet.thumbnails.default.url,
    artists: ['youtube']
  })
  items.forEach(item => {
    const newSong = new Song({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      albumId: playlists[0].id,
      directoryPath: 'youtube',
      image: item.snippet.thumbnails.default.url,
      artists: [item.snippet.videoOwnerChannelTitle],
      album: playlists[0].snippet.title,
      duration: 0,
      format: 'youtube',
      isDragging: false
    })
    songsPlayed.push(newSong)
  })
  playlistsPlayed.push(newPlaylist)
  return { playlistsPlayed, songsPlayed }
}

// async function runSample() {
//   const playlists = await getAllPlaylists(null);
//   console.log('run sample---------------------')
//   console.log(`Retrieved a total of ${playlists.length} playlists.`);
//   const playlistsPlayed = []
//   const songsPlayed = []
//   for (const playlist of playlists) {
//     console.log('----------------------------------------')
//     console.log(`Obteniendo detalles de la playlist: ${playlist.snippet.title}`);
//     const items = await getPlaylistItems(playlist.id);
//     console.log(`Encontrados ${items.length} ítems en la playlist ${playlist.snippet.title}`);
//     console.log(items)
//     // Aquí puedes hacer algo con los ítems, como imprimir detalles o almacenarlos
//     const newPlaylist = {
//       id: playlist.id,
//       albumId: playlist.id,
//       title: playlist.snippet.title,
//       color: getRandomColor(),
//       cover: randomImage,
//       artists: ['artist']
//     }
//     items.forEach(item => {
//       const newSong = {
//         id: item.contentDetails.videoId,
//         title: item.snippet.title,
//         albumId: playlist.id,
//         directoryPath: 'youtube',
//         image: '',
//         artists: [item.snippet.videoOwnerChannelTitle],
//         album: playlist.snippet.title,
//         duration: 0,
//         format: '',
//         isDragging: false
//       }
//       songsPlayed.push(newSong)
//     })
//     playlistsPlayed.push(newPlaylist)
//   }
// }

// authenticate(scopes)
//   .then(async client => { await getDatasFromYoutube(client) })
//   .catch(console.error)
