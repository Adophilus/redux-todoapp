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
          const _todoTask = useRef()
          const _todoDescription = useRef()
          const addFocus = (elem) => {
            elem.setAttribute('contenteditable', 'true')
            elem.focus()
          }

          const removeFocus = (elem) => {
            elem.removeAttribute('contenteditable')
            // save new todo
            store.dispatch({
              type: 'todo/update',
              todo: {
                ...todo,
                task: _todoTask.current.value,
                description: _todoDescription.current.value
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
