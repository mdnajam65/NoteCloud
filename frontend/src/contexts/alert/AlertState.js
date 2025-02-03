import { useState } from "react";
import AlertContext from "./AlertContext";

const AlertState = (props)=>{
    const [alert, setAlert] = useState({type: null, message: null});
    const showAlert = (type, message) =>{
        setAlert({type, message});
        setTimeout(() => {
            setAlert({type: null, message: null});
        }, 1500);
    }
    return (
        <AlertContext.Provider value={{showAlert, alert}} >
            {props.children}
        </AlertContext.Provider>
    )
}
export default AlertState;