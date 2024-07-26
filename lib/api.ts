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
