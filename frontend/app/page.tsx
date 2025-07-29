import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 📚 Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Fermion Live
              </h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                Education Platform
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="/stream" className="text-gray-600 hover:text-primary-600 font-medium cursor-pointer transition-colors">
                Create Stream
              </Link>
              <Link href="/watch" className="text-gray-600 hover:text-primary-600 font-medium cursor-pointer transition-colors">
                Join Session
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* 📖 Left Side - Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
              Live Educational
              <span className="block text-primary-600">Streaming Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect educators and learners through real-time video streaming with professional-grade 
              <span className="font-semibold text-primary-600"> WebRTC</span> technology and scalable 
              <span className="font-semibold text-success-600"> HLS</span> distribution.
            </p>

            {/* 🎯 Key Features */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Interaction</h3>
                  <p className="text-sm text-gray-600">Low-latency WebRTC streaming</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-success-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Scalable Viewing</h3>
                  <p className="text-sm text-gray-600">HLS for unlimited students</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-warning-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Professional Quality</h3>
                  <p className="text-sm text-gray-600">HD video & crystal clear audio</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-error-100 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-error-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Easy Setup</h3>
                  <p className="text-sm text-gray-600">Start streaming in minutes</p>
                </div>
              </div>
            </div>

            {/* 🚀 Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/stream" className="flex-1">
                <button className="btn-primary w-full justify-center inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Start Teaching Session
                </button>
              </Link>
              <Link href="/watch" className="flex-1">
                <button className="btn-outline w-full justify-center inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Join as Student
                </button>
              </Link>
            </div>
          </div>

          {/* 🎥 Right Side - Demo Card */}
          <div className="animate-slide-up">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Demo</h3>
                  <div className="status-live">
                    <div className="status-dot status-dot-live"></div>
                    Ready
                  </div>
                </div>
              </div>
              
              {/* 📺 Mock Video Player */}
              <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">Click "Start Teaching Session" to begin</p>
                </div>
              </div>
              
              {/* 📊 Demo Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">&lt; 100ms</div>
                  <div className="text-sm text-gray-600">Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">HD</div>
                  <div className="text-sm text-gray-600">Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">∞</div>
                  <div className="text-sm text-gray-600">Viewers</div>
                </div>
              </div>
            </div>
            
            {/* 🛠️ Tech Stack */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Built With Modern Technology</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">Next.js 15</span>
                <span className="px-3 py-1 bg-success-100 text-success-800 text-sm font-medium rounded-full">WebRTC</span>
                <span className="px-3 py-1 bg-warning-100 text-warning-800 text-sm font-medium rounded-full">HLS</span>
                <span className="px-3 py-1 bg-error-100 text-error-800 text-sm font-medium rounded-full">TypeScript</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 🏷️ Footer Note */}
        <div className="mt-16 text-center border-t border-gray-200 pt-8">
          <p className="text-gray-500">
            Technical Assignment for <span className="font-semibold text-primary-600">Fermion</span> • 
            Built with professional-grade streaming technology
          </p>
        </div>
      </main>
    </div>
  );
}