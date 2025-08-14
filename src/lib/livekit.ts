import { Room, RoomEvent, RemoteTrack, RemoteTrackPublication, LocalTrack, Track } from 'livekit-client'

export interface LiveKitConfig {
  url: string
  token: string
  roomName: string
}

export class LiveKitService {
  private room: Room | null = null
  private connectedCallback?: () => void
  private disconnectedCallback?: () => void
  private trackSubscribedCallback?: (track: RemoteTrack, publication: RemoteTrackPublication) => void
  private trackUnsubscribedCallback?: (track: RemoteTrack, publication: RemoteTrackPublication) => void

  constructor(config?: Partial<LiveKitConfig>) {
    // Don't initialize in constructor - wait for explicit initialize call
  }

  async initialize(config: LiveKitConfig) {
    try {
      this.room = new Room()
      
      // Set up event listeners
      this.room.on(RoomEvent.Connected, () => {
        console.log('Connected to LiveKit room')
        this.connectedCallback?.()
      })

      this.room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit room')
        this.disconnectedCallback?.()
      })

      this.room.on(RoomEvent.TrackSubscribed, (track, publication) => {
        console.log('Track subscribed:', track.kind)
        this.trackSubscribedCallback?.(track, publication)
      })

      this.room.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
        console.log('Track unsubscribed:', track.kind)
        this.trackUnsubscribedCallback?.(track, publication)
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

      // Publish tracks using the room's local participant
      for (const track of stream.getTracks()) {
        await this.room.localParticipant.publishTrack(track)
      }
    } catch (error) {
      console.error('Failed to publish local tracks:', error)
      throw error
    }
  }

  async toggleAudio(enabled: boolean) {
    if (!this.room) return

    const audioTrack = this.room.localParticipant.getTrackPublication(Track.Source.Microphone)
    if (audioTrack && audioTrack.track) {
      if (enabled) {
        audioTrack.track.unmute()
      } else {
        audioTrack.track.mute()
      }
    }
  }

  async toggleVideo(enabled: boolean) {
    if (!this.room) return

    const videoTrack = this.room.localParticipant.getTrackPublication(Track.Source.Camera)
    if (videoTrack && videoTrack.track) {
      if (enabled) {
        videoTrack.track.unmute()
      } else {
        videoTrack.track.mute()
      }
    }
  }

  disconnect() {
    if (this.room) {
      this.room.disconnect()
      this.room = null
    }
  }

  // Event handlers
  public onConnected(callback: () => void): void {
    this.connectedCallback = callback
  }

  public onDisconnected(callback: () => void): void {
    this.disconnectedCallback = callback
  }

  public onTrackSubscribed(callback: (track: RemoteTrack, publication: RemoteTrackPublication) => void): void {
    this.trackSubscribedCallback = callback
  }

  public onTrackUnsubscribed(callback: (track: RemoteTrack, publication: RemoteTrackPublication) => void): void {
    this.trackUnsubscribedCallback = callback
  }

  getRoom() {
    return this.room
  }
}

// Singleton instance
export const livekitService = new LiveKitService()