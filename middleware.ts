import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

// 全局登录校验
export function middleware(request: NextRequest) {
    const userid = request.cookies.get('userid')?.value;

    if (!userid) {
        const newUserId = uuid();

        const response = NextResponse.next();
        response.cookies.set('userid', newUserId, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
