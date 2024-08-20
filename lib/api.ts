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
    fetch("api/user", {
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


// Students
export const getStudents = async () => {
    try{
        const response = await fetch("api/student", {
            method: "GET",
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


// export const allStudents = async (values?: any) => {
//     try{
//         const response = await fetch("api/student/all", {
//             method: "POST",
//             body: JSON.stringify(values),
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             }
//     })
//         const { data } = await response.json();

//         return NextResponse.json({
//             data
//         })
//     } catch(error: any) {
//         console.log(error)
//     }
// }

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

  
// Reports
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

export const getReports = async () => {
    try{
        const response = await fetch("api/report", {
            method: "POST",
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

export const saveReport = async (data: any) => {
    fetch("api/report", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to save message");
        return res.json();
      });
}



// Meals

export const getMeals = async () => {
    try{
        const response = await fetch("api/meal", {
            method: "GET",
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

export const addMeal = async (data: any) => {
    fetch("api/meal/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to add meal");
        return res.json();
      });
}
