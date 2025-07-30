'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { fetchLike } from '@/lib/features/likeSlice';
import { Heart, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function LikeButton({ storyId }: { storyId: number }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.like);
  const likesCount = useAppSelector(
    (state) => state.story.detail?._count?.likes ?? 0
  );
  const likedByUser = useAppSelector((state) =>
    state.story.detail?.likes?.some(
      (like: { user_id: number }) => like.user_id === Number(userId)
    )
  );

  const [isLiked, setIsLiked] = useState(likedByUser ?? false);
  const [localCount, setLocalCount] = useState(likesCount);

  const handleLike = () => {
    if (!session) {
      toast('Silakan login terlebih dahulu', {
        icon: <Info className="text-blue-500" />,
        // className: 'justify-center',
      });
      router.push('/login');
      return;
    }

    // Optimistic update (langsung ubah tampilan sebelum respon server)
    const nextLikeState = !isLiked;
    setIsLiked(nextLikeState);
    setLocalCount((prev) => (nextLikeState ? prev + 1 : prev - 1));

    dispatch(fetchLike(storyId));
  };

  useEffect(() => {
    setIsLiked(likedByUser ?? false);
  }, [likedByUser]);

  useEffect(() => {
    setLocalCount(likesCount);
  }, [likesCount]);

  return (
    <motion.button
      onClick={handleLike}
      whileTap={{ scale: 1.3 }}
      className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition"
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
