import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const request = await fetch(
      'http://localhost:3000/api/user/checkAuthStatus',
      {
        method: 'POST',
        body: JSON.stringify({ token: req.cookies.get('token') }),
        headers: { 'content-type': 'application/json' },
      }
    )
    const response = await request.json()
    // console.log('response\n', response)
    if (response.error) {
      console.log('Error', response.error)
      return NextResponse.redirect(new URL('/login', req.url))
    }
    const res = NextResponse.next()
    res.cookies.set('uid', response.success.uid)
    return res
  }
}
