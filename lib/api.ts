import { useToast } from "@/components/ui/use-toast"

interface ILoginData {
    username: string,
    password: string
}

export const ShowToast = async () => {
  const { toast } = useToast();
            toast({
              title: "You submitted the following values:",
              description: "You submitted the following values",
  })
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

        // Se a resposta for bem-sucedida
        // const result = await response.json();
        // console.log(result); // Exibe a resposta no console
        // return result;

    } catch (error: any) {
        console.error(error.message); // Exibe o erro no console
    }
};


export const getStudents = async () => {
    fetch("api/student/", {
        method: "GET",
        // body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to add student");
        return res.json();
      });
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
