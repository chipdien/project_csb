import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col items-center justify-center p-6">
      {/* Header / Logo Section */}
      <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Teaching <span className="text-primary">Schedule</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-lg mx-auto">
          Hệ thống quản lý lịch giảng dạy hiện đại, tối ưu và chuyên nghiệp cho VietElite.
        </p>
      </div>

      {/* Main Action Section */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 max-w-md w-full text-center transition-all hover:shadow-primary/10 animate-in fade-in zoom-in-95 duration-1000 delay-300">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">Chào mừng bạn quay trở lại</h2>
        <p className="text-gray-500 mb-8">Dự án đã được khởi tạo thành công với React + TypeScript + TailwindCSS v4.</p>

        <button 
          onClick={() => setCount(count + 1)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
        >
          <span>Bắt đầu kiểm tra HMR</span>
          <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{count}</span>
        </button>
      </div>

      {/* Footer Info */}
      <footer className="mt-16 text-gray-400 text-sm flex gap-8 animate-in fade-in duration-1000 delay-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span>Vite + React + TS</span>
        </div>
        <div>TailwindCSS v4 Active</div>
      </footer>
    </div>
  )
}

export default App
