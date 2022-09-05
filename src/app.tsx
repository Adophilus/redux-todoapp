import './app.css'
import { useEffect, useState, useRef } from 'preact/hooks'

export function App({ store }) {
  const [rerender, setRerender] = useState(false)
  const taskName = useRef()
  const taskDescription = useRef()

  store.subscribe(() => {
    console.log(store.getState())
    setRerender(!rerender)
  })

  return (
    <div>
      <article>
        <form
          onSubmit={(e) => {
            e.preventDefault()

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
          <button type="submit">
            <i class="fa-solid fa-plus"></i>&nbsp; Add Todo
          </button>
        </form>
      </article>
      <article>
        <h2>TODOs</h2>
        {store.getState().todos.map((todo) => {
          const _todoDescription = useRef()
          const addFocus = (elem) => {
            elem.setAttribute('contenteditable', 'true')
            elem.focus()
          }

          const removeFocus = (elem) => {
            elem.removeAttribute('contenteditable')
            // save new todo
          }

          return (
            <details key={todo.id}>
              <summary style="display: flex; justify-content: space-between">
                <span>
                  <input
                    type="checkbox"
                    onClick={() =>
                      store.dispatch({ type: 'todo/move-completed', todo })
                    }
                  />
                  &nbsp;
                  {todo.task}
                </span>
                <a
                  href="#"
                  style="margin-left: auto"
                  onClick={() => addFocus(_todoDescription.current)}
                >
                  <i class="fa-regular fa-pen-to-square"></i>
                </a>
              </summary>
              <p
                ref={_todoDescription}
                onBlur={(e) => {
                  console.log('focus out')
                  removeFocus(e.target)
                }}
              >
                {todo.description}
              </p>
            </details>
          )
        })}
      </article>
      <article>
        <h2>TODOs (Completed)</h2>
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
    </div>
  )
}
