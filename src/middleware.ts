import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userAgent } from 'next/server'

const defaultDeviceType = 'desktop'

export function middleware(request: NextRequest) {
  const { device } = userAgent({ headers: request.headers })

  // Set a custom header with the device type. This is what Server Components will read.
  const response = NextResponse.next() // Or NextResponse.rewrite() if you were modifying the URL
  response.headers.set('x-device-type', device.type || defaultDeviceType)

  return response
}
