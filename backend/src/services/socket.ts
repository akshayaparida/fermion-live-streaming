import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { mediasoupService } from './mediasoup';
import { config } from '../config/mediasoup';

interface Room {
  id: string;
  participants: Set<string>;
  createdAt: Date;
}

class SocketService {
  private io: SocketIOServer | null = null;
  private rooms: Map<string, Room> = new Map();

  /**
   * Initialize Socket.io server
   */
  initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: config.socketio.cors,
    });

    this.setupEventHandlers();
    console.log('📡 Socket.io server initialized');
  }

  /**
   * Set up all socket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);

      // Join room
      socket.on('join-room', async (data: { roomId: string }, callback) => {
        try {
          const { roomId } = data;
          await this.handleJoinRoom(socket.id, roomId);
          
          // Get router RTP capabilities
          const rtpCapabilities = mediasoupService.getRouterRtpCapabilities();
          
          callback({ 
            success: true, 
            rtpCapabilities,
            participants: Array.from(this.rooms.get(roomId)?.participants || [])
          });
        } catch (error) {
          console.error('❌ Join room error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Create WebRTC transport
      socket.on('create-transport', async (_data: { direction: 'send' | 'recv' }, callback) => {
        try {
          const { params } = await mediasoupService.createWebRtcTransport(socket.id);
          
          callback({ success: true, params });
        } catch (error) {
          console.error('❌ Create transport error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Connect transport
      socket.on('connect-transport', async (data: { dtlsParameters: any }, callback) => {
        try {
          await mediasoupService.connectTransport(socket.id, data.dtlsParameters);
          callback({ success: true });
        } catch (error) {
          console.error('❌ Connect transport error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Create producer
      socket.on('create-producer', async (data: { 
        kind: 'audio' | 'video', 
        rtpParameters: any 
      }, callback) => {
        try {
          const { id } = await mediasoupService.createProducer(
            socket.id, 
            data.rtpParameters, 
            data.kind
          );

          // Notify other participants in the room
          this.notifyRoomParticipants(socket.id, 'new-producer', { 
            producerId: id, 
            kind: data.kind,
            socketId: socket.id 
          });

          callback({ success: true, id });
        } catch (error) {
          console.error('❌ Create producer error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Create consumer
      socket.on('create-consumer', async (data: { 
        producerId: string, 
        rtpCapabilities: any 
      }, callback) => {
        try {
          const consumerData = await mediasoupService.createConsumer(
            socket.id,
            data.producerId,
            data.rtpCapabilities
          );

          if (!consumerData) {
            callback({ success: false, error: 'Cannot consume producer' });
            return;
          }

          callback({ success: true, consumer: consumerData });
        } catch (error) {
          console.error('❌ Create consumer error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Resume consumer
      socket.on('resume-consumer', async (data: { consumerId: string }, callback) => {
        try {
          await mediasoupService.resumeConsumer(data.consumerId);
          callback({ success: true });
        } catch (error) {
          console.error('❌ Resume consumer error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Get producers
      socket.on('get-producers', (callback) => {
        try {
          const producers = mediasoupService.getProducers();
          callback({ success: true, producers });
        } catch (error) {
          console.error('❌ Get producers error:', error);
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
        this.handleDisconnect(socket.id);
      });
    });
  }

  /**
   * Handle room joining logic
   */
  private async handleJoinRoom(socketId: string, roomId: string): Promise<void> {
    // Create room if doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        participants: new Set(),
        createdAt: new Date(),
      });
      console.log(`🏠 Room created: ${roomId}`);
    }

    const room = this.rooms.get(roomId)!;
    room.participants.add(socketId);

    // Join socket to room
    if (this.io) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(roomId);
        console.log(`👤 Socket ${socketId} joined room ${roomId}`);
        
        // Notify other participants
        socket.to(roomId).emit('participant-joined', { socketId });
      }
    }
  }

  /**
   * Notify all participants in a room except sender
   */
  private notifyRoomParticipants(senderSocketId: string, event: string, data: any): void {
    if (!this.io) return;

    const socket = this.io.sockets.sockets.get(senderSocketId);
    if (socket) {
      // Find the room this socket is in
      for (const room of socket.rooms) {
        if (room !== senderSocketId) { // Skip the default room (socket ID)
          socket.to(room).emit(event, data);
          break;
        }
      }
    }
  }

  /**
   * Handle socket disconnect
   */
  private handleDisconnect(socketId: string): void {
    // Clean up mediasoup resources
    mediasoupService.cleanup(socketId);

    // Remove from rooms
    this.rooms.forEach((room, roomId) => {
      if (room.participants.has(socketId)) {
        room.participants.delete(socketId);
        
        // Notify other participants
        if (this.io) {
          this.io.to(roomId).emit('participant-left', { socketId });
        }

        // Delete empty rooms
        if (room.participants.size === 0) {
          this.rooms.delete(roomId);
          console.log(`🏠 Room deleted: ${roomId}`);
        }
      }
    });
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      rooms: this.rooms.size,
      totalParticipants: Array.from(this.rooms.values())
        .reduce((total, room) => total + room.participants.size, 0),
      mediasoup: mediasoupService.getStats(),
    };
  }

  /**
   * Get Socket.io instance
   */
  getIO(): SocketIOServer | null {
    return this.io;
  }
}

// Export singleton instance
export const socketService = new SocketService();