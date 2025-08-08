import * as mediasoup from 'mediasoup';
import type { types as mediasoupTypes } from 'mediasoup';
import { workerSettings, routerMediaCodecs, webRtcTransportOptions } from '../config/mediasoup';

class MediasoupService {
  private worker: mediasoupTypes.Worker | null = null;
  private router: mediasoupTypes.Router | null = null;

  public async init(): Promise<void> {
    if (this.worker) return;
    this.worker = await mediasoup.createWorker(workerSettings);
    this.worker.on('died', () => {
      // In real app: restart process or worker manager
      console.error('Mediasoup worker died, exiting process');
      process.exit(1);
    });

    this.router = await this.worker.createRouter({ mediaCodecs: routerMediaCodecs });
    console.log('Mediasoup worker and router initialized');
  }

  public getRouter(): mediasoupTypes.Router {
    if (!this.router) throw new Error('Router not initialized');
    return this.router;
  }

  public async createWebRtcTransport(direction: 'send' | 'recv'): Promise<mediasoupTypes.WebRtcTransport> {
    if (!this.router) throw new Error('Router not initialized');
    const transport = await this.router.createWebRtcTransport({
      ...webRtcTransportOptions,
      appData: { direction }
    } as mediasoupTypes.WebRtcTransportOptions);

    // Optionally set bitrate limits
    await (transport as any).setMaxIncomingBitrate?.(1_500_000).catch(() => undefined);

    return transport;
  }
}

export const mediasoupService = new MediasoupService();
