import { useQuery } from "@tanstack/react-query"
import { AUTH_API } from "../../api/auth.api"

export const useGetUser = ()=>
{
   return useQuery({
    queryKey:["get-user"],
    queryFn: AUTH_API.GET_USER,
   })
}