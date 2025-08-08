import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { mediasoupService } from './services/mediasoupService';

dotenv.config();

const app = express();
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

(async () => {
  await mediasoupService.init();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
