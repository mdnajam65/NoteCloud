import React, { useRef, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AlertContext from '../contexts/alert/AlertContext';
const HOST = " http://127.0.0.1:5000";


function Login() {
    const modalOpenRef = useRef(null);
    const modalCloseRef = useRef(null);
    const [hidden, setHidden] = useState(true); // To show or hide password during password change
    const [recoveryEmail, setRecoveryEmail] = useState(""); // To store recovery email
    const [creds, setCreds] = useState({newPass: "", emailModal: "", confirmNewPass: "", passResetCode: ""}); // To store newPass, confirmNewPass, and resetCode from the modal
    const [timer, setTimer] = useState({minutes:0, seconds:0}); // To run 3 mins Timer
    const contextForAlert = useContext(AlertContext);
    const {showAlert} = contextForAlert;
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    // Function For Forget Password
    const handleForgetPassInput = (e) =>{
        setRecoveryEmail(e.target.value);
    }
    const generatePassResetCode = async () =>{
        const params = {
            method:"PUT",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email: recoveryEmail})
          }
          const data = await fetch(`${HOST}/api/auth/genresetcode`, params);
          const parsedData = await data.json();
        if(parsedData.success)
        {
            setRecoveryEmail("");
            modalOpenRef.current.click();
            document.getElementById("forgetPassSuccessMessage").style.color = "green";
            document.getElementById("forgetPassSuccessMessage").innerHTML = parsedData.message;
            setTimeout(() => {
                document.getElementById("forgetPassSuccessMessage").innerHTML = "";
                }, 5000);
            startTimer(3, 0);
        }
        else
        {
            setRecoveryEmail("");
            document.getElementById("forgetPassStatusSpan").style.color = "red";
            document.getElementById("forgetPassStatusSpan").innerHTML = parsedData.error;
            setTimeout(() => {
            document.getElementById("forgetPassStatusSpan").innerHTML = "";
            }, 5000);
        }
    }
    const handlePassResetModalInputs = (e) =>{
        setCreds({...creds, [e.target.name]: e.target.value});
    }
    const startTimer = (mins, secs) =>{
        setTimer({minutes: mins, seconds: secs});

        let tim = setInterval(() => {
            secs--;
            setTimer({minutes: mins, seconds: secs})
            if(secs===-1)
            {
                secs=59;
                mins--;
                setTimer({minutes: mins, seconds: secs})
                if(mins===-1)
                {
                    clearInterval(tim);
                    setTimer({minutes: 0, seconds: 0});
                }
            }
        }, 1000);
    }
    const resetPassword = async () =>{
        const params = {
            method:"PUT",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email: creds.emailModal, resetCode: creds.passResetCode, newPassword: creds.newPass})
          }
          const data = await fetch(`${HOST}/api/auth/resetpass`, params);
          const parsedData = await data.json();
        if(parsedData.success)
        {
            setCreds({newPass: "", emailModal: "", confirmNewPass: "", passResetCode: ""});
            startTimer(0, 0);
            document.getElementById("resetPassStatusSpan").style.color = "green";
            document.getElementById("resetPassStatusSpan").innerHTML = parsedData.message+"(Modal Will Automatically Close in 3 Seconds)";
            setTimeout(() => {
                document.getElementById("resetPassStatusSpan").innerHTML = "";
                modalCloseRef.current.click();
            }, 3000);
        }
        else
        {
            setCreds({newPass: "", emailModal: "", confirmNewPass: "", passResetCode: ""});
            document.getElementById("resetPassStatusSpan").style.color = "red";
            document.getElementById("resetPassStatusSpan").innerHTML = parsedData.error;
            setTimeout(() => {
                document.getElementById("resetPassStatusSpan").innerHTML = "";
            }, 4000);
        }
    }
    // To Show Or Hide Password
  const showHidePass = () =>{
    if(hidden) setHidden(false);
    else setHidden(true);
  }
    const handleOnSubmit = async (e) =>{
        e.preventDefault();
        const params = {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({email: emailRef.current.value, password: passwordRef.current.value})
        }
        const data = await fetch(` http://127.0.0.1:5000/api/auth/login`,params);
        const parsedData = await data.json();
        if(parsedData.success)
        {
            sessionStorage.setItem("authToken", parsedData.authToken);
            navigate("/");
        }
        else
        {
            showAlert("danger", "Wrong Credentials!");
        }
        
    }
  return (
    <div className='container my-4'>
        <h2>Please Login to Continue</h2>
        <form onSubmit={handleOnSubmit} className='my-2'>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address:</label>
            <input required={true} ref={emailRef} type="email" className="form-control" id="email" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input required={true} minLength={6} title='Password Should Atleast Have 6 Characters' autoComplete='true' ref={passwordRef} type={hidden?`password`:"text"} className="form-control" id="password"/>
            <i onClick={showHidePass} className={`fa-solid fa-eye${hidden?"-slash":""}`} style={{color: "#B197FC", cursor: "pointer"}}></i>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    <div className="forgetPass">
        <p><button className="btn btn-danger btn-sm mt-3" type="button"  data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Forgot Password?</button></p>
        <div className="collapse" id="collapseExample">
        <div className="card card-body" style={{width: "200px"}}>
            <label htmlFor="forgetPassEmail">Enter Email: </label>
            <input type="email" name="forgetPassEmail" value={recoveryEmail} onChange={handleForgetPassInput} id="forgetPassEmail" />
            <span id='forgetPassStatusSpan' ></span>
            <button onClick={generatePassResetCode} className='btn btn-primary btn-sm mt-2'>Generate Reset Code</button>
            <span style={{"color": "red", "fontSize": "13px"}} >*Due to slower server, if you dont receive an email, please generate it multiple times and use the most recent reset code.</span>
        </div>
    </div>
    {/* Code For Modal Starts */}
            {/* <!-- Button trigger modal --> */}
        <button ref={modalOpenRef} onClick={()=>{setCreds({newPass: "", emailModal: "", confirmNewPass: "", passResetCode: ""})}} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal3">
        Launch demo modal
        </button>

        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal3" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel3" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Password Reset</h5>
                <button onClick={()=>{setCreds({newPass: "", emailModal: "", confirmNewPass: "", passResetCode: ""});}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <span id='forgetPassSuccessMessage' ></span>
                <div className='d-flex justify-content-center align-items-center'> 
                        <b style={{fontSize: "350%"}}>{timer.minutes<10?"0"+timer.minutes:timer.minutes}:{timer.seconds<10?"0"+timer.seconds:timer.seconds}</b>
                </div>
                <div className='card card-body mt-4' style={{color: "#88caef"}}>
                <div className='mb-3 d-flex justify-content-between'>
                    <label htmlFor="emailModal"><b>Enter Recovery Email:</b> </label>
                    <input style={{border: "2px solid #B197FC", borderRadius: "5px"}} onChange={handlePassResetModalInputs} value={creds.emailModal} name='emailModal' type="email" id='emailModal'/>
                </div>
                <div className='mb-3 d-flex justify-content-between'>
                    <label htmlFor="passResetCode"><b>Enter Reset Code:</b> </label>
                    <input style={{border: "2px solid #B197FC", borderRadius: "5px"}} onChange={handlePassResetModalInputs} value={creds.passResetCode} name='passResetCode' type="text" id='passResetCode'/>
                </div>
                <div className='mb-3 d-flex justify-content-between'>
                    <label htmlFor="newPass"><b>Enter New Password:</b> </label>
                    <input style={{border: "2px solid #B197FC", borderRadius: "5px"}} onChange={handlePassResetModalInputs} title='Password Should Atleast Have 6 Characters' value={creds.newPass} name='newPass' type="password" id='newPass' />
                </div>
                <div className='mb-3 d-flex justify-content-between'>
                    <label htmlFor="confirmNewPass"><b>Confirm Password:</b></label>
                    <input style={{border: "2px solid #B197FC", borderRadius: "5px"}} onChange={handlePassResetModalInputs} value={creds.confirmNewPass} name='confirmNewPass' type="password" id='confirmNewPass'/>
                </div>
                <span id="resetPassStatusSpan"></span>
                <button disabled={!creds.passResetCode.length || !creds.emailModal.length || creds.newPass.length<6 || creds.confirmNewPass.length<6 || creds.newPass!==creds.confirmNewPass} onClick={resetPassword} className='btn btn-warning'>Reset Password</button>
                </div>
            </div>
            <div className="modal-footer">
                <button ref={modalCloseRef} onClick={()=>{setCreds({newPass: "", emailModal: "", confirmNewPass: "", passResetCode: ""});}} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>
    {/* Code For Modal Ends */}
    </div>
    </div>
  )
}

export default Login