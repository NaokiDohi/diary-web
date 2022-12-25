import Image from 'next/image'
import { useRouter } from 'next/router'

const Logo = () => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push('/')}
      className='block h-8 w-32 relative scale-150'
    >
      <Image
        layout='fill'
        src='/logo.png'
        alt='Your Company'
        objectFit='contain'
        priority
      />
    </div>
  )
}

export default Logo
