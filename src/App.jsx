import React from 'react'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Todo from './components/Todo'
import {db} from './firebase'
import {query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc} from 'firebase/firestore'

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-bl from-cyan-300 to-blue-700`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-blue-500 text-slate-100`,
  count: `text-center p-2`
}

function App() {

  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e)
    if(input === '') {
      alert('Type something :)')
      return 
    }
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    })
    setInput('')
  }


  // Read todo
  useEffect(() =>{
    const q = query(collection(db, 'todos'))
    const unsubscribe = onSnapshot(q, (querySnapshot) =>{
      let todosArr = []
      querySnapshot.forEach((doc) => {
        todosArr.push({...doc.data(), id:doc.id})
      });
      setTodos(todosArr)
    })
    return () => unsubscribe()
  }, [])

  // Update todo
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
    })
  }

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id))
  }



  return (
    <>
     <div className={style.bg}>
        <div className={style.container}>
          <h3 className={style.heading}>Todo</h3>
          <form onSubmit={createTodo} className={style.form}>
            <input value={input} onChange={(e) => setInput(e.target.value)} className={style.input} type="text" placeholder='Add Todo' />
            <button className={style.button}><FontAwesomeIcon icon={faPlus} /></button>
          </form>
          <ul>
            {todos.map((todo, index)=> (
              <Todo key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo}/>
            ))}
          </ul>
          {todos.length < 1 ? null : <p className={style.count}>{`You have ${todos.length} todos`}</p>}
        </div>
      </div> 
    </>
  )
}

export default App
