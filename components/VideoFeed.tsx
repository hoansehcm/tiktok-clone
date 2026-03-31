'use client';

import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import VideoCard from './VideoCard';
import { Loader2 } from 'lucide-react';

export default function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videoData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'videos');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#fe2c55]" size={48} />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p className="text-xl font-bold mb-2">No videos yet</p>
        <p>Be the first to upload a video!</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
