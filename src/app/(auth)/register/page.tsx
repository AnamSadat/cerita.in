import FormRegister from '@/components/view/auth/FormRegister';

export default function Register() {
  return (
    <div className="min-h-screen flex px-5 mx-auto">
      <div className="w-2/5 flex items-center justify-center">
        <FormRegister />
      </div>
      <div className="w-3/5 bg-[url('/gurun.jpg')] bg-cover bg-center flex items-center justify-center m-3 rounded-2xl"></div>
    </div>
  );
}
