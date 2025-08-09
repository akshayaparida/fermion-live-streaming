import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as IOServer, type Socket } from 'socket.io';
import { mediasoupService } from './services/mediasoupService';
import { roomService, type PeerState } from './services/roomService';
import type { types as mediasoupTypes } from 'mediasoup';
import type {
  JoinRoomPayload,
  CreateTransportPayload,
  ConnectTransportPayload,
  ProducePayload,
  ConsumePayload,
  ResumePayload
} from './types/signaling';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3001;

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/webrtc/rtp-capabilities', (_req: Request, res: Response) => {
  try {
    const router = mediasoupService.getRouter();
    res.json(router.rtpCapabilities);
  } catch (err) {
    res.status(500).json({ error: 'Router not initialized' });
  }
});

io.on('connection', (socket: Socket) => {
  let currentRoomId: string | null = null;
  let peer: PeerState | null = null;

  socket.on('joinRoom', (payload: JoinRoomPayload, cb: Function) => {
    try {
      currentRoomId = payload.sessionId;
      const room = roomService.getOrCreate(currentRoomId);
      peer = { id: socket.id, producers: new Map(), consumers: new Map() };
      room.peers.set(socket.id, peer);
      socket.join(currentRoomId);
      cb({ ok: true });
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('getRouterRtpCapabilities', (cb: Function) => {
    try {
      const caps = mediasoupService.getRouter().rtpCapabilities;
      cb({ ok: true, rtpCapabilities: caps });
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('createWebRtcTransport', async (payload: CreateTransportPayload, cb: Function) => {
    try {
      if (!peer) throw new Error('Peer not in room');
      const transport = await mediasoupService.createWebRtcTransport(payload.direction);
      const params = {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      };
      if (payload.direction === 'send') peer.sendTransport = transport;
      else peer.recvTransport = transport;
      cb({ ok: true, params });
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('connectWebRtcTransport', async (payload: ConnectTransportPayload, cb: Function) => {
    try {
      if (!peer) throw new Error('Peer not in room');
      const transport = [peer.sendTransport, peer.recvTransport].find(t => t && t.id === payload.transportId);
      if (!transport) throw new Error('Transport not found');
      await transport.connect({ dtlsParameters: payload.dtlsParameters as mediasoupTypes.DtlsParameters });
      cb({ ok: true });
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('produce', async (payload: ProducePayload, cb: Function) => {
    try {
      if (!peer || !peer.sendTransport) throw new Error('No send transport');
      const producer = await peer.sendTransport.produce({ kind: payload.kind, rtpParameters: payload.rtpParameters });
      peer.producers.set(producer.id, producer);
      socket.to(currentRoomId ?? '').emit('newProducer', { producerId: producer.id, kind: producer.kind });
      cb({ ok: true, producerId: producer.id });
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('consume', async (payload: ConsumePayload, cb: Function) => {
    try {
      if (!peer || !peer.recvTransport) throw new Error('No recv transport');
      const router = mediasoupService.getRouter();
      if (!router.canConsume({ producerId: payload.producerId, rtpCapabilities: payload.rtpCapabilities })) {
        throw new Error('cannot consume');
      }
      const consumer = await peer.recvTransport.consume({
        producerId: payload.producerId,
        rtpCapabilities: payload.rtpCapabilities,
        paused: true
      });
      peer.consumers.set(consumer.id, consumer);
      cb({ ok: true, params: {
        id: consumer.id,
        producerId: payload.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters
      }});
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('resume', async (payload: ResumePayload, cb: Function) => {
    try {
      if (!peer) throw new Error('Peer not in room');
      const consumer = peer.consumers.get(payload.consumerId);
      if (!consumer) throw new Error('Consumer not found');
      await consumer.resume();
      cb({ ok: true });
    } catch (e) {
      cb({ ok: false, error: String(e) });
    }
  });

  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = roomService.getOrCreate(currentRoomId);
      if (peer) {
        peer.producers.forEach(p => p.close());
        peer.consumers.forEach(c => c.close());
        peer.sendTransport?.close();
        peer.recvTransport?.close();
        room.peers.delete(socket.id);
      }
    }
  });
});

(async () => {
  await mediasoupService.init();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
