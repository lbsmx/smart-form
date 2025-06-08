import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

// 全局登录校验

const protectedRoutes = ['/home/my-forms', '/form/'];
export async function middleware(request: NextRequest) {
    const session = await auth();
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
