import Head from 'next/head'
import dynamic from 'next/dynamic'
const NavBar = dynamic(() => import('../components/NavBar'))

type Props = {
  children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className='min-h-full'>
        <Head>
          <link ref={`icon`} href='./logo.png'></link>
        </Head>
        <NavBar />
        <header className='bg-white shadow'>
          <div className='mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              Daily
            </h1>
          </div>
        </header>
        <main>
          <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}

export default AuthLayout
