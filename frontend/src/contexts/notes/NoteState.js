import { useState, useContext } from "react";
import NoteContext from "./NoteContext";
import AlertContext from "../alert/AlertContext";
//Defing Global Data
const HOST = " http://127.0.0.1:5000";


const NoteState = (props) =>{
    // State to store the total number of notes
    const [totalNotes, setTotalNotes] = useState(0);
    //Code Related to Alert
    const contextRelatedToAlert = useContext(AlertContext);
    const {showAlert} = contextRelatedToAlert;

    // Fetch Notes
    const [notes, setNotes] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const fetchNotes = async () =>{
        const paramsNotes = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("authToken")
            }
        }
        const paramsUserDetails = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("authToken")
            }
        }
        // Fetching userNotes
        const dataNotes = await fetch(`${HOST}/api/notes/fetchallnotes`, paramsNotes);
        const parsedDataNotes = await dataNotes.json();

        //Calculating total number of notes
        setTotalNotes(parsedDataNotes.length);

        // Fetching userDetails
        const dataUserDetails = await fetch(`${HOST}/api/auth/getuser`, paramsUserDetails);
        const parsedDataUserDetails = await dataUserDetails.json();
        
        setNotes(parsedDataNotes);
        setUserDetails(parsedDataUserDetails);
    }

    // Add Note
    const addNote = async (note)=>{
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("authToken")
            },
            body: JSON.stringify(note)
        }
        const data = await fetch(`${HOST}/api/notes/addnotes`, params);
        const parsedData = await data.json();
        if(parsedData.success)
        {
            fetchNotes();
            showAlert("success", "Successfully Added The Note!");
        }
        else
        {
            showAlert("danger", "Note Was not Added!");
        }
    }

    // Update Note
    const updateNote = async (id, title, description, tag)=>{
        const params = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({title, description, tag})
        }
        const data = await fetch(`${HOST}/api/notes/updatenotes/${id}`, params);
        const parsedData = await data.json();
        if(parsedData.success)
        {
            fetchNotes();
            showAlert("success", "Successfully Updated The Note!");
        }
        else
        {
            showAlert("danger", "Note Not Updated!");
        }
    }

    // Delete Note
    const deleteNote = async (id)=> {
        const params = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("authToken")
            }
        }
        const data = await fetch(`${HOST}/api/notes/deletenotes/${id}`, params);
        const parsedData = await data.json();
        if(parsedData.success)
        {
            fetchNotes();
            showAlert("success", "Successfully Deleted The Note!");
        }
        else
        {
            showAlert("danger", "Server Error, Note not deleted");
        }
    }
    return (
        <NoteContext.Provider value={{
            //Things for Fetch Notes
            notes, setNotes, fetchNotes, userDetails,
            //Things for Add note
            addNote,
            //Things for Update Note
            updateNote,
            //Things for Delete Note
            deleteNote,
            //State storing total Number of notes
            totalNotes,
        }} >
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
