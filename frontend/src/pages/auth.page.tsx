import { useState } from "react"
import Login from "../components/login.component";
import Signup from "../components/signup.componenet";

 const AuthPage = () =>
{
    const [view,setView] = useState("signup");
    return(
        <>
        <div>
            {view === "login" && <Login onSwitch={()=>setView("signup")}/>}
                 {view === "signup" && <Signup onSwitch={()=>setView("login")}/>}
        </div>
        </>
    )
}

export default AuthPage;