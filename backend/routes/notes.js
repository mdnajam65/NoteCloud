const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const router = express.Router();


//Route-1]Fetch all the notes using get: "api/notes/fetchallnotes", Login required
router.get("/fetchallnotes", fetchuser, async (req,res)=>{
    try {
            const notes = await Notes.find({user: req.user.id})
            res.json(notes);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route-2]Add note using post: "api/notes/addnotes", Login required
router.post("/addnotes", fetchuser, [
    body('title','Title should be atleast 3 characters long').isLength({min: 3}),
    body('description','Description should be atleast 5 characters long').isLength({min: 5})
], async (req,res)=>{
    success = false; // To send with the api if the work is done at the backend
    try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(400).json({ errors: errors.array() })
            }
            //adding data to mongodb
            const {title, description, tag} = req.body
            const notes = new Notes({
                title, description, tag, user: req.user.id
            })
            await notes.save();
            success  =true;

            res.json({notes, success});  //the validation we used will allow "a          " as description, it will count spaces as characters
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route-3]Update notes using put: "api/notes/upadatenotes/:id", Login required
router.put("/updatenotes/:id", fetchuser, [
    body('title',"Title should be atleast 3 chars long").optional().isLength({min: 3}),
    body('description',"Description should be atleast 5 chars long").optional().isLength({min: 5})
], async (req,res)=>{
    success = false; // To send with the api if the work is done at the backend
    try {
            //Checking validation results
            const errors = validationResult(req);
                if(!errors.isEmpty())
                {
                    return res.status(400).json({ errors: errors.array() })
                }
            const noteId = req.params.id;
            const notes = await Notes.findById(noteId);
            if(!notes)
            {
                return res.status(404).json({error: "No Notes Found"});
            }
            //checking if the logged in user is not accessing other users notes
            if(req.user.id !== notes.user.toString())
            {
                return res.status(401).send("Not a verified request");
            }
            //Updatting notes
            const {title, description, tag} = req.body;
            let newNotes = {};
            if(description){newNotes.description = description}
            if(title){newNotes.title = title}
            if(tag){newNotes.tag = tag}

            newNotes = await Notes.findByIdAndUpdate(noteId, {$set: newNotes}, {new: true});
            success = true;
            res.send({newNotes, success});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route-4]Delete notes using delete: "api/notes/deletenotes/:id", Login required
router.delete("/deletenotes/:id", fetchuser, async (req,res)=>{
    success = false; // To send with the api if the work is done at the backend
    try {
            const noteId = req.params.id;
            const notes = await Notes.findById(noteId);
            if(!notes)
            {
                return res.status(404).json({error: "No Notes Found"});
            }
            //checking if the logged in user is not accessing other users notes
            if(req.user.id !== notes.user.toString())
            {
                return res.status(401).send("Not a verified request");
            }

            newNotes = await Notes.findByIdAndDelete(noteId);
            success = true;

            res.send({success, note :newNotes});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;