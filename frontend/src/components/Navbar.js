import React, { useState, useContext, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NoteContext from '../contexts/notes/NoteContext';
const HOST = "https://note-cloud-api.vercel.app";

const Navbar = () => {
  const modalButtonRef = useRef(null);
  const modalCloseRef = useRef(null);
  const [cred, setCred] = useState({currentPass: "", newPass: "", newPassConf: ""});
  const [hidden, setHidden] = useState(true); // To show or hide password during password change
  const context = useContext(NoteContext);
  const {userDetails, totalNotes} = context;
  const loc = useLocation();
  const navigate = useNavigate();
  const handleLogout = () =>{
      modalCloseRef.current.click();
      sessionStorage.removeItem("authToken");
      navigate("/about");
  }
  // To Show Or Hide Password
  const showHidePass = () =>{
    if(hidden) setHidden(false);
    else setHidden(true);
  }
  // Function for Making Change Password Request
  const handleChangePassword = async () =>{
    const params = {
      method:"PUT",
      headers:{
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem('authToken')
      },
      body: JSON.stringify({currentPass: cred.currentPass, newPass: cred.newPass})
    }
    const data = await fetch(`${HOST}/api/auth/changepass`, params);
    const parsedData = await data.json();
    if(parsedData.success)
    {
      setCred({currentPass: "", newPass: "", newPassConf: ""});
      setHidden(true);
      document.getElementById("passwordChangeSpan").style.color = "green";
      document.getElementById("passwordChangeSpan").innerHTML = parsedData.message;
      setTimeout(() => {
        document.getElementById("passwordChangeSpan").innerHTML = "";
      }, 4000);
    }
    else
    {
      setCred({currentPass: "", newPass: "", newPassConf: ""});
      setHidden(true);
      document.getElementById("passwordChangeSpan").style.color = "red";
      document.getElementById("passwordChangeSpan").innerHTML = parsedData.error;
      setTimeout(() => {
        document.getElementById("passwordChangeSpan").innerHTML = "";
      }, 4000);
    }
  }
  // Function for opening the Modal from Navbar
  const openModal = () =>{
    modalButtonRef.current.click();
  }
  // Function for change password form
  const onChange = (e) =>{
    setCred({...cred, [e.target.name]: e.target.value});
  }
  // For Cloud Bounce
  const [bounce, setBounce] = useState("");
  const handleCloudUp = ()=>{
    setBounce("fa-bounce");
  }
  const handleCloudLeave = ()=>{
    setBounce("");
  }
  return (
    <nav style={{cursor: "none"}} className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div data-cursor="-inverse" className="container-fluid">
    <i onMouseOver={handleCloudUp} onMouseLeave={handleCloudLeave} className={`fa-solid fa-xl fa-cloud ${bounce} mx-2`} style={{color: "#74C0FC"}}></i>
    <Link onMouseOver={handleCloudUp} onMouseLeave={handleCloudLeave} className="navbar-brand" to="/">NoteCloud</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className={`nav-link ${loc.pathname==="/"?"active":""}`} aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${loc.pathname==="/about"?"active":""}`} to="/about">About</Link>
        </li>
      </ul>
      {
        !sessionStorage.getItem("authToken")
      ?
        <div className="d-flex">
        <Link className='btn btn-primary mx-1' role="button" to="/login">Login</Link>
        <Link className='btn btn-primary mx-1' role="button" to="/signup">Signup</Link>
      </div> 
      : 
      <div className="d-flex">
        <b id='userName' className='mx-4 mt-2' onClick={openModal}>Username: {userDetails.name}</b> {/* Little CSS is defined in App.css */}
        {/* Code For Modal Starts*/}
          {/* <!-- Button trigger modal --> */}
        <button onClick={()=>{setCred({currentPass: "", newPass: "", newPassConf: ""});setHidden(true);}} ref={modalButtonRef} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">
        Launch demo modal
      </button>

      {/* <!-- Modal --> */}
      <div style={{cursor: "default"}} className="modal fade" id="exampleModal1" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Account Settings</h5>
              <button onClick={()=>{setCred({currentPass: "", newPass: "", newPassConf: ""});setHidden(true);}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/*Upper Body of Modal Starts(Indfo of user) */}
              <div className="info d-flex flex-column align-items-center mb-4 text-body-secondary">
                <b><span style={{color: "#88caef"}}>Username:</span> {userDetails.name}</b>
                <b><span style={{color: "#88caef"}}>Email:</span> {userDetails.email}</b>
                <b><span style={{color: "#88caef"}}>Number of Notes:</span> {totalNotes}</b>
                <b><span style={{color: "#88caef"}}>Account Created On:</span> {(new Date(userDetails.date)).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</b>
              </div>
              {/*Upper Body of Modal Ends */}
              <hr />
              {/*Lower Body of Modal */}
               <div className='d-flex flex-column align-items-center'>
                {/* DropDown For Form Starts */}
              <p>
                <button className=" btn btn-warning" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                  Change Password
                </button>
              </p>
              <div className="collapse" id="collapseExample">
                <div className="card card-body">
                  <form>
                  <div className="mb-3">
                      <label htmlFor="currentPass" className="form-label">Enter Current Password:</label>
                      <input type="password" className="form-control" id="currentPass" name='currentPass' aria-describedby="emailHelp" value={cred.currentPass} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPass" className="form-label">Enter New Password:</label>
                      <div className='d-flex align-items-center'>
                      <input type={hidden?`password`:"text"} className="form-control" minLength={6} title='Min length 6 Characters' id="newPass" name='newPass' value={cred.newPass} onChange={onChange} />
                      <i onClick={showHidePass} className={`fa-solid fa-eye${hidden?"-slash":""}`} style={{color: "#B197FC", cursor: "pointer"}}></i>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassConf" className="form-label">Confirm New Password:</label>
                      <input type="password" className="form-control" id="newPassConf" name='newPassConf' value={cred.newPassConf} onChange={onChange}/>
                    </div>
                  </form>
                  <span id="passwordChangeSpan"  ></span>
                  <button disabled={!cred.currentPass || cred.newPass.length<6 || cred.newPass!==cred.newPassConf} onClick={handleChangePassword} className='btn btn-primary'>Confirm</button>
                </div>
              </div>
              {/* DropDown For Form Ends */}
              <button className='btn btn-primary mx-1' onClick={handleLogout} >Logout</button>
              </div>
              {/* Lower Body of modal ends here */}
            </div>
            <div className="modal-footer">
              <button onClick={()=>{setCred({currentPass: "", newPass: "", newPassConf: ""});setHidden(true);}} ref={modalCloseRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      {/* Code For Modal Ends */}
      </div>
      }
    </div>
  </div>
</nav>
  )
}

export default Navbar
