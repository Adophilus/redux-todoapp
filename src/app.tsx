import './app.css'
import { useEffect, useState, useRef } from 'preact/hooks'

export function App({ store }) {
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const taskName = useRef()
  const taskDescription = useRef()

  store.subscribe(() => {
    setIsAddingTodo(false)
  })

  useEffect(() => {
    console.log(store.getState())
  })

  return (
    <div>
      <article>
        <hgroup>
          <h1>TODO List</h1>
          <p>A simple TODO app created with Preact, Redux and TypeScript</p>
        </hgroup>
        <img src="banner.svg" />
      </article>
      <article>
        <h2>Add a TODO</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsAddingTodo(true)

            store.dispatch({
              type: 'todo/add',
              todo: {
                task: taskName.current.value,
                description: taskDescription.current.value
              }
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
          <button type="submit" aria-busy={isAddingTodo}>
            {isAddingTodo ? (
              <>Adding...</>
            ) : (
              <>
                <i class="fa-solid fa-plus"></i>&nbsp; Add Todo
              </>
            )}
          </button>
        </form>
      </article>
      <article>
        <div class="todo-header">
          <h2>TODOs</h2>
          <a href="#" data-tooltip="Double click on a note to edit">
            <i class="fa-solid fa-circle-info"></i>
          </a>
        </div>
        {!store.getState().todos.length && (
          <div style="text-align: center">
            <i class="fa-solid fa-list-check" style="font-size: 40px"></i>
            <h3>No items in todo</h3>
          </div>
        )}
        {store.getState().todos.map((todo) => {
          const _todoTask = useRef()
          const _todoDescription = useRef()
          const addFocus = (elem) => {
            elem.setAttribute('contenteditable', 'true')
            elem.focus()
          }

          const removeFocus = (elem) => {
            elem.removeAttribute('contenteditable')
            store.dispatch({
              type: 'todo/update',
              todo: {
                id: todo.id,
                task: _todoTask.current.innerText,
                description: _todoDescription.current.innerText
              }
            })
          }

          return (
            <details key={todo.id}>
              <summary
                onClick={(e) => e.detail === 2 && addFocus(_todoTask.current)}
              >
                <input
                  type="checkbox"
                  onClick={() =>
                    store.dispatch({ type: 'todo/move-completed', todo })
                  }
                />
                &nbsp;
                <span
                  ref={_todoTask}
                  onKeyPress={(e) => e.key === 'Enter' && removeFocus(e.target)}
                  onBlur={(e) => {
                    removeFocus(e.target)
                  }}
                >
                  {todo.task}
                </span>
              </summary>
              <p
                ref={_todoDescription}
                onClick={(e) => e.detail === 2 && addFocus(e.target)}
                onBlur={(e) => {
                  removeFocus(e.target)
                }}
              >
                {todo.description}
              </p>
              <p>
                <div class="note-actions">
                  <a
                    role="button"
                    href="#"
                    onClick={() => addFocus(_todoDescription.current)}
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a>
                  <a role="button" href="#">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </div>
              </p>
            </details>
          )
        })}
      </article>
      <article>
        <h2>TODOs (Completed)</h2>
        {!store.getState().completed.length && (
          <div style="text-align: center">
            <i class="fa-regular fa-square-check" style="font-size: 40px"></i>
            <h3>No todo completed</h3>
          </div>
        )}
        {store.getState().completed.map((todo) => {
          return (
            <details key={todo.id}>
              <summary style="text-decoration: line-through">
                <input
                  type="checkbox"
                  checked
                  onClick={() =>
                    store.dispatch({ type: 'todo/move-todo', todo })
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
      <article style="text-align: center">
        Made with <i class="fa-solid fa-heart" style="color: #e53b2c"></i> by{' '}
        <a href="https://github.com/Adophilus" rel="noopener noreferrer">
          Uchenna Ofoma
        </a>
      </article>
    </div>
  )
}
