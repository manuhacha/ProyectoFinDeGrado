const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { User } = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/file');

router.get('/list',auth, async(req,res)=>{
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Username doesnt exists');
    const tasks = await Task 
                        .find({userId: req.user._id});
    res.send(tasks);
})

router.post('/',auth, async(req,res)=>{
    const user = await User.findById(req.user._id);

    if (!user) return res.status(400).send('Username doesnt exists');

    const task = new Task({
        userId: user._id,
        name: req.body.name,
        status: 'to-do',
        description: req.body.description
    })

    const result = await task.save();
    res.status(201).send(result);
})

router.post('/upload',upload.single('image'), auth, async(req,res)=>{
    const url = req.protocol + '://' + req.get('host');

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Username doesnt exists');
    let imageURL = null;
    if (req.file.filename) {
        imageURL = url + '/public/' + req.file.filename;
    }
    const task = new Task({
        userId: user._id,
        name: req.body.name,
        status: 'to-do',
        imageURL: imageURL,
        description: req.body.description
    })

    const result = await task.save();
    res.status(201).send(result);
})

router.put('/',auth, async(req,res)=>{
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('No username exists');
    const task = await Task.findByIdAndUpdate(req.body._id,{
        userId: user._id,
        name: req.body.name,
        status: req.body.status,
        description: req.body.description
    },{
        new: true
    })
    if (!task) return res.status(404).send('Task doesnt exists');
    res.status(204).send(task);
})

router.delete('/:_id',auth, async(req,res)=>{
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('No username');
    const task = await Task.findByIdAndDelete(req.params._id);
    if (!task) return res.status(404).send('Task doesnt exists');
    res.status(200).send({message: 'Deleted'});
})

module.exports = router;