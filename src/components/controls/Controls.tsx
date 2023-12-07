'use client'
import { useEffect, useCallback } from 'react'
import CurrentSong from './CurrentSong'
import { PlayIcon } from '@/icons/controls/Play'
import { PauseIcon } from '@/icons/controls/Pause'
import { ControlsRight } from './ControlsRight'
import { SongControl } from './SongControl'
import { NextIcon } from '@/icons/controls/Next'
import { PreviousIcon } from '@/icons/controls/Previous'
import { IconControls } from './IconControls'
import {
  RepeatOffIcon,
  RepeatOnIcon,
  RepeatOneIcon
} from '@/icons/controls/Repeat'
import { RandomOffIcon, RandomOnIcon } from '@/icons/controls/Random'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
import { shuffleSongsWithCurrentSong } from '@/utils/random'

export default function Controls () {
  const {
    currentMusic,
    setCurrentMusic,
    repeatPlaylist,
    setRepeatPlaylist,
    setIsPlaying,
    isPlaying,
    setRandomPlaylist,
    randomPlaylist,
    copyCurrentMusic,
    songs
  } = usePlayerStore<StoreType>((state) => state)

  const handleRandomPlaylist = (): void => {
    if (currentMusic.song === undefined) return

    if (!randomPlaylist) {
      const shufflededSongs = shuffleSongsWithCurrentSong(currentMusic.songs, currentMusic.song.id)
      console.log(shufflededSongs)
      setCurrentMusic({
        ...currentMusic,
        songs: shufflededSongs
      })
    } else {
      setCurrentMusic({
        ...currentMusic,
        songs: copyCurrentMusic.songs
      })
    }
    setRandomPlaylist(!randomPlaylist)
  }

  function PlayPause () {
    if (currentMusic.song === undefined) return
    setIsPlaying(!isPlaying)
  }

  function NextSong () {
    console.log('next song', currentMusic.songs)
    const actualSong = currentMusic.songs.findIndex(
      (song) => song.id === currentMusic.song?.id
    )
    if (actualSong === -1) {
      console.log('No song selected')
      return
    }
    if (repeatPlaylist === 'one') {
      setRepeatPlaylist('on')
    }
    if (
      actualSong === currentMusic.songs.length - 1 &&
      repeatPlaylist === 'on'
    ) {
      setCurrentMusic({
        ...currentMusic,
        song: currentMusic.songs[0]
      })
      return
    }
    if (
      actualSong === currentMusic.songs.length - 1 &&
      repeatPlaylist === 'off'
    ) {
      return
    }

    setCurrentMusic({
      ...currentMusic,
      song: currentMusic.songs[actualSong + 1]
    })
  }
  function PreviousSong () {
    const actualSong = currentMusic.songs.findIndex(
      (song) => song.id === currentMusic.song?.id
    )
    if (repeatPlaylist === 'one') {
      setRepeatPlaylist('on')
    }
    if (actualSong === -1) {
      console.log('No song selected')
      return
    }
    if (actualSong === 0 && repeatPlaylist === 'off') return

    if (actualSong === 0 && repeatPlaylist === 'on') {
      setCurrentMusic({
        ...currentMusic,
        song: currentMusic.songs[currentMusic.songs.length - 1]
      })
      return
    }

    setCurrentMusic({
      ...currentMusic,
      song: currentMusic.songs[actualSong - 1]
    })
  }

  const handlePlayPause = () => {
    PlayPause()
  }

  const handleNextSong = () => {
    console.log('next song')
    NextSong()
  }

  const handlePreviousSong = () => {
    PreviousSong()
  }

  const handleRepeat = () => {
    if (repeatPlaylist === 'off') {
      setRepeatPlaylist('on')
    }
    if (repeatPlaylist === 'on') {
      setRepeatPlaylist('one')
    }
    if (repeatPlaylist === 'one') {
      setRepeatPlaylist('off')
    }
  }

  const handleMediaAction = useCallback((event: any, action: string) => {
    switch (action) {
      case 'play-pause':
        PlayPause()
        break
      case 'next-track':
        NextSong()
        break
      case 'previous-track':
        PreviousSong()
        break
      default:
        break
    }
  }, [currentMusic.song, repeatPlaylist, randomPlaylist, isPlaying, songs])

  useEffect(() => {
    window.electronAPI.receive('media-action', handleMediaAction)

    return () => {
      window.electronAPI.removeListener('media-action', handleMediaAction)
    }
  }, [handleMediaAction])

  return (
    <div className='flex flex-row justify-between w-full pr-1 z-10'>
      <div className='w-[600px]'>
        <CurrentSong />
      </div>

      <div className='grid place-content-center gap-4 flex-1 -ml-48'>
        <div className='flex justify-center flex-col items-center'>
          <div className='flex flex-row'>
            <button className='mr-6' onClick={handleRandomPlaylist}>
              <IconControls
                Icon={randomPlaylist ? RandomOffIcon : RandomOnIcon}
                className={`${
                  randomPlaylist ? 'text-green-400 opacity-80' : ''
                }`}
              />
            </button>
            <button className='mr-6' onClick={handlePreviousSong}>
              <IconControls Icon={PreviousIcon} />
            </button>
            <button className='bg-white rounded-full p-2' onClick={handlePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className='ml-6' onClick={handleNextSong}>
              <IconControls Icon={NextIcon} />
            </button>
            <button className='ml-6' onClick={handleRepeat}>
              <IconControls
                Icon={
                  repeatPlaylist === 'off'
                    ? RepeatOffIcon
                    : repeatPlaylist === 'on'
                      ? RepeatOnIcon
                      : RepeatOneIcon
                }
                className={`${
                  repeatPlaylist !== 'off' ? 'text-green-400 opacity-70' : ''
                }`}
              />
            </button>
          </div>
          <SongControl />
        </div>
      </div>

      <div className='grid place-content-center mr-4'>
        <ControlsRight />
      </div>
    </div>
  )
}
