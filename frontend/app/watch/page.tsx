import Link from 'next/link';

export default function WatchPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Watch Live (HLS)</h1>
          <Link href="/" className="btn-secondary">
            ← Back to Home
          </Link>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-4">
            <div className="inline-block p-4 bg-gray-700 rounded-full mb-4">
              📺
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">HLS Live Stream</h2>
          <p className="text-gray-400 mb-4">
            This page will display the live HLS stream generated from WebRTC sessions
          </p>
          <div className="text-sm text-gray-500">
            <p>• Live HLS playback (YouTube-style)</p>
            <p>• Low-latency streaming</p>
            <p>• Automatic playlist refresh</p>
          </div>
        </div>
      </div>
    </div>
  );
}