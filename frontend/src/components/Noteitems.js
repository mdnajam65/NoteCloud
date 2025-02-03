import React, { useContext, useState } from 'react'
import noteContext from '../contexts/notes/NoteContext';

function Noteitems(props) {
  //Function to delete note
  const context = useContext(noteContext);
  const {deleteNote} = context;
  const onClickDelete = ()=>{
      deleteNote(props.id);
  }
  // Date Methods
  let date = new Date(props.date);
  date = date.toLocaleDateString();
  // Description slicing
  const temp = props.description.slice(0,25);
  const [partialDescription, setPartialdescription] = useState(temp);
  const showDescription = () =>{
    if(partialDescription === temp)
    {
      setPartialdescription("Description:");
    }
    else
    {
      setPartialdescription(temp);
    }
  }
  return (
    <div className='col-md-3 my-3'>
        <div className="card">
            <div className="card-body">

              <div className="d-flex justify-content-between my-2">
                <h5 className="card-title">{props.title}</h5>
                <div>
                  <i className="fa-solid fa-trash mx-2" style={{color: "#e70404", cursor: "pointer"}} onClick={onClickDelete}></i>
                  <i className="fa-solid fa-pen-to-square mx-2" style={{color: "#FFD43B", cursor: "pointer"}} onClick={()=>{props.updateNoteModal(props.id, props.title, props.description, props.tag)}}></i>
                </div>
              </div>
              
            <details className="card-text" onClick={showDescription}><summary>{partialDescription}</summary> {props.description}</details>
            
            <div className="d-flex justify-content-between mt-2">
              <p className="card-text"><small className="text-body-secondary"> <b>Tag:</b> {props.tag}</small></p>
              <p className="card-text"><small className="text-body-secondary"> <b>Created:</b> {date}</small></p>
              </div>
            
        </div>
    </div>
</div>
  )
}

export default Noteitems
