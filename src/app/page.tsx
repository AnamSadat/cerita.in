import { BackgroundBeams } from '@/components/ui/background-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

export default function Home() {

  const word = 'Berbagi cerita di Cerita.in akan sangat mengasyikan'

  return (
    <div className="h-[42rem] mx-2 my-2  rounded-2xl bg-neutral-950 relative flex items-center justify-center antialiased">
      <div className='flex justify-center items-center' >
        <div className='text-white'>
          <TextGenerateEffect words={word}/>
        </div>
      </div>
      <BackgroundBeams/>
    </div>
  )

}