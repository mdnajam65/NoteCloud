import {React, useContext, useEffect, useState, useRef} from 'react'
import noteContext from '../contexts/notes/NoteContext'
import Noteitems from './Noteitems';
import Addnote from './Addnote';
import { useNavigate } from 'react-router-dom';

function Notes() {
    const navigate = useNavigate();
    const context = useContext(noteContext);
    const {notes, fetchNotes, updateNote} = context;
    // On render of Notes element we will fetch notes
    useEffect(()=>{
      if(!sessionStorage.getItem("authToken"))
      {
        navigate("/login");
      }
      else
      {
        fetchNotes();
      }
      return () =>{sessionStorage.removeItem("authToken");}
      // eslint-disable-next-line
    },[]);
    // ******Code related to edit form and modal******
    const modalButtonRef = useRef(null);
    const modalCloseRef = useRef(null);
    const [newNote, setNewNote] = useState({etitle: "", edescription: "", etag: ""});
    const onChange = (e)=>{
      setNewNote({...newNote, [e.target.name]: e.target.value});
    }
    const updateNoteModal = (noteID ,oldTitle, oldDescription, oldTag) =>{
      modalButtonRef.current.click();
      setNewNote({noteID, etitle: oldTitle, edescription: oldDescription, etag: oldTag});
    }
    const onClickUpdateNote = ()=>{
      updateNote(newNote.noteID, newNote.etitle, newNote.edescription, newNote.etag);
      modalCloseRef.current.click();
    }
  return (
    <>
      <Addnote/>
      {/* Code for Modal Starts */}
      <button ref={modalButtonRef} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Code for the edit note form starts */}
              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title:</label>
                  <input type="text" className="form-control" maxLength={19} title='Max length 19 & Min Length 3' id="etitle" name='etitle' aria-describedby="emailHelp" value={newNote.etitle} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description:</label>
                  <input type="text" className="form-control" id="edescription" name='edescription' value={newNote.edescription} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag:</label>
                  <input type="text" maxLength={10} className="form-control" id="etag" name='etag' value={newNote.etag} onChange={onChange} title='Max Length 10' />
                </div>
              </form>
              {/* Code for the edit note form ends */}
            </div>
            <div className="modal-footer">
              <button ref={modalCloseRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" disabled={newNote.etitle.length<3 || newNote.edescription.length<5} onClick={onClickUpdateNote}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      {/* Code for Modal Ends */}
      <div className="row">
          <h2>Your Notes</h2>
          
            {
              notes.length === 0 && <div className="container mx-2" style={{color: "red"}}>No Notes To display &#9785; 
              </div>
            }
         
          {
            notes.map((note) =>{
              return <Noteitems updateNoteModal={updateNoteModal} date={note.date} title={note.title} description={note.description} tag={note.tag} id={note._id} key={note._id}/>
            })
          }
        </div>
      </>
  )
}

export default Notes
