import { NextResponse } from 'next/server'
import { toast } from 'sonner';

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



 
// Message
export const sendMessage = async (data: any) => {
    fetch("api/mail/all", {
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
export const deleteStudent = async (studentId: any, name: string | undefined) => {
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
        toast('Sucesso', {
            description: `${name} foi removido(a).`,
            duration: 12000,
            cancel: {
              label: 'Fechar',
              onClick: () => console.log('Cancel!'),
            },
          })
        return res.json();
      });
}

// Função para deletar um estudante
export const editStudent = async (studentId: any) => {
    console.log(studentId)
    fetch(`api/student/${studentId}`, {
        method: "PUT",
        body: JSON.stringify(studentId),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to update info");
        toast('Sucesso', {
            description: `A informação foi actualizada.`,
            duration: 12000,
            cancel: {
              label: 'Fechar',
              onClick: () => console.log('Cancel!'),
            },
          })
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

export const sendReports = async (data: any) => {
    fetch("api/mail", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to send messages");
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
        if (!res.ok) throw new Error("Failed to save report");
        return res.json();
      });
}

export const updateReport = async (data: any) => {
    fetch("api/report", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to update report");
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
