'use client';

import React from 'react';
import { Home, Users, Compass, Video, Heart, MessageCircle, Share2, Music } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'For You', active: true },
    { icon: Users, label: 'Following', active: false },
    { icon: Compass, label: 'Explore', active: false },
    { icon: Video, label: 'LIVE', active: false },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-20 md:w-64 bg-white border-right border-gray-200 overflow-y-auto hidden sm:block">
      <div className="p-2 md:p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 p-3 rounded-md transition-colors ${
                item.active ? 'text-[#fe2c55]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={24} strokeWidth={item.active ? 3 : 2} />
              <span className={`text-lg font-bold hidden md:block`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-top border-gray-100 hidden md:block">
          <p className="text-sm font-semibold text-gray-500 mb-4 px-3">Suggested accounts</p>
          {/* Mock suggested accounts */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 hover:bg-gray-50 cursor-pointer p-2 rounded-md">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm font-bold leading-none">user_{i}</p>
                  <p className="text-xs text-gray-500">User Name {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-top border-gray-100 hidden md:block text-xs text-gray-400 space-y-4 px-3">
          <p>© 2026 TikTok Clone</p>
        </div>
      </div>
    </aside>
  );
}
