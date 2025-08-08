import { types as mediasoupTypes } from 'mediasoup';

export const workerSettings: mediasoupTypes.WorkerSettings = {
  logLevel: 'warn',
  logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
  rtcMinPort: 40000,
  rtcMaxPort: 49999
};

export const routerMediaCodecs: mediasoupTypes.RtpCodecCapability[] = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
    preferredPayloadType: 111
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: { 'x-google-start-bitrate': 1000 },
    preferredPayloadType: 96
  },
  {
    kind: 'video',
    mimeType: 'video/H264',
    clockRate: 90000,
    parameters: {
      'packetization-mode': 1,
      'profile-level-id': '42e01f',
      'level-asymmetry-allowed': 1
    },
    preferredPayloadType: 102
  }
];

export const webRtcTransportOptions: Partial<mediasoupTypes.WebRtcTransportOptions> = {
  listenIps: [
    // For local dev
    { ip: '127.0.0.1', announcedIp: undefined }
    // For public deploys, set announcedIp to public IP
    // { ip: '0.0.0.0', announcedIp: 'YOUR_PUBLIC_IP' }
  ],
  enableUdp: true,
  enableTcp: true,
  preferUdp: true,
  initialAvailableOutgoingBitrate: 1_000_000
};
