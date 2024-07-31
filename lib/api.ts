import { NextResponse } from 'next/server'
import { useToast } from "@/components/ui/use-toast"

interface ILoginData {
    username: string,
    password: string
}

export const initiateSession = async (data: ILoginData) => {
    try {
        const response = await fetch('api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data) // Passando os dados no corpo da solicitação
        });

        // if (!response.ok) {
        //     console.log(await response.json())
        //     throw new Error("Can't find this account.");
        // }
        const result = await response.json();
        console.log(result); // Exibe a resposta no console

        return NextResponse.json({
            result
        })

        // Se a resposta for bem-sucedida
        // const result = await response.json();
        // console.log(result); // Exibe a resposta no console
        // return result;

    } catch (error: any) {
        console.error(error.message); // Exibe o erro no console
    }
};


export const endSession = async () => {
    fetch("api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
      });
}


export const getStudents = async () => {
    const response = await fetch("api/student/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    // .then(async (res) => {
        // if (!res.ok) throw new Error("Failed to add student");
        const data = await response.json();
        return {
            props: { data },
            revalidate: 10, // Revalida a cada 10 segundos
        }
    //   });
}

export const addStudent = async (data: any) => {
    fetch("api/student/", {
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
    fetch(`api/student/${studentId}`, {
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
    fetch("api/", {
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
