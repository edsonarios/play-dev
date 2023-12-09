/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useRef, useEffect } from 'react'
import Plyr, { type APITypes } from 'plyr-react'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { type Song } from '@/lib/data'

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
    setPictureInPicture
  } = usePlayerStore<StoreType>((state) => state)

  useEffect(() => {
    if (currentMusic.song !== undefined) {
      const newVideoSrc = `file://${currentMusic.song.directoryPath}/${currentMusic.song.title}`

      if (playerRef.current !== undefined && playerRef.current?.plyr !== undefined) {
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
    if (typeof window !== 'undefined') {
      window.addEventListener('ended', handleVideoEnd)

      return () => {
        window.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [currentMusic, repeatPlaylist])

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
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      void playerRef.current.plyr.pause()
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
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]
  const changePlaybackSpeed = (increase: boolean) => {
    if (playerRef.current?.plyr !== undefined) {
      const currentSpeed = playerRef.current.plyr.speed
      let newSpeedIndex

      if (increase) {
        newSpeedIndex = speeds.findIndex(speed => speed > currentSpeed)
        if (newSpeedIndex === -1) newSpeedIndex = speeds.length - 1
      } else {
        newSpeedIndex = speeds.slice().reverse().findIndex(speed => speed < currentSpeed)
        newSpeedIndex = newSpeedIndex !== -1 ? speeds.length - 1 - newSpeedIndex : 0
      }
      const newSpeed = speeds[newSpeedIndex]
      setSpeed(newSpeed)
      playerRef.current.plyr.speed = newSpeed
    }
  }

  // Event change playback speed
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === '+') {
        changePlaybackSpeed(true)
      } else if (event.key === '-') {
        changePlaybackSpeed(false)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

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
  const handleDropElectron = (event: any) => {
    event.preventDefault()
    // Use DataTransferItemList interface to access the file(s)
    if (event.dataTransfer.items !== undefined) {
      if (event.dataTransfer.items.length > 0 && event.dataTransfer.items[0].kind === 'file') {
        const file = event.dataTransfer.items[0].getAsFile()
        const folderPath = file.path.split(file.name)[0]
        const defaultSongs = songs.filter((song) => song.albumId === '1')
        const newSongs = songs
        const newSong: Song = {
          id: window.crypto.randomUUID(),
          albumId: '1',
          title: file.name,
          directoryPath: folderPath,
          image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353',
          artists: ['artists'],
          album: 'All Songs',
          duration: 90,
          format: '',
          isDragging: false
        }
        newSongs.push(newSong)
        defaultSongs.push(newSong)
        setSongs(newSongs)
        setCurrentMusic({
          playlist: playlists[0],
          song: defaultSongs[defaultSongs.length - 1],
          songs: defaultSongs
        })
      }
    }
  }

  return (
    <div
    className='relative'>
      <div onDragOver={handleDragOver} onDrop={handleDropElectron} className={pictureInPicture ? 'opacity-0' : ''}>
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
