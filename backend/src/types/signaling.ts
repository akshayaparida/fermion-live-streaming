export interface JoinRoomPayload {
  sessionId: string;
  displayName?: string;
}

export interface CreateTransportPayload {
  direction: 'send' | 'recv';
}

export interface ConnectTransportPayload {
  transportId: string;
  dtlsParameters: any;
}

export interface ProducePayload {
  transportId: string;
  kind: 'audio' | 'video';
  rtpParameters: any;
}

export interface ConsumePayload {
  transportId: string;
  producerId: string;
  rtpCapabilities: any;
}

export interface ResumePayload {
  consumerId: string;
}
