'use client';

import React, { useState } from 'react';
import { Search, Plus, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import Image from 'next/image';

export default function Header({ onUploadClick }: { onUploadClick: () => void }) {
  const { user, signIn, logout } = useAuth();
  const [search, setSearch] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-bottom border-gray-200 z-50 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="text-xl font-bold hidden md:block">TikTok</span>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search accounts and videos"
            className="w-full bg-gray-100 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onUploadClick}
          className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-sm hover:bg-gray-50 transition-colors font-semibold"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
              )}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={signIn}
            className="bg-[#fe2c55] text-white px-6 py-1.5 rounded-sm font-semibold hover:bg-[#ef2950] transition-colors"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}
