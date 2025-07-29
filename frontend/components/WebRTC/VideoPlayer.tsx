'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  mirrored?: boolean;
  className?: string;
  placeholder?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ 
  stream, 
  muted = false, 
  mirrored = false, 
  className = '', 
  placeholder = 'No video',
  autoPlay = true 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-lg bg-gray-900 ${className}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          playsInline
          muted={muted}
          onLoadedMetadata={handleLoadedMetadata}
          className={`w-full h-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">{placeholder}</p>
          </div>
        </div>
      )}
      
      {/* Video overlay controls could go here */}
      {stream && (
        <div className="absolute bottom-2 left-2 flex space-x-1">
          {/* Audio indicator */}
          {stream.getAudioTracks().length > 0 && (
            <div className={`w-3 h-3 rounded-full ${stream.getAudioTracks()[0]?.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
          )}
          {/* Video indicator */}
          {stream.getVideoTracks().length > 0 && (
            <div className={`w-3 h-3 rounded-full ${stream.getVideoTracks()[0]?.enabled ? 'bg-blue-500' : 'bg-gray-500'}`} />
          )}
        </div>
      )}
    </div>
  );
} 