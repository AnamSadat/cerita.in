import { BackgroundBeams } from '@/components/ui/background-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { FlipWords } from '@/components/ui/flip-words'

export default function Home() {

  const words = [
    'hidup', 'cinta', 'perjuangan', 'keberanian'
  ]
  // const flipWords = <FlipWords words={wordsFlip}/>
  // const word = `Tiap hari adalah halaman baru dari ${flipWords} yang layak ditulis.`

  return (
    <div className="h-[42rem] mx-2 my-2  rounded-2xl bg-neutral-950 relative flex items-center justify-center antialiased">
      <div className='container justify-center items-center' >
        <div className='text-center max-w-4xl mx-auto'>
          <div className='text-white font-bold text-6xl mb-10'>
          Tiap hari adalah halaman baru dari
            <FlipWords words={words} className=''/> <br />
          yang layak ditulis.
          </div>
          <div >
            <TextGenerateEffect words="Tidak ada kisah yang terlalu biasa. Di cerita.in, kamu bisa berbagi pengalaman hidup tanpa rasa takut, dan menemukan orang-orang yang pernah merasakan hal yang sama." />
          </div>
          <div>
          </div>
        </div>
      </div>
      <BackgroundBeams/>
    </div>
  )

}