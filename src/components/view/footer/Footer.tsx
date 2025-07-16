import Image from 'next/image';

// TODO: Footer cant be working
export default function Footer() {
  return (
    <footer className="bg-zinc-900 px-8 py-12 mx-2 my-2 rounded-2xl text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo, Description & Social */}
        <div className="flex flex-col space-y-4">
          <Image
            src="/logo-white.png"
            alt="Logo"
            width={150}
            height={50}
          />
          <p className="text-gray-400 text-sm">
        Kami menyediakan layanan terbaik untuk kebutuhan Anda. Terima kasih telah bersama kami.
          </p>
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500">Facebook</a>
              <a href="#" className="hover:text-pink-500">Instagram</a>
              <a href="#" className="hover:text-sky-400">Twitter</a>
              <a href="#" className="hover:text-red-500">YouTube</a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Tautan</h3>
          <div className="flex flex-col space-y-2">
            <a href="#" className="hover:text-gray-300">Tentang Kami</a>
            <a href="#" className="hover:text-gray-300">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-gray-300">Kebijakan Privasi</a>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Kontak</h3>
          <p className="text-gray-400 text-sm">Email: info@example.com</p>
          <p className="text-gray-400 text-sm">Telepon: +62 812 3456 7890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
    &copy; {new Date().getFullYear()} Anam Sadat. All rights reserved.
      </div>
    </footer>

  )
}