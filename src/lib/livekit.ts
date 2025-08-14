import { Room, RoomEvent, RemoteTrack, RemoteTrackPublication, LocalTrack, Track } from 'livekit-client'

export interface LiveKitConfig {
  url: string
  token: string
  roomName: string
}

export class LiveKitService {
  private room: Room | null = null
  private onConnected?: () => void
  private onDisconnected?: () => void
  private onTrackSubscribed?: (track: RemoteTrack, publication: RemoteTrackPublication) => void
  private onTrackUnsubscribed?: (track: RemoteTrack, publication: RemoteTrackPublication) => void

  constructor(config?: Partial<LiveKitConfig>) {
    if (config) {
      this.initialize(config)
    }
  }

  async initialize(config: LiveKitConfig) {
    try {
      this.room = new Room()
      
      // Set up event listeners
      this.room.on(RoomEvent.Connected, () => {
        console.log('Connected to LiveKit room')
        this.onConnected?.()
      })

      this.room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit room')
        this.onDisconnected?.()
      })

      this.room.on(RoomEvent.TrackSubscribed, (track, publication) => {
        console.log('Track subscribed:', track.kind)
        this.onTrackSubscribed?.(track, publication)
      })

      this.room.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
        console.log('Track unsubscribed:', track.kind)
        this.onTrackUnsubscribed?.(track, publication)
      })

      // Connect to the room
      await this.room.connect(config.url, config.token)
      
      // Publish local tracks
      await this.publishLocalTracks()
      
    } catch (error) {
      console.error('Failed to initialize LiveKit:', error)
      throw error
    }
  }

  private async publishLocalTracks() {
    if (!this.room) return

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      // Publish tracks
      for (const track of stream.getTracks()) {
        const localTrack = new LocalTrack(
          track.kind as Track.Kind,
          track,
          track.kind === 'video' ? Track.Source.Camera : Track.Source.Microphone
        )
        
        await this.room.localParticipant.publishTrack(localTrack)
      }
    } catch (error) {
      console.error('Failed to publish local tracks:', error)
      throw error
    }
  }

  async toggleAudio(enabled: boolean) {
    if (!this.room) return

    const audioTrack = this.room.localParticipant.getTrack(Track.Kind.Audio)
    if (audioTrack) {
      audioTrack.setEnabled(enabled)
    }
  }

  async toggleVideo(enabled: boolean) {
    if (!this.room) return

    const videoTrack = this.room.localParticipant.getTrack(Track.Kind.Video)
    if (videoTrack) {
      videoTrack.setEnabled(enabled)
    }
  }

  disconnect() {
    if (this.room) {
      this.room.disconnect()
      this.room = null
    }
  }

  // Event handlers
  onConnected(callback: () => void) {
    this.onConnected = callback
  }

  onDisconnected(callback: () => void) {
    this.onDisconnected = callback
  }

  onTrackSubscribed(callback: (track: RemoteTrack, publication: RemoteTrackPublication) => void) {
    this.onTrackSubscribed = callback
  }

  onTrackUnsubscribed(callback: (track: RemoteTrack, publication: RemoteTrackPublication) => void) {
    this.onTrackUnsubscribed = callback
  }

  getRoom() {
    return this.room
  }
}

// Singleton instance
export const livekitService = new LiveKitService()