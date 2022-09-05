import './app.css'
import { useState, useRef } from 'preact/hooks'

export function App({ store }) {
  const [todos, setTodos] = useState(store.getState())
  const taskName = useRef()
  const taskDescription = useRef()

  store.subscribe(() => setTodos(store.getState()))

  return (
    <div>
      <article>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            store.dispatch({
              type: 'todo/add',
              task: taskName.current.value,
              description: taskDescription.current.value
            })

            taskName.current.value = ''
            taskDescription.current.value = ''
          }}
        >
          <input
            ref={taskName}
            required
            type="text"
            placeholder="Enter task name..."
          />
          <textarea
            ref={taskDescription}
            required
            style="resize: none"
            placeholder="Enter task details..."
          ></textarea>
          <button type="submit">
            <i class="fa-solid fa-plus"></i>&nbsp; Add Todo
          </button>
        </form>
      </article>
      <article>
        <h2>TODOs</h2>
        {store.getState().todos.map((todo) => {
          return (
            <details>
              <summary>
                <input type="checkbox" />
                &nbsp;
                {todo.task}
              </summary>
              <p>{todo.description}</p>
            </details>
          )
        })}
      </article>
      <article>
        <h2>TODOs (Completed)</h2>
        {store.getState().completed.map((todo) => {
          return (
            <details>
              <summary style="text-decoration: strikethrough">
                <input
                  type="checkbox"
                  checked
                  onClick={() =>
                    store.dispatch({ type: 'todo/mark-incomplete', todo })
                  }
                />
                &nbsp;
                {todo.task}
              </summary>
              <p>{todo.description}</p>
            </details>
          )
        })}
      </article>
    </div>
  )
}
