import api from "./api";

export const TASK_API = {
    CREATE:(payload:{title: string, description: string}) => api.post("/task",payload).then((res)=>res.data),
    UPDATE:(taskId: string,payload:{ title?:string, description?: string})=> api.patch(`/task/${taskId}`,payload).then((res)=>res.data),
    REMOVE:(taskId: string) => api.delete(`/task/${taskId}`).then((res)=>res.data),
    GET_ALL:()=> api.get("/task").then((res)=>res.data),
    GET_STATISTICS: () => api.get("/task/statistics").then((res)=>res.data),
    TOGGLE_STATUS: (taskId:string) => api.patch(`/task/status/${taskId}`).then((res)=>res.data),
}