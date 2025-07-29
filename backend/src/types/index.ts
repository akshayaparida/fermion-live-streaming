export interface StreamConfig {
  roomId: string;
  userId: string;
  displayName?: string;
}

export interface MediaConfig {
  video: boolean;
  audio: boolean;
  videoConstraints?: Record<string, any>;
  audioConstraints?: Record<string, any>;
}

export interface PeerInfo {
  id: string;
  displayName?: string;
  joined: Date;
}

export interface Room {
  id: string;
  peers: Map<string, PeerInfo>;
  created: Date;
  hlsActive: boolean;
}

export interface SignalingMessage {
  type: 'join-room' | 'leave-room' | 'offer' | 'answer' | 'ice-candidate' | 'peer-joined' | 'peer-left';
  roomId?: string;
  userId?: string;
  data?: any;
}

export interface HLSConfig {
  segmentDuration: number;
  playlistSize: number;
  outputPath: string;
  resolution?: {
    width: number;
    height: number;
  };
  bitrate?: number;
} 