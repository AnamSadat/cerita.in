'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { deleteLikes, fetchLike } from '@/lib/features/likeSlice';
import { Heart, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { fetchStory, setStoryDetail } from '@/lib/features/storySlice';
import { StoryFromDB } from '@/types/story';

export default function LikeButton({ storyId }: { storyId: number }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const { loading } = useAppSelector((state) => state.like);

  const likes = useAppSelector((state) => state.story.detail?.likes ?? []);
  const likesCount = useAppSelector(
    (state) => state.story.detail?._count?.likes ?? 0
  );

  const likedByUser = likes.some((like) => like.user_id === Number(userId));
  const currentLike = likes.find((like) => like.user_id === Number(userId));

  // 🧠 Local state for better UX
  const [isLiked, setIsLiked] = useState<boolean>(likedByUser);
  const [localCount, setLocalCount] = useState<number>(likesCount);
  const [likeId, setLikeId] = useState<number | null>(currentLike?.id ?? null);
  console.log('🚀 ~ LikeButton ~ likeId diluar handleLike:', likeId);

  // 💡 Handle like/unlike
  const handleLike = () => {
    if (!session) {
      toast('Silakan login terlebih dahulu', {
        icon: <Info className="text-blue-500" />,
      });
      router.push('/login');
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLocalCount((prev) => (nextState ? prev + 1 : prev - 1));

    if (nextState) {
      console.log('Berhasil tambahkan: ', likeId);
      dispatch(fetchLike(storyId)).then(() => {
        dispatch(fetchStory()).then((res) => {
          if ('payload' in res && Array.isArray(res.payload)) {
            const stories = res.payload as StoryFromDB[];
            const updated = stories.find((story) => story.id === storyId);
            if (updated) {
              dispatch(setStoryDetail(updated));
            }
          }
        });
      });
    } else {
      if (likeId) {
        console.log('Berhasil dihapus: ', likeId);
        dispatch(deleteLikes({ storyId, likeId })).then(() => {
          dispatch(fetchStory()).then((res) => {
            if ('payload' in res && Array.isArray(res.payload)) {
              const stories = res.payload as StoryFromDB[]; // ✅ kasih tahu TypeScript
              const updated = stories.find((story) => story.id === storyId);
              if (updated) {
                dispatch(setStoryDetail(updated));
              }
            }
          });
        });
      } else {
        console.warn('❗Like ID tidak ditemukan untuk user ini');
      }
    }
  };

  // 🔄 Update local like status when redux changes
  useEffect(() => {
    setIsLiked(likedByUser);
    setLikeId(currentLike?.id ?? null);
  }, [likedByUser, currentLike]);

  useEffect(() => {
    setLocalCount(likesCount);
  }, [likesCount]);

  return (
    <motion.button
      onClick={handleLike}
      whileTap={{ scale: 1.3 }}
      className="flex items-center py-2 px-2 cursor-pointer gap-2 text-sm font-medium text-white/80 hover:text-white transition rounded-md hover:bg-neutral-800"
      disabled={loading}
    >
      <motion.div
        key={isLiked ? 'liked' : 'unliked'}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        <Heart
          className="w-5 h-5"
          fill={isLiked ? 'red' : 'none'}
          stroke={isLiked ? 'red' : 'white'}
        />
      </motion.div>
      <span>
        {localCount} Suka ({isLiked ? 'Kamu menyukai ini' : 'Belum kamu sukai'})
      </span>
    </motion.button>
  );
}
