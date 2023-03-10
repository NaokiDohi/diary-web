import React from 'react'
import Image from 'next/image'

const Avatar = ({ url }: { url: string }) => {
  return (
    <div className='relative h-8 w-8 rounded-full overflow-hidden'>
      <Image
        src={url}
        alt='Avatar Image'
        layout='fill'
        objectFit='contain'
        width={100}
        height={100}
      />
    </div>
  )
}

export default Avatar
