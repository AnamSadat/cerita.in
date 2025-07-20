import FormLogin from '@/components/view/auth/FormLogin';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto">
      <div className="justify-center flex mx-auto">
        <FormLogin />
      </div>
      <p className="text-center">
        Belum punya akun?{' '}
        <Link href={'/register'} className="underline underline-offset-1">
          Register
        </Link>{' '}
        aja
      </p>
    </div>
  );
}
