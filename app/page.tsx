'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoFeed from '@/components/VideoFeed';
import UploadModal from '@/components/UploadModal';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp, limit, query } from 'firebase/firestore';

function TikTokApp() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { user, loading: authLoading } = useAuth();

  // Seed initial data if empty
  useEffect(() => {
    const seedData = async () => {
      if (authLoading || !user) return;
      
      // Only the admin should seed the initial data
      if (user.email !== 'hoangnnse183499@fpt.edu.vn') return;

      const q = query(collection(db, 'videos'), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const initialVideos = [
          {
            userId: user.uid, // Use admin's UID
            authorName: 'tiktok_official',
            authorPhoto: 'https://picsum.photos/seed/tiktok/200/200',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-40030-large.mp4',
            caption: 'Welcome to TikTok Clone! 🚀 #tiktok #clone #nextjs',
            likesCount: 1250,
            commentsCount: 45,
            sharesCount: 12,
            createdAt: serverTimestamp(),
          },
          {
            userId: user.uid, // Use admin's UID
            authorName: 'nature_vibes',
            authorPhoto: 'https://picsum.photos/seed/nature/200/200',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
            caption: 'Peaceful moments in nature 🌿✨ #nature #peace #vibes',
            likesCount: 850,
            commentsCount: 22,
            sharesCount: 5,
            createdAt: serverTimestamp(),
          }
        ];

        for (const video of initialVideos) {
          try {
            await addDoc(collection(db, 'videos'), video);
          } catch (error) {
            console.error('Error seeding data:', error);
          }
        }
      }
    };

    seedData();
  }, [user, authLoading]);

  return (
    <div className="min-h-screen bg-white">
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <div className="flex pt-16 max-w-[1100px] mx-auto">
        <Sidebar />
        
        <main className="flex-1 sm:ml-20 md:ml-64 h-[calc(100vh-64px)] overflow-hidden">
          <VideoFeed />
        </main>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <TikTokApp />
    </AuthProvider>
  );
}
