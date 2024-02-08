/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useRef, useEffect } from 'react'
import Plyr, { type APITypes } from 'plyr-react'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { type ISong } from '@/lib/data'
import { OpenFolder } from '../services/ElectronUtils'
import { withViewTransition } from '@/utils/transition'
import { shuffleSongsWithCurrentSong } from '@/utils/random'
import { speedOptions } from '@/utils/constants'

export default function PlayerComponent () {
  const playerRef = useRef<APITypes>(null)
  const {
    currentMusic,
    setCurrentMusic,
    repeatPlaylist,
    setIsPlaying,
    isPlaying,
    volume,
    setVolume,
    songCurrentTime,
    setLocalSongCurrentTime,
    setDurationSong,
    playerOptions,
    speed,
    setSpeed,
    songs,
    setSongs,
    playlists,
    pictureInPicture,
    setPictureInPicture,
    randomPlaylist,
    setIsLoading,
    sections,
    setSections
  } = usePlayerStore<StoreType>((state) => state)

  useEffect(() => {
    if (currentMusic.song !== undefined) {
      let newVideoSrc
      if (currentMusic.song.format === 'youtube') {
        newVideoSrc = currentMusic.song.id
      } else {
        newVideoSrc = `file://${currentMusic.song.directoryPath}/${currentMusic.song.title}`
      }
      console.log(newVideoSrc)
      if (playerRef !== undefined && playerRef.current !== undefined && playerRef.current?.plyr !== undefined && currentMusic.song !== undefined && playerRef.current?.plyr.source !== null) {
        if (currentMusic.song.format === 'youtube') {
          playerRef.current.plyr.autoplay = true
          playerRef.current.plyr.source = {
            type: 'video',
            sources: [
              {
                src: newVideoSrc,
                provider: 'youtube'
              }
            ]
          }
        } else {
          playerRef.current.plyr.autoplay = false
          playerRef.current.plyr.source = {
            type: 'video',
            sources: [
              {
                src: newVideoSrc,
                provider: 'html5'
              }
            ]
          }
          void (playerRef.current.plyr.play() as Promise<void>).then(() => {
            if (playerRef.current !== null && pictureInPicture) {
              playerRef.current.plyr.pip = true
            }
          })
        }
      }
    }
  }, [currentMusic.song])

  // Event ended
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (event.target !== undefined) {
        const currentVideoIndex = currentMusic.songs.findIndex(
          (song) => song.id === currentMusic.song?.id
        )
        const { songs } = currentMusic
        let nextSong = songs[currentVideoIndex + 1]
        if (nextSong === undefined && repeatPlaylist === 'on') { nextSong = songs[0] }
        if (nextSong === undefined && repeatPlaylist === 'off') return
        if (repeatPlaylist === 'one' && currentMusic.song !== undefined) {
          void playerRef.current?.plyr.play()
          return
        }

        setCurrentMusic({
          ...currentMusic,
          song: nextSong
        })
      }
    }
    window.addEventListener('ended', handleVideoEnd)

    return () => {
      window.removeEventListener('ended', handleVideoEnd)
    }
  }, [currentMusic, songs.length, repeatPlaylist, randomPlaylist])

  // Event play
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (event.target !== undefined) {
        setIsPlaying(true)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('playing', handleVideoEnd)

      return () => {
        window.removeEventListener('playing', handleVideoEnd)
      }
    }
  }, [])

  // Event pause
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (event.target !== undefined) {
        setIsPlaying(false)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('pause', handleVideoEnd)

      return () => {
        window.removeEventListener('pause', handleVideoEnd)
      }
    }
  }, [])

  // Play/Pause
  useEffect(() => {
    if (
      isPlaying &&
      playerRef.current !== null &&
      currentMusic.song !== undefined
    ) {
      void playerRef.current.plyr.play()
    }
    if (
      !isPlaying &&
      playerRef.current !== null &&
      currentMusic.song !== undefined
    ) {
      if (playerRef.current?.plyr.source !== null) {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        void playerRef.current.plyr.pause()
      }
    }
  }, [isPlaying])

  // Volume control
  useEffect(() => {
    if (playerRef.current !== null) {
      playerRef.current.plyr.volume = volume
    }
  }, [volume])

  // Event Volume
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (event.target !== undefined && playerRef.current !== null) {
        setVolume(playerRef.current.plyr.volume)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('volumechange', handleVideoEnd)

      return () => {
        window.removeEventListener('volumechange', handleVideoEnd)
      }
    }
  }, [])

  // Song Current Time
  useEffect(() => {
    if (playerRef.current !== null && currentMusic.song !== undefined) {
      playerRef.current.plyr.currentTime = songCurrentTime
    }
  }, [songCurrentTime])

  // Event Current Time
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (
        event.target !== undefined &&
        currentMusic.song !== undefined &&
        playerRef.current?.plyr.currentTime !== undefined
      ) {
        setLocalSongCurrentTime(Math.floor(playerRef.current.plyr.currentTime))
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('timeupdate', handleVideoEnd)

      return () => {
        window.removeEventListener('timeupdate', handleVideoEnd)
      }
    }
  }, [playerRef?.current?.plyr.currentTime])

  // Set Duration Song
  useEffect(() => {
    if (
      playerRef.current !== null &&
      currentMusic.song !== undefined &&
      playerRef.current.plyr.duration !== 0
    ) {
      setDurationSong(playerRef.current.plyr.duration)
    }
  }, [playerRef.current?.plyr?.duration])

  // Change playback speed
  const changePlaybackSpeed = (increase: boolean) => {
    if (playerRef.current?.plyr !== undefined) {
      const currentSpeed = playerRef.current.plyr.speed
      let newSpeedIndex

      if (increase) {
        newSpeedIndex = speedOptions.findIndex(speed => speed > currentSpeed)
        if (newSpeedIndex === -1) newSpeedIndex = speedOptions.length - 1
      } else {
        newSpeedIndex = speedOptions.slice().reverse().findIndex(speed => speed < currentSpeed)
        newSpeedIndex = newSpeedIndex !== -1 ? speedOptions.length - 1 - newSpeedIndex : 0
      }
      const newSpeed = speedOptions[newSpeedIndex]
      setSpeed(newSpeed)
      playerRef.current.plyr.speed = newSpeed
    }
  }

  // Event keys press
  useEffect(() => {
    const handleKeyPress = async (event: any) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') return
      if (event.key === '+') {
        changePlaybackSpeed(true)
      }
      if (event.key === '-') {
        changePlaybackSpeed(false)
      }
      if (event.key === 'p') {
        setPictureInPicture(!pictureInPicture)
      }
      if (event.key === 'o') {
        await OpenFolder(sections, setSections, setIsLoading)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [playlists, songs, pictureInPicture])

  // Set speed from right control
  useEffect(() => {
    if (playerRef.current !== null) {
      playerRef.current.plyr.speed = speed
    }
  }, [speed])

  // Picture in picture
  useEffect(() => {
    if (playerRef.current !== null) {
      if (pictureInPicture) {
        playerRef.current.plyr.pip = true
      } else {
        playerRef.current.plyr.pip = false
      }
    }
  }, [pictureInPicture])

  // Event Enter Picture in picture
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (event.target !== undefined && playerRef.current !== null) {
        setPictureInPicture(playerRef.current.plyr.pip)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('enterpictureinpicture', handleVideoEnd)

      return () => {
        window.removeEventListener('enterpictureinpicture', handleVideoEnd)
      }
    }
  }, [])

  // Event Leave Picture in picture
  useEffect(() => {
    const handleVideoEnd = (event: any) => {
      if (event.target !== undefined && playerRef.current !== null) {
        setPictureInPicture(playerRef.current.plyr.pip)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('leavepictureinpicture', handleVideoEnd)

      return () => {
        window.removeEventListener('leavepictureinpicture', handleVideoEnd)
      }
    }
  }, [])

  // Event full screen
  useEffect(() => {
    const handleFullScreen = (event: any) => {
      if (event.target !== undefined) {
        // Implement full screen to add controls
        // console.log(playerOptions)
        // console.log('enter full screen')
        // setPlayerOptions({
        //   loop: { active: false },
        //   autoplay: true,
        //   hideControls: true,
        //   keyboard: {
        //     global: true
        //   },
        //   invertTime: false,
        //   controls: ['play-large', 'pip', 'volume', 'progress', 'fullscreen']
        // })
        // console.log(playerOptions)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('enterfullscreen', handleFullScreen)

      return () => {
        window.removeEventListener('enterfullscreen', handleFullScreen)
      }
    }
  }, [])

  // drang and drop
  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  // drang and drop main process
  const handleDropElectron = async (event: any) => {
    event.preventDefault()
    // Use DataTransferItemList interface to access the file(s)
    const dataFiles = Array.from(event.dataTransfer.files) as unknown as File[]
    const filesWithMetadata = await window.electronAPI.getMusicMetadata(dataFiles.map(file => file.path))
    if (dataFiles !== undefined) {
      if (dataFiles.length > 0) {
        const defaultSongsToAdd: ISong[] = []
        for (const item of filesWithMetadata) {
          const newSong: ISong = {
            ...item,
            albumId: '1',
            image: playlists[0].cover[0]
          }
          defaultSongsToAdd.push(newSong)
        }

        // Find songs from default playlist and add new songs from the drag and drop
        let songsFromDefaultPlaylist = songs.filter((song) => song.albumId === playlists[0].id)
        songsFromDefaultPlaylist = [...songsFromDefaultPlaylist, ...defaultSongsToAdd]

        // If random playlist is active, shuffle the songs
        if (randomPlaylist) {
          songsFromDefaultPlaylist = shuffleSongsWithCurrentSong(songsFromDefaultPlaylist, defaultSongsToAdd[0].id)
          console.log(songsFromDefaultPlaylist)
        }

        // Put the new songs in the current music and reproduce it the first song from the drag and drop
        withViewTransition(() => {
          setCurrentMusic({
            playlist: playlists[0],
            song: defaultSongsToAdd[0],
            songs: songsFromDefaultPlaylist
          })
          const newSongs = [...songs, ...defaultSongsToAdd]
          setSongs(newSongs)
        })
      }
    }
  }

  return (
    <div
    className=''>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDropElectron}
        className={pictureInPicture ? 'opacity-0 pointer-events-none' : ''}
      >
        {/* disable error, because de source is handled by useEffect */}
        {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error */}
        <Plyr
          ref={playerRef}
          options={playerOptions}
        />
      </div>
    </div>
  )
}
