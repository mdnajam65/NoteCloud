import React, {useRef, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import AlertContext from '../contexts/alert/AlertContext';
const HOST = " http://127.0.0.1:5000";

function Signup() {
  const [hidden, setHidden] = useState(true); // To show or hide password during password change
  const contextForAlert = useContext(AlertContext);
  const {showAlert} = contextForAlert;
  const navigate = useNavigate();
    const formRef = useRef(null);
    const handleOnSubmit = async (e) =>{
      e.preventDefault();
      const pass = formRef.current.password.value;
      const cpass = formRef.current.cpassword.value;
      if(pass !== cpass)
      {
        showAlert("danger", "Password And Confirm Password Not Matching!");
        return;
      } 
      const params = {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({name: formRef.current.name.value, email: formRef.current.email.value, password: formRef.current.password.value})
    }
    const data = await fetch(`${HOST}/api/auth/createuser`,params);
    const parsedData = await data.json();
    if(parsedData.success)
    {
      sessionStorage.setItem("authToken", parsedData.authToken);
      navigate("/");
    }
    else
    {
      showAlert("danger", "This Email Might be Already Taken!");
    }
  }
  // To Show Or Hide Password
  const showHidePass = () =>{
    if(hidden) setHidden(false);
    else setHidden(true);
  }
  return (
    <div style={{cursor: "none"}} className='container my-3'>
      <h2>Signup with NoteCloud to add your notes</h2>
        <form className='my-2' ref={formRef} onSubmit={handleOnSubmit}>
      <div className="mb-3">
        <label htmlFor="text" className="form-label">Name:</label>
        <input type="name" className="form-control" id="name" name="name" required minLength={3} aria-describedby="emailHelp"/>
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address:</label> <span style={{fontSize: "12px"}} className='text-body-secondary'>Provide a working email(Gmail) for password recovery in future.</span>
        <input type="email" className="form-control" id="email" name="email" required aria-describedby="emailHelp"/>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <input autoComplete='true' title='Password Should Atleast Have 6 Characters' type={hidden?`password`:"text"} className="form-control" required minLength={6} name="password" id="password"/>
        <i onClick={showHidePass} className={`fa-solid fa-eye${hidden?"-slash":""}`} style={{color: "#B197FC", cursor: "pointer"}}></i>
      </div>
      <div className="mb-3">
        <label htmlFor="cpassword" className="form-label">Confirm password:</label>
        <input autoComplete='true' type="password" className="form-control" required minLength={5} name="cpassword" id="cpassword"/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
  </form>
    </div>
  )
}

export default Signup