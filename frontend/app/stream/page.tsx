'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSocket } from '../../hooks/useSocket';
import { useMediaStream } from '../../hooks/useMediaStream';
import { VideoPlayer } from '../../components/WebRTC/VideoPlayer';
import { MediaControls } from '../../components/WebRTC/MediaControls';

// Generate a simple room ID for testing
const generateRoomId = () => `room-${Math.random().toString(36).substr(2, 9)}`;

export default function StreamPage() {
  const [roomId] = useState(() => generateRoomId());
  const [roomJoined, setRoomJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { socket: _socket, connected, joinRoom } = useSocket();
  const {
    stream,
    videoEnabled,
    audioEnabled,
    loading,
    error: mediaError,
    devices,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
    switchCamera,
    switchMicrophone,
  } = useMediaStream();

  // Auto-join room when socket connects
  useEffect(() => {
    if (connected && !roomJoined) {
      handleJoinRoom();
    }
  }, [connected, roomJoined]);

  const handleJoinRoom = async () => {
    try {
      const result = await joinRoom(roomId);
      if (result.success) {
        setRoomJoined(true);
        setError(null);
        console.log('🏠 Successfully joined room:', roomId);
        console.log('👥 Participants:', result.participants);
      } else {
        setError(result.error || 'Failed to join room');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    }
  };

  const handleStartStream = async () => {
    if (!roomJoined) {
      setError('Please wait for room connection');
      return;
    }
    
    try {
      await startStream();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start stream');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Live Stream Studio</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Room:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                  {roomId}
                </code>
              </div>
            </div>
            <Link href="/" className="btn-secondary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {(error || mediaError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">
                {error || mediaError}
              </p>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={connected ? 'text-green-700' : 'text-red-700'}>
                  {connected ? 'Socket Connected' : 'Socket Disconnected'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${roomJoined ? 'bg-blue-500' : 'bg-gray-400'}`} />
                <span className={roomJoined ? 'text-blue-700' : 'text-gray-600'}>
                  {roomJoined ? 'Room Joined' : 'Joining Room...'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stream ? 'bg-purple-500' : 'bg-gray-400'}`} />
                <span className={stream ? 'text-purple-700' : 'text-gray-600'}>
                  {stream ? 'Stream Active' : 'No Stream'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Video</h2>
                {stream && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${videoEnabled ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      <span>Video</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${audioEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span>Audio</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Local Video Player */}
              <VideoPlayer 
                stream={stream}
                muted={true}
                mirrored={true}
                className="aspect-video w-full"
                placeholder="Click 'Start Stream' to begin"
              />

              {/* Stream Instructions */}
              {!stream && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Click "Start Stream" to access your camera and microphone</li>
                    <li>2. Adjust your video and audio settings as needed</li>
                    <li>3. Share the room ID with others to join the session</li>
                    <li>4. Open /watch in another tab to see the HLS stream</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Remote Participants Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Participants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Placeholder for remote participants */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm">Waiting for participants...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-1">
            <MediaControls
              videoEnabled={videoEnabled}
              audioEnabled={audioEnabled}
              loading={loading}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              onStartStream={handleStartStream}
              onStopStream={stopStream}
              cameras={devices.cameras}
              microphones={devices.microphones}
              onSwitchCamera={switchCamera}
              onSwitchMicrophone={switchMicrophone}
              connected={connected && roomJoined}
            />

            {/* Room Information */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Room Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room ID:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {roomId}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${roomJoined ? 'text-green-600' : 'text-yellow-600'}`}>
                    {roomJoined ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">1 (You)</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">
                  To test two-way communication:
                </p>
                <ol className="text-xs text-gray-600 space-y-1">
                  <li>1. Copy the room ID above</li>
                  <li>2. Open this page in incognito mode</li>
                  <li>3. Both users will be connected via WebRTC</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}