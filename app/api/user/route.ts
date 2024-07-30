import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {

    async function checkPassword(inputPassword: string, storedHashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, storedHashedPassword);
    }

    const supabase = createClient();
    const { username, password } = await req.json();

    // console.log("Received data:", { username, password });

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
    // Verifica a senha, armazenada em um formato seguro (como hash)
    // Verifica a senha fornecida com a senha armazenada (hashed)
    const isPasswordValid = await checkPassword(password, data.password);

    if (!isPasswordValid) {
        return NextResponse.json({
            error: "Incorrect password",
        }, { status: 401 });
    } else {


        const token = data.username === 'admin' ? 'token-fraldario-admin' : 'token-fraldario-user'
        // const permissionLevel = data.username === 'admin' ? 'admin' : 'user'

        // Se você usar cookies ou tokens para sessão, pode configurá-los aqui
        const cookieStore = cookies();
        cookieStore.set('session', token, {
        httpOnly: true, // O cookie não pode ser acessado via JavaScript no cliente
        secure: process.env.NODE_ENV === 'production', // Apenas cookies HTTPS em produção
        maxAge: 60 * 60 * 24, // 1 dia
        path: '/', // O cookie está disponível em toda a aplicação
      });

// if (response.ok) {
        // Login bem-sucedido, redirecionar para a página inicial
    //   }'
        return NextResponse.json({
            message: "Login successful",
            user: data,
        });
        

        
    }
    }
}
