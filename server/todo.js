const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const {connectToMongo, getCollection} = require('./db-connect.js')
const {createTodo,  findAllItems} = require('./fcn.js')

const app = express()
const port = 3001;

app.use(cors ({origin: 'http://localhost:3000'}));

app.use('/static', express.static('static'));
app.use(bodyParser.json());

app.get('/todo', async(req, res) => {
    try{
        const collection = getCollection('todo-list');
        const todoItems = await findAllItems(collection);
        res.status(200).json({todoItems})
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.post('/todo', async(req, res) => {
    try{
        const {todo} = req.body;
        const collection = getCollection('todo-list')
        const ack = await createTodo(collection, todo)
        res.status(200).json({ack})
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

app.put('/todo/update', async (req, res) => {
    try {
      const collection = getCollection('todo-list');
      const { author, text, place, priority, id } = req.body;
      console.log(id);
      const idd = new ObjectId(id);
      
      const updatedFields = {};
      if (author) updatedFields.author = author;
      if (text) updatedFields.text = text;
      if (place) updatedFields.place = place;
      if (priority) updatedFields.priority = priority;
      
      const result = await collection.updateOne({ _id: idd }, { $set: updatedFields });
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Entry updated successfully' });
      } else {
        res.status(404).json({ error: 'Entry not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

app.get('/todo-filter', async(req, res) => {
    try{
        const collection = getCollection('todo-list');
        const todoItems = await findAllItems(collection);
        const {text} = req.body, {author} = req.body, {place} = req.body, {priority} = req.body;
        let t = text, a = author, p = place, pr = priority;
        console.log(`Text: ${t}\nAuthor: ${a}\nPlace: ${p}\nPriority: ${pr}`);
        const filter = {};
        if(t) {
            filter.text = { $regex : t};
            console.log("is t")
        }
        if(a) {
            filter.author = { $regex : a};
        }
        if(p) {
            filter.place = { $regex : p};
        }
        if(pr) {
            filter.priority = { $regex : pr};
        }
        const ack = await collection.find(filter).toArray();
        res.status(200).json({ack})
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
})


app.delete('/todo/delete:index', async(req, res) => {
    try{
        const collection = getCollection('todo-list');
        const {index} = req.params;
        console.log(index);
        const idd = new ObjectId(index);
        const ack = await collection.deleteOne({ _id: idd });
        if (ack.deletedCount === 1) {
        res.status(200).json({ack})
        } 
        else {
            res.status(500).json("Document not found");
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

app.post('/add-todo', async(req, res) => {
    try{
        const {author, text, place, priority} = req.body;
        const obj = {author, text, place, priority};
        const collection = getCollection('todo-list');
        const ack = await createTodo(collection, obj);
        res.status(200).json({ack});
    }
    catch{
        res.status(500).json({error: err.message});
    }
})

connectToMongo()
.then(() => {
    console.log("Database connected...")
    app.listen(port, () => {
        console.log("Server running on http://localhost:",port);
    })
})
.catch((err) => {
    console.log(err)
})