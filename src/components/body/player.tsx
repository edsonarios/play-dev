/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useRef, useEffect } from 'react'
import Plyr, { type APITypes } from 'plyr-react'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { type IPlaylist, type ISections, type ISong } from '@/lib/data'
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
      if (
        playerRef !== undefined &&
        playerRef.current !== undefined &&
        playerRef.current?.plyr !== undefined &&
        currentMusic.song !== undefined &&
        playerRef.current?.plyr.source !== null
      ) {
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
        if (nextSong === undefined && repeatPlaylist === 'on') {
          nextSong = songs[0]
        }
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
  }, [currentMusic, repeatPlaylist, randomPlaylist])

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
        newSpeedIndex = speedOptions.findIndex((speed) => speed > currentSpeed)
        if (newSpeedIndex === -1) newSpeedIndex = speedOptions.length - 1
      } else {
        newSpeedIndex = speedOptions
          .slice()
          .reverse()
          .findIndex((speed) => speed < currentSpeed)
        newSpeedIndex =
          newSpeedIndex !== -1 ? speedOptions.length - 1 - newSpeedIndex : 0
      }
      const newSpeed = speedOptions[newSpeedIndex]
      setSpeed(newSpeed)
      playerRef.current.plyr.speed = newSpeed
    }
  }

  // Event keys press
  useEffect(() => {
    const handleKeyPress = async (event: any) => {
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.tagName === 'SELECT'
      ) { return }
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
  }, [playlists, pictureInPicture])

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
    // Usa DataTransferItemList para acceder a los archivos
    const dataFiles = Array.from(event.dataTransfer.files) as unknown as File[]
    const filesWithMetadata = await window.electronAPI.getMusicMetadata(
      dataFiles.map((file) => file.path)
    )

    if (filesWithMetadata.length === 0) return

    // Found the "All Songs" playlist directly without mapping all sections first
    let defaultPlaylist: IPlaylist | undefined
    for (const section of sections) {
      defaultPlaylist = section.playlists.find((ply) => ply.id === '1')!
      if (defaultPlaylist !== undefined) break
    }

    if (defaultPlaylist === undefined) return
    // Prepara las nuevas canciones para añadir
    const defaultSongsToAdd: ISong[] = filesWithMetadata.map((item) => {
      const newSong: ISong = {
        ...item,
        albumId: '1',
        image: defaultPlaylist?.cover[0] ?? ''
      }
      return newSong
    })

    // Update directly the default playlist with the new songs
    defaultPlaylist.songs = [...defaultPlaylist.songs, ...defaultSongsToAdd]

    // Prepare the updated state of the sections (if necessary)
    const updatedSections = sections.map((section) => {
      if (section.playlists.some((ply) => ply?.id === '1')) {
        return {
          ...section,
          playlists: section.playlists.map((ply) =>
            ply?.id === '1' ? defaultPlaylist : ply
          )
        }
      }
      return section
    })

    // Determine the new songs and the current song based on the random playback setting
    const newSongs = randomPlaylist
      ? shuffleSongsWithCurrentSong(
        defaultPlaylist.songs,
        defaultSongsToAdd[0].id
      )
      : defaultPlaylist.songs

    // Set the new state
    withViewTransition(() => {
      setSections(updatedSections as ISections[])
      setCurrentMusic({
        playlist: defaultPlaylist,
        song: defaultSongsToAdd[0],
        songs: newSongs
      })
    })
  }

  return (
    <div className="">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDropElectron}
        className={pictureInPicture ? 'opacity-0 pointer-events-none' : ''}
      >
        {/* disable error, because de source is handled by useEffect */}
        {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error */}
        <Plyr ref={playerRef} options={playerOptions} />
      </div>
    </div>
  )
}
