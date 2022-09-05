import './app.css'
import { useState } from 'preact/hooks'

export function App({ store }) {
  // const [todos, setTodos] = useState([])

  store.subscribe(() => console.log(store.getState()))
  return (
    <div>
      <article>
        <form>
          <input type="text" />
          <textarea style="resize: none"></textarea>
          <button type="submit">
            <i class="fa-solid fa-plus"></i>
            Add Todo
          </button>
        </form>
      </article>
      {store.getState().todos.map((todo) => {
        return (
          <details>
            <summary>
              <input type="checkbox" />
              {todo.task}
            </summary>
            <p>{todo.description}</p>
          </details>
        )
      })}
    </div>
  )
}
