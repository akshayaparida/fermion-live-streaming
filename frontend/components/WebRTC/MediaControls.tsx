'use client';

import { useState } from 'react';

interface MediaControlsProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  loading: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onStartStream: () => Promise<void>;
  onStopStream: () => void;
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  onSwitchCamera: (deviceId: string) => Promise<void>;
  onSwitchMicrophone: (deviceId: string) => Promise<void>;
  connected: boolean;
}

export function MediaControls({
  videoEnabled,
  audioEnabled,
  loading,
  onToggleVideo,
  onToggleAudio,
  onStartStream,
  onStopStream,
  cameras,
  microphones,
  onSwitchCamera,
  onSwitchMicrophone,
  connected,
}: MediaControlsProps) {
  const [showDevices, setShowDevices] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Media Controls</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex space-x-3 mb-4">
        {/* Start/Stop Stream */}
        <button
          onClick={loading ? undefined : onStartStream}
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Starting...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Start Stream</span>
            </>
          )}
        </button>

        <button
          onClick={onStopStream}
          className="btn-secondary px-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
      </div>

      {/* Video/Audio Toggles */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={onToggleVideo}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
            videoEnabled
              ? 'border-primary-200 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-gray-50 text-gray-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {videoEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            )}
          </svg>
          <span className="font-medium">{videoEnabled ? 'Video On' : 'Video Off'}</span>
        </button>

        <button
          onClick={onToggleAudio}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
            audioEnabled
              ? 'border-success-200 bg-success-50 text-success-700'
              : 'border-gray-200 bg-gray-50 text-gray-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {audioEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
          <span className="font-medium">{audioEnabled ? 'Mic On' : 'Mic Off'}</span>
        </button>
      </div>

      {/* Device Selection */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowDevices(!showDevices)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>Device Settings</span>
          <svg
            className={`w-4 h-4 transition-transform ${showDevices ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDevices && (
          <div className="mt-3 space-y-3">
            {/* Camera Selection */}
            {cameras.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Camera</label>
                <select
                  onChange={(e) => onSwitchCamera(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Microphone Selection */}
            {microphones.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Microphone</label>
                <select
                  onChange={(e) => onSwitchMicrophone(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 