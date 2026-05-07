import { useQuery } from "@tanstack/react-query"
import { DEMO_API } from "../api/demo.api"

export interface IDemoDataType
{
    id: string;
    name: string;
    company: string;
    username: string;
    email: string;
    address: string;
    zip: string;
    state: string;
    country: string;
    phone: string;
    
}
export const useGetDemoData = () =>{
    return useQuery({
        queryKey:["get-demo-data"],
        queryFn: async()=>
            {
                const result = await DEMO_API.GET_DEMO_DATA();
                console.log("result of fetch");
                console.log(result)
            }
    })
}