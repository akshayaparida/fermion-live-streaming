import { RtpCodecCapability, WorkerLogTag } from 'mediasoup/node/lib/types';

export const config = {
  mediasoup: {
    // Worker settings
    worker: {
      logLevel: 'warn' as const,
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
      ] as WorkerLogTag[],
    },

    // Router settings
    router: {
      mediaCodecs: [
        // Video Codecs
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          preferredPayloadType: 96,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
        {
          kind: 'video', 
          mimeType: 'video/VP9',
          clockRate: 90000,
          preferredPayloadType: 97,
          parameters: {
            'profile-id': 2,
            'x-google-start-bitrate': 1000,
          },
        },
        {
          kind: 'video',
          mimeType: 'video/h264',
          clockRate: 90000,
          preferredPayloadType: 98,
          parameters: {
            'packetization-mode': 1,
            'profile-level-id': '4d0032',
            'level-asymmetry-allowed': 1,
            'x-google-start-bitrate': 1000,
          },
        },
        {
          kind: 'video',
          mimeType: 'video/h264',
          clockRate: 90000,
          preferredPayloadType: 99,
          parameters: {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
            'level-asymmetry-allowed': 1,
            'x-google-start-bitrate': 1000,
          },
        },

        // Audio Codecs
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
          preferredPayloadType: 111,
        },
        {
          kind: 'audio',
          mimeType: 'audio/PCMU',
          clockRate: 8000,
          preferredPayloadType: 0,
        },
        {
          kind: 'audio',
          mimeType: 'audio/PCMA',
          clockRate: 8000,
          preferredPayloadType: 8,
        },
        {
          kind: 'audio',
          mimeType: 'audio/G722',
          clockRate: 8000,
          preferredPayloadType: 9,
        },
        // Only keep one CN codec to avoid duplicates
        {
          kind: 'audio',
          mimeType: 'audio/CN',
          clockRate: 8000,
          preferredPayloadType: 13,
        },
        {
          kind: 'audio',
          mimeType: 'audio/telephone-event',
          clockRate: 8000,
          preferredPayloadType: 126,
        },
      ] as RtpCodecCapability[],
    },

    // WebRTC transport settings
    webRtcTransport: {
      listenInfos: [
        {
          ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
        },
      ],
      maxIncomingBitrate: 1500000,
      maxOutgoingBitrate: 600000,
      initialAvailableOutgoingBitrate: 1000000,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      enableSctp: true,
    },
  },

  // Socket.io configuration
  socketio: {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  },

  // RTC Port Range
  rtcMinPort: parseInt(process.env.MEDIASOUP_MIN_PORT || '40000'),
  rtcMaxPort: parseInt(process.env.MEDIASOUP_MAX_PORT || '49999'),
};