import * as mediasoup from 'mediasoup';
import { Worker, Router, WebRtcTransport, Producer, Consumer } from 'mediasoup/node/lib/types';
import { config } from '../config/mediasoup';

class MediasoupService {
  private worker: Worker | null = null;
  private router: Router | null = null;
  private transports: Map<string, WebRtcTransport> = new Map();
  private producers: Map<string, Producer> = new Map();
  private consumers: Map<string, Consumer> = new Map();

  /**
   * Initialize Mediasoup Worker and Router
   */
  async initialize(): Promise<void> {
    try {
      // Create Mediasoup Worker
      this.worker = await mediasoup.createWorker({
        ...config.mediasoup.worker,
        rtcMinPort: config.rtcMinPort,
        rtcMaxPort: config.rtcMaxPort,
      });

      console.log('🎥 Mediasoup Worker created', this.worker.pid);

      // Handle worker death
      this.worker.on('died', () => {
        console.error('💀 Mediasoup Worker died');
        process.exit(1);
      });

      // Create Router
      this.router = await this.worker.createRouter({
        mediaCodecs: config.mediasoup.router.mediaCodecs,
      });

      console.log('📡 Mediasoup Router created');
    } catch (error) {
      console.error('❌ Failed to initialize Mediasoup:', error);
      throw error;
    }
  }

  /**
   * Get Router RTP Capabilities
   */
  getRouterRtpCapabilities() {
    if (!this.router) {
      throw new Error('Router not initialized');
    }
    return this.router.rtpCapabilities;
  }

  /**
   * Create WebRTC Transport for sending/receiving media
   */
  async createWebRtcTransport(socketId: string): Promise<{
    transport: WebRtcTransport;
    params: {
      id: string;
      iceParameters: any;
      iceCandidates: any;
      dtlsParameters: any;
    };
  }> {
    if (!this.router) {
      throw new Error('Router not initialized');
    }

    try {
      const transport = await this.router.createWebRtcTransport({
        listenIps: [
          {
            ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
            announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
          },
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      });

      // Store transport
      this.transports.set(socketId, transport);

      // Handle transport close
      transport.on('dtlsstatechange', (dtlsState) => {
        if (dtlsState === 'closed') {
          transport.close();
          this.transports.delete(socketId);
        }
      });

      console.log(`🚗 WebRTC Transport created for ${socketId}`);

      return {
        transport,
        params: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      };
    } catch (error) {
      console.error('❌ Failed to create WebRTC Transport:', error);
      throw error;
    }
  }

  /**
   * Connect Transport with DTLS parameters
   */
  async connectTransport(socketId: string, dtlsParameters: any): Promise<void> {
    const transport = this.transports.get(socketId);
    if (!transport) {
      throw new Error('Transport not found');
    }

    await transport.connect({ dtlsParameters });
    console.log(`🔗 Transport connected for ${socketId}`);
  }

  /**
   * Create Producer (send media to SFU)
   */
  async createProducer(
    socketId: string,
    rtpParameters: any,
    kind: 'audio' | 'video'
  ): Promise<{ id: string }> {
    const transport = this.transports.get(socketId);
    if (!transport) {
      throw new Error('Transport not found');
    }

    try {
      const producer = await transport.produce({
        kind,
        rtpParameters,
      });

      // Store producer
      this.producers.set(producer.id, producer);

      console.log(`🎬 Producer created: ${kind} from ${socketId}`);

      return { id: producer.id };
    } catch (error) {
      console.error('❌ Failed to create Producer:', error);
      throw error;
    }
  }

  /**
   * Create Consumer (receive media from SFU)
   */
  async createConsumer(
    socketId: string,
    producerId: string,
    rtpCapabilities: any
  ): Promise<{
    id: string;
    kind: string;
    rtpParameters: any;
    producerId: string;
  } | null> {
    const transport = this.transports.get(socketId);
    if (!transport) {
      throw new Error('Transport not found');
    }

    const producer = this.producers.get(producerId);
    if (!producer) {
      console.warn(`Producer ${producerId} not found`);
      return null;
    }

    // Check if router can consume
    if (!this.router!.canConsume({ producerId, rtpCapabilities })) {
      console.warn('Cannot consume producer');
      return null;
    }

    try {
      const consumer = await transport.consume({
        producerId,
        rtpCapabilities,
        paused: true, // Start paused
      });

      // Store consumer
      this.consumers.set(consumer.id, consumer);

      console.log(`🎭 Consumer created: ${consumer.kind} for ${socketId}`);

      return {
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        producerId,
      };
    } catch (error) {
      console.error('❌ Failed to create Consumer:', error);
      throw error;
    }
  }

  /**
   * Resume Consumer (start receiving media)
   */
  async resumeConsumer(consumerId: string): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error('Consumer not found');
    }

    await consumer.resume();
    console.log(`▶️ Consumer resumed: ${consumerId}`);
  }

  /**
   * Get all active producers
   */
  getProducers(): string[] {
    return Array.from(this.producers.keys());
  }

  /**
   * Clean up resources for a socket
   */
  cleanup(socketId: string): void {
    // Close transport
    const transport = this.transports.get(socketId);
    if (transport) {
      transport.close();
      this.transports.delete(socketId);
    }

    // Remove associated producers and consumers
    this.producers.forEach((producer, id) => {
      if (producer.appData.socketId === socketId) {
        producer.close();
        this.producers.delete(id);
      }
    });

    this.consumers.forEach((consumer, id) => {
      if (consumer.appData.socketId === socketId) {
        consumer.close();
        this.consumers.delete(id);
      }
    });

    console.log(`🧹 Cleaned up resources for ${socketId}`);
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      transports: this.transports.size,
      producers: this.producers.size,
      consumers: this.consumers.size,
      workerPid: this.worker?.pid,
      routerId: this.router?.id,
    };
  }
}

// Export singleton instance
export const mediasoupService = new MediasoupService();