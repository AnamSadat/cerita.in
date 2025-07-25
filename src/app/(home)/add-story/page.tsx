'use client';

import FormAddStory from '@/components/view/add-story/FormAddStory';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AddStory() {
  const { data: session, status } = useSession();
  console.log('🚀 ~ AddStory ~ session:', session);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Jangan render apa-apa, biarkan useEffect handle redirect
  }
  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto">
      <div className="justify-center flex mx-auto">
        <FormAddStory />
      </div>
    </div>
  );
}
