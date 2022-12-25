import Head from 'next/head'
import NavBar from '../components/NavBar'

type Props = {
  children: React.ReactNode
}

const GuestLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className='w-full h-full'>
      <Head>
        <link rel='icon' href='./logo.png' />
      </Head>
      <NavBar />
      <div className='p-6'>{children}</div>
    </div>
  )
}

export default GuestLayout
