import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [id, setId] = useState('');
  const [todo, setTodo] = useState([]);
  const [author, setInputAuthor] = useState('');
  const [text, setInputText] = useState('');
  const [place, setInputPlace] = useState('');
  const [priority, setInputPriority] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/todo', {method: 'get'})
    .then(res => res.json())
    .then(({todoItems}) => {
      setTodo(todoItems)});
  }, [todo]);


  const updateId = (author, text, place, priority, id) => {
    console.log('hi');
    fetch(`http://localhost:3001/todo/update`, {
      method: 'put',
      body: JSON.stringify({author, text, place, priority, id}),
      headers: {'content-type':'application/json'}
    })
  };  

  const autoFill = (item) => {
    console.log(item);
    setId(item._id);
    setInputAuthor(item.author);
    setInputText(item.text);
    setInputPlace(item.place);
    setInputPriority(item.priority);
  }

  const addTodo = () => {
    fetch('http://localhost:3001/add-todo', {
      method: 'post', 
      body: JSON.stringify({author, text, place, priority}), 
      headers: {'content-type':'application/json'}
    })
  }

  const deleteId = (index) => {
    fetch(`http://localhost:3001/todo/delete${index}`, {
      method:'delete', 
      body: JSON.stringify({index}), 
      headers: {'content-type':'application/json'}})
    .then(res => res.json())
  }

  return (
    <div className="App">
      <div className="todo-header">
        <span className='todoHeaderText'>To Do List</span>
      </div>
      <div className="input-box">
        <input className='inputBox'
          type="text" placeholder='Author'
          value={author}
          onChange={e => setInputAuthor(e.target.value)}
        />
        <input
          type="text" placeholder='Text'
          value={text}
          onChange={e => setInputText(e.target.value)}
        />
        <input
          type="text" placeholder='Place'
          value={place}
          onChange={e => setInputPlace(e.target.value)}
        />
        <input
          type="text" placeholder='Priority'
          value={priority}
          onChange={e => setInputPriority(e.target.value)}
        />
      </div>
      <div className='buttons'>
        <button className='submit-button' onClick={addTodo}>Submit</button>
        <button className='update-button' onClick={() => updateId(author, text, place, priority, id)}>Update</button>
      </div>
      <table className='table'>
        <tr className='table-header'>
          <th>Author</th>
          <th>Text</th>
          <th>Place</th>
          <th>Priority</th>
          <th>Delete</th>
          <th>Edit</th>
        </tr>
        {todo.map((item) => {
          return(
            <tr key = {`${item._id}`}>
              <td>{item.author}</td>
              <td>{item.text}</td>
              <td>{item.place}</td>
              <td>{item.priority}</td>                 
              <td>
                <button onClick={() => deleteId(item._id)} className='btn-icon'><i class="fa-solid fa-trash"></i></button>
              </td>
              <td>
                <button onClick={() => autoFill(item)} className='btn-icon'><i class="fa-solid fa-pencil"></i></button>
              </td>
            </tr>
          )
        })}
      </table>
    </div>
  );
}

export default App;
