import { NextResponse } from 'next/server'
import { useToast } from "@/components/ui/use-toast"

interface ILoginData {
    username: string,
    password: string
}

export const initiateSession = async (data: ILoginData) => {
    try {
        const response = await fetch('https://fraldario.netlify.app/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data) // Passando os dados no corpo da solicitação
        });

        if (!response.ok) {
            console.log(await response.json())
            // throw new Error("Can't find this account.");
            return NextResponse.json({
                error: "Erro: Verifique os dados e tente novamente.",
            }, { status: 401 });
        }

            const result = await response.json();
            console.log(result); // Exibe a resposta no console

            return NextResponse.json({
                result
            })

    } catch (error: any) {
        console.error(error.message); // Exibe o erro no console
    }
};


export const endSession = async () => {
    fetch("https://fraldario.netlify.app/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to logout");
        return res.json();
      });
}


export const getStudents = async (values: any) => {
    try{
        const response = await fetch("https://fraldario.netlify.app/student/all", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
    })
        const { data } = await response.json();

        return NextResponse.json({
            data
        })
    } catch(error: any) {
        console.log(error)
    }
}

export const addStudent = async (data: any) => {
    fetch("https://fraldario.netlify.app/student/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to add student");
        return res.json();
      });
}


// Função para deletar um estudante
export const deleteStudent = async (studentId: any) => {
    console.log(studentId)
    fetch(`https://fraldario.netlify.app/student/${studentId}`, {
        method: "DELETE",
        body: JSON.stringify(studentId),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete student");
        return res.json();
      });
  }

  
export const sendReport = async (data: any) => {
    fetch("https://fraldario.netlify.app/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
      });
}
