import React, { useState, useContext } from 'react'
import noteContext from '../contexts/notes/NoteContext';

function Addnote() {
    // For taking input from form
    const [note, setNote]=useState({title: "", description: "", tag: ""});
    const onChange = (e) =>{
        setNote({...note, [e.target.name]: e.target.value});
    }
    // For sending data to the backend
    const context = useContext(noteContext);
    const {addNote} = context;
    const submitForm = (e)=>{
        e.preventDefault();
        addNote(note);
        setNote({title: "", description: "", tag: ""});
    }
    
  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
        <form className='my-3'>
      <div className="mb-3" title="Title should have atleast 3 characters and 19 Characters max">
        <label htmlFor="title" className="form-label">Title:</label>
        <input type="text" maxLength={19} className="form-control" id="title" name='title' aria-describedby="emailHelp" value={note.title} onChange={onChange} />
      </div>
      <div className="mb-3" title="Description should have atleast 5 characters">
        <label htmlFor="description" className="form-label">Description:</label>
        <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="tag" className="form-label">Tag:</label>
        <input type="text" className="form-control" maxLength={10} title='Max Length 10' id="tag" name='tag' value={note.tag} onChange={onChange} />
      </div>
      <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick={submitForm} >Add Note</button>
      </form>
      </div>
      
  )
}

export default Addnote
