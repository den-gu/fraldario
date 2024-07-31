import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export const deleteCookie = () => {
    const cookieStore = cookies();
    cookieStore.delete('session');
    return NextResponse.json({
                message: "Logout successful",
        //         // user: data,
        });
}