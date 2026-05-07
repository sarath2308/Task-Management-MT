import { useGetDemoData, type IDemoDataType } from "../hook/demo.get.hook"

export function DemoComponent()
{
    const {data,isLoading} = useGetDemoData()
    const tableData: IDemoDataType[] = data ?? [];
    console.log(tableData);
 
   return(
    <>
    <div>
        data fetch
        </div></>
   )
}