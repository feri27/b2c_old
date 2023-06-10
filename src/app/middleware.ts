import Cookies from 'js-cookie';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = Cookies.get('accessToken');

  console.log(request.url);
  return NextResponse.next();
}
