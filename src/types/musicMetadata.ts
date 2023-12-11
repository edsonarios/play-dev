export interface IMusicMetadata {
  tagTypes: any[]
  trackInfo: any[]
  lossless: boolean
  container: string
  codec: string
  sampleRate: number
  numberOfChannels: number
  bitrate: number
  codecProfile: string
  tool: string
  trackPeakLevel: number
  duration: number
}
