'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, User } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from './AuthProvider';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc, increment, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

interface VideoProps {
  video: {
    id: string;
    userId: string;
    authorName: string;
    authorPhoto: string;
    videoUrl: string;
    caption: string;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
  };
}

export default function VideoCard({ video }: VideoProps) {
  const { user, signIn } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likesCount);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0.6 });

  useEffect(() => {
    if (inView) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
    }
  }, [inView]);

  useEffect(() => {
    if (user) {
      const checkLike = async () => {
        const likeRef = doc(db, 'videos', video.id, 'likes', user.uid);
        const likeSnap = await getDoc(likeRef);
        setLiked(likeSnap.exists());
      };
      checkLike();
    }
  }, [user, video.id]);

  const handleLike = async () => {
    if (!user) {
      signIn();
      return;
    }

    const likeRef = doc(db, 'videos', video.id, 'likes', user.uid);
    const videoRefDoc = doc(db, 'videos', video.id);

    try {
      if (liked) {
        await deleteDoc(likeRef);
        await updateDoc(videoRefDoc, { likesCount: increment(-1) });
        setLikes(prev => prev - 1);
        setLiked(false);
      } else {
        await setDoc(likeRef, {
          userId: user.uid,
          videoId: video.id,
          createdAt: new Date(),
        });
        await updateDoc(videoRefDoc, { likesCount: increment(1) });
        setLikes(prev => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `videos/${video.id}`);
    }
  };

  return (
    <div ref={ref} className="flex flex-col items-center justify-center h-[calc(100vh-64px)] snap-start py-4">
      <div className="relative h-full aspect-[9/16] bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          onClick={() => {
            if (videoRef.current?.paused) {
              videoRef.current.play();
            } else {
              videoRef.current?.pause();
            }
          }}
        />

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white">
              {video.authorPhoto ? (
                <Image
                  src={video.authorPhoto}
                  alt={video.authorName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <User size={24} className="text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-sm">@{video.authorName}</p>
            </div>
          </div>
          <p className="text-sm mb-2 line-clamp-2">{video.caption}</p>
          <div className="flex items-center gap-2 text-xs opacity-80">
            <Music size={12} />
            <span>Original sound - {video.authorName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <button 
              onClick={handleLike}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                liked ? 'bg-[#fe2c55] text-white' : 'bg-gray-800/40 text-white hover:bg-gray-800/60'
              }`}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <span className="text-white text-xs font-bold mt-1">{likes}</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="w-12 h-12 bg-gray-800/40 rounded-full flex items-center justify-center text-white hover:bg-gray-800/60 transition-colors">
              <MessageCircle size={24} />
            </button>
            <span className="text-white text-xs font-bold mt-1">{video.commentsCount}</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="w-12 h-12 bg-gray-800/40 rounded-full flex items-center justify-center text-white hover:bg-gray-800/60 transition-colors">
              <Share2 size={24} />
            </button>
            <span className="text-white text-xs font-bold mt-1">{video.sharesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
