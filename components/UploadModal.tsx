'use client';

import React, { useState, useCallback } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from './AuthProvider';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, we'd upload to Firebase Storage.
    // For this demo, we'll use a placeholder video URL if they drop a file.
    const file = acceptedFiles[0];
    if (file) {
      // Simulate upload
      setUploading(true);
      setTimeout(() => {
        // Using a reliable sample video URL
        setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-40030-large.mp4');
        setUploading(false);
      }, 1500);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!user || !videoUrl) return;

    setUploading(true);
    try {
      await addDoc(collection(db, 'videos'), {
        userId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        videoUrl: videoUrl,
        caption: caption,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        createdAt: serverTimestamp(),
      });
      onClose();
      setCaption('');
      setVideoUrl(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'videos');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-bottom border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">Upload video</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {!videoUrl ? (
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg h-96 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#fe2c55] bg-gray-50' : 'border-gray-300 hover:border-[#fe2c55]'
                }`}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <Loader2 className="animate-spin text-[#fe2c55]" size={48} />
                ) : (
                  <>
                    <Upload size={48} className="text-gray-400 mb-4" />
                    <p className="text-lg font-bold">Select video to upload</p>
                    <p className="text-sm text-gray-500 mt-2">Or drag and drop a file</p>
                    <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
                      <p>MP4 or WebM</p>
                      <p>720x1280 resolution or higher</p>
                      <p>Up to 10 minutes</p>
                      <p>Less than 2 GB</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative h-96 bg-black rounded-lg overflow-hidden">
                <video src={videoUrl} className="w-full h-full object-contain" controls />
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Caption</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 h-32 resize-none"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="flex gap-4 mt-auto">
              <button 
                onClick={onClose}
                className="flex-1 border border-gray-300 py-2 rounded-sm font-bold hover:bg-gray-50"
              >
                Discard
              </button>
              <button 
                onClick={handleUpload}
                disabled={!videoUrl || uploading}
                className="flex-1 bg-[#fe2c55] text-white py-2 rounded-sm font-bold disabled:opacity-50 hover:bg-[#ef2950]"
              >
                {uploading ? 'Uploading...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
