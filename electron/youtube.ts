// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import http from 'http'
import url from 'url'
import opn from 'open'
import destroyer from 'server-destroy'

import { google } from 'googleapis'
import { type IPlaylist } from './entities/playlist.entity'
import { type ISong } from './entities/song.entity'
import { getRandomColor } from './utils'
import fs from 'node:fs'
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
          if (req.url !== undefined && req.url.includes('/oauth2callback')) {
            const qs = new url.URL(req.url, 'http://localhost:7173')
              .searchParams
            res.end('Authentication successful! Close this window')
            server.destroy()
            const code = qs.get('code') as string
            const { tokens } = await oauth2Client.getToken(code)
            oauth2Client.credentials = tokens
            resolve(oauth2Client)
          }
        } catch (e) {
          reject(e)
        }
      })
      .listen(7173, () => {
        void opn(authorizeUrl, { wait: false }).then(cp => { cp.unref() })
      })
    destroyer(server)
  })
}

export async function getProfile () {
  const res = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names,photos'
  })
  if (res.data?.names === undefined || res.data?.emailAddresses === undefined || res.data?.photos === undefined) return
  const profile = {
    name: res.data.names[0].displayName,
    email: res.data.emailAddresses[0].value,
    image: res.data.photos[0].url
  }
  return profile
}

async function getAllPlaylists (etag: string | null) {
  let allPlaylists: any = []
  let pageToken = null
  do {
    const response = await getPlaylistData(etag, pageToken)
    etag = response.data.etag
    allPlaylists = allPlaylists.concat(response.data.items)
    pageToken = response.data.nextPageToken
  } while (pageToken)
  return allPlaylists
}

async function getPlaylistData (etag: string, pageToken: string) {
  const headers = {}
  if (etag !== undefined) {
    headers['If-None-Match'] = etag
  }
  const res = youtube.playlists.list({
    part: 'id,snippet',
    mine: true,
    maxResults: 50,
    pageToken,
    headers
  })
  return await res
}

async function getPlaylistItems (playlistId) {
  let allItems: any = []
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
  let songsPlayed: ISong[] = []
  for (const playlist of playlists) {
    console.log('----------------------------------------')
    console.log(playlist.snippet.title)
    console.log(playlist)
    const items = await getPlaylistItems(playlist.id)

    items.forEach(item => {
      console.log(item)
      console.log(item.snippet.title)
      if (item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video') {
        const newSong: ISong = {
          id: item.contentDetails.videoId,
          title: item.snippet.title,
          albumId: playlist.id,
          directoryPath: 'youtube',
          image: item.snippet.thumbnails.default.url,
          artists: [item.snippet.videoOwnerChannelTitle],
          album: playlist.snippet.title,
          duration: 0,
          format: 'youtube',
          isDragging: false
        }
        songsPlayed.push(newSong)
      }
    })
    const newPlaylist: IPlaylist = {
      id: playlist.id,
      albumId: playlist.id,
      title: playlist.snippet.title,
      color: getRandomColor(),
      cover: playlist.snippet.thumbnails.default.url,
      artists: ['youtube'],
      songs: songsPlayed
    }
    playlistsPlayed.push(newPlaylist)
    songsPlayed = []
  }
  return { playlistsPlayed }
}
