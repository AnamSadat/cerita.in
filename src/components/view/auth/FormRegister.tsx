'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchemaRegister, registerSchema } from '@/types/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { postUser } from '@/lib/prisma/apiPrisma';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function FormRegister() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaRegister>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: formSchemaRegister) => {
    setErrorMessage('');
    setIsLoading(true);

    console.log('Login submitted:', data);

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      setErrorMessage('Password tidak cocok');
      return;
    }

    const result = await postUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);
    console.log('Regist berhasil', result);
    toast.success('Success to register!');
    router.push('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const { name, value } = e.target;
    form.setValue(name as 'password' | 'confirmPassword', value);
  };

  return (
    <div className="max-w-sm min-w-sm">
      <div>
        <h1 className="text-4xl font-bold mb-5">REGISTER</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="name" placeholder="Jhon Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    onChange={(e) => {
                      handleChange(e);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    onChange={(e) => {
                      handleChange(e);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
          <Button
            type="submit"
            className="w-full cursor-pointer hover:bg-neutral-800"
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
              'Register'
            )}
          </Button>
        </form>
      </Form>
      <p className="text-center">
        Sudah punya akun?{' '}
        <Link href={'/login'} className="underline underline-offset-1">
          Login
        </Link>{' '}
        aja
      </p>
    </div>
  );
}
