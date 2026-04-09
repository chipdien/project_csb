import React from 'react';
import { Search, Calendar as CalendarIcon, Bell } from 'lucide-react';

const TopNav: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-240px)] z-40 flex justify-between items-center h-16 px-8 ml-[240px] backdrop-blur-xl shadow-sm bg-white/80">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            className="bg-surface-container-lowest border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 ring-primary-container outline-none placeholder-outline-variant font-medium"
            placeholder="Mã lớp, tên giáo viên..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface hover:text-primary-container transition-all">
          <CalendarIcon size={20} />
        </button>
        <button className="p-2 text-on-surface hover:text-primary-container transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-sm font-headline font-semibold text-on-surface">Cao Ngọc Giáp</span>
            <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">ADMIN</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant/20">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSjSBRxcXYOzj-St8ygpEGd81mxUVw5BpA5Qbc0SvdHLejFODISSGPKTVz4k709rbicFALAj16LZztIAAqk7i5jpHapm0WF4HA9hrr6HlSvBzCmsig2tXYlm5qTuRCjeAavAXoZXrUKn_yWAskjHjM7KPA8Au5hKMI5UA4CTSrsb0SM7jGITV4tBUhIX0KSPWDnFenX_zBcp54FWKcH9LdqPIpQLE6uOnW9ioQ1JuLtW5rpphuVtbgippyAP_-lrFxhyzkeOu5ZtM"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
