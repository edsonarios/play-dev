/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useRef, useEffect, useMemo } from 'react'
import Plyr, { type APITypes } from 'plyr-react'
import { type StoreType, usePlayerStore } from '@/store/playerStore'

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
    setSpeed
  } = usePlayerStore<StoreType>((state) => state)

  let videoSrc = ''
  if (currentMusic.song !== undefined && currentMusic.playlist !== undefined) {
    videoSrc = `file://${currentMusic.song.directoryPath}/${currentMusic.song.title}`
  }

  const plyrComponent = useMemo(
    () => (
      <Plyr
        ref={playerRef}
        source={{
          type: 'video',
          sources: [
            {
              src: videoSrc,
              provider: 'html5'
            }
          ]
        }}
        options={playerOptions}
      />
    ),
    [playerRef, videoSrc]
  )

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
  return (
    <div>
      {plyrComponent}
    </div>
  )
}
