'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import {
  getProfileByUsername,
  postProfile,
  putProfile,
} from '@/lib/prisma/apiPrisma';
import {
  // FormTypeProfile,
  // profileToFormData,
  type ProfileType,
  // profileSchemaInput,
  // profileUpdateSchemaInput,
} from '@/types/profile';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderOne } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Contact, Mail, Pencil } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const username = session?.user?.username;
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, isSetLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [fullName, setFullName] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  // const [avatarUrl, setAvatarUrl] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch profile saat halaman dimuat
  useEffect(() => {
    console.log('🚀 ~ ProfilePage ~ username:', username);
    if (!username) return;

    getProfileByUsername(username)
      .then((data) => {
        console.log('✅ PROFILE FROM API', data);
        // const data = res.data;
        setProfile(data);
        setFullName(data.name ?? '');
        setBio(data.bio ?? '');
        // setAvatarUrl(data.avatar_url ?? '');
        setGender(
          ['Male', 'Female', 'Other'].includes(data.gender)
            ? (data.gender as 'Male' | 'Female' | 'Other')
            : 'Male'
        );
      })
      .catch((err) => {
        // Cek apakah memang error karena profile belum dibuat
        if (err.message?.toLowerCase().includes('not found')) {
          setProfile(null);
        } else {
          toast.error('Gagal memuat profil');
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [username]);

  const handleSave = async () => {
    isSetLoading(true);
    setIsOpen(true);

    if (!fullName || fullName.length < 3) {
      toast.error('Nama minimal 3 karakter');
      isSetLoading(false);
      return;
    }

    const formData = {
      name: fullName,
      bio: bio,
      gender: gender,
      file: selectedFile ?? undefined,
    };

    try {
      if (profile && profile.userId === Number(session?.user?.id)) {
        await putProfile(formData);
        toast.success('Profil berhasil diperbarui');
        setIsOpen(false);
      } else {
        await postProfile(formData);
        toast.success('Profil berhasil dibuat');
        setIsOpen(false);
      }

      if (username) {
        const updated = await getProfileByUsername(username);
        setProfile(updated);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Gagal menyimpan profil');
      isSetLoading(false);
    } finally {
      isSetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-4xl font-bold text-white mb-10">Profile</h1>
        <div className="max-w-4xl mx-auto mt-10">
          <div className="flex items-center justify-center mt-20">
            <LoaderOne />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-white mb-10">Profile</h1>
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-border">
          <Image
            src={
              profile?.avatar_url && profile.avatar_url.trim() !== ''
                ? profile.avatar_url
                : session?.user?.image && session.user.image.trim() !== ''
                ? session.user.image
                : '/luffy.jpg'
            }
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">@{username}</h1>
          <Badge>{profile?.gender ?? '-'}</Badge>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8 border border-neutral-800 bg-neutral-900 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-2">Bio</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 hover:bg-neutral-300 cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit Profil
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-0 max-h-[630px] overflow-y-auto scroll-hidden">
              <DialogHeader>
                <DialogTitle>Edit Profil</DialogTitle>
                <DialogDescription>
                  Perbarui semua informasi profil kamu.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 mt-2">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Nama Lengkap
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Bio
                  </label>
                  <Textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Jenis Kelamin
                  </label>
                  <Select
                    value={gender}
                    onValueChange={(value) =>
                      setGender(value as 'Male' | 'Female' | 'Other')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Jenis Kelamin</SelectLabel>
                        <SelectItem value="Male">Laki-laki</SelectItem>
                        <SelectItem value="Female">Perempuan</SelectItem>
                        <SelectItem value="Other">Lainnya</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Gambar Profil
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                  }}
                />
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button className="cursor-pointer bg-red-500 hover:bg-red-600">
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  className="cursor-pointer bg-neutral-700 hover:bg-neutral-800"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-muted-foreground whitespace-pre-line">
          {profile?.bio || 'Belum ada bio.'}
        </p>
      </div>

      {/* Info Lainnya */}
      {/* TODO */}
      <div className="border border-neutral-800 bg-neutral-900 rounded-xl p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Informasi Tambahan</h2>
        <ul className="text-muted-foreground space-y-1">
          <li className="flex items-center">
            <Contact size={14} /> &nbsp; Nama Lengkap: {profile?.name ?? '-'}
          </li>
          <li className="flex items-center">
            <Mail size={14} />
            &nbsp; Email: {session?.user?.email ?? '-'}
          </li>
          <li className="flex items-center">
            <CalendarClock size={14} />
            &nbsp; Bergabung sejak:{' '}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                })
              : '-'}
          </li>
        </ul>
      </div>
    </div>
  );
}
