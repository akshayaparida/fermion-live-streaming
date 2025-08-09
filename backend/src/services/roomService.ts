import type { types as mediasoupTypes } from 'mediasoup';

export interface PeerState {
  id: string;
  sendTransport?: mediasoupTypes.WebRtcTransport;
  recvTransport?: mediasoupTypes.WebRtcTransport;
  producers: Map<string, mediasoupTypes.Producer>;
  consumers: Map<string, mediasoupTypes.Consumer>;
}

export class RoomState {
  readonly id: string;
  readonly peers: Map<string, PeerState> = new Map();

  constructor(id: string) {
    this.id = id;
  }
}

class RoomService {
  private rooms: Map<string, RoomState> = new Map();

  public getOrCreate(sessionId: string): RoomState {
    let room = this.rooms.get(sessionId);
    if (!room) {
      room = new RoomState(sessionId);
      this.rooms.set(sessionId, room);
    }
    return room;
  }

  public remove(sessionId: string): void {
    this.rooms.delete(sessionId);
  }
}

export const roomService = new RoomService();
