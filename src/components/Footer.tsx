import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 pb-30 pt-5 px-15 mx-2 my-2 rounded-2xl">
      <div className=''>
        <div>
          <Image
            src={'/logo-white.png'}
            alt="saya"
            width={150}
            height={0}
          />
        </div>
        <div>

        </div>
        <div>

        </div>
      </div>
    </footer>
  )
}