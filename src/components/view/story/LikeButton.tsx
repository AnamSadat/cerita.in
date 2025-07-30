'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { deleteLikes, fetchLike } from '@/lib/features/likeSlice';
import { setStoryDetail } from '@/lib/features/storySlice';
import { Heart, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LikeButton({ storyId }: { storyId: number }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const { loading } = useAppSelector((state) => state.like);
  const storyDetail = useAppSelector((state) => state.story.detail);
  const likes = storyDetail?.likes ?? [];
  const likesCount = storyDetail?._count?.likes ?? 0;

  const likedByUser = likes.some((like) => like.user_id === Number(userId));
  const currentLike = likes.find((like) => like.user_id === Number(userId));

  const [isLiked, setIsLiked] = useState(likedByUser);
  const [likeId, setLikeId] = useState<number | null>(currentLike?.id ?? null);
  const [localCount, setLocalCount] = useState(likesCount);

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
      // LIKE
      dispatch(fetchLike(storyId)).then((res) => {
        const newLike = res.payload;
        if (!newLike) return;
        if (
          typeof newLike !== 'object' ||
          newLike === null ||
          !('id' in newLike)
        ) {
          console.warn('Gagal mendapatkan data Like');
          return;
        }

        setLikeId(newLike.id);

        // 🔄 Update Redux manual
        dispatch(
          setStoryDetail({
            ...storyDetail!,
            likes: [...likes, newLike],
            _count: {
              ...storyDetail!._count,
              likes: likesCount + 1,
            },
          })
        );
      });
    } else {
      // UNLIKE
      if (!likeId) {
        console.warn('❗ Like ID tidak ditemukan');
        return;
      }

      dispatch(deleteLikes({ storyId, likeId })).then(() => {
        setLikeId(null);

        // 🔄 Hapus like user dari Redux manual
        const filteredLikes = likes.filter((like) => like.id !== likeId);

        dispatch(
          setStoryDetail({
            ...storyDetail!,
            likes: filteredLikes,
            _count: {
              ...storyDetail!._count,
              likes: likesCount - 1,
            },
          })
        );
      });
    }
  };

  // Sinkronisasi state lokal dengan Redux saat detail berubah
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
