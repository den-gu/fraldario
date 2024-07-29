import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { permanentRedirect } from 'next/navigation'

export async function POST(req: Request) {

    async function checkPassword(inputPassword: string, storedHashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, storedHashedPassword);
    }

    const supabase = createClient();
    const { username, password } = await req.json();

    console.log("Received data:", { username, password });

    // Verifica se o usuário existe no banco de dados
    const { data, error } = await supabase
        .from("users")
        .select('username, email, password, permissionLevel')
        .eq("username", username)
        .single(); // Assume que o nome de usuário é único

    if (error || !data) {
        return NextResponse.json({
            error: "User not found or incorrect password",
        }, { status: 404 });
    } else {
        console.log("The username exists")

        // Aqui você deve verificar a senha, supondo que ela esteja armazenada em um formato seguro (como hash)
    // Verifica a senha fornecida com a senha armazenada (hashed)
    const isPasswordValid = await checkPassword(password, data.password);

    if (!isPasswordValid) {
        return NextResponse.json({
            error: "Incorrect password",
        }, { status: 401 });
    } else {

        // Se você usar cookies ou tokens para sessão, pode configurá-los aqui
        const cookieStore = cookies();
        cookieStore.set("session", "token");

        // return NextResponse.json({
        //     message: "Login successful",
        //     user: data,
        // });

        // Autenticação bem-sucedida
        // Redireciona para a página inicial
        return permanentRedirect("/home") // Navigate to the new user profile
        // return NextResponse.redirect(new URL('/home/', req.url));
        
    }
    }
}
