import './app.css'
import preact from 'preact'
import { useEffect, useState, useRef } from 'preact/hooks'
import { Todo, Store } from './types'

interface Props {
  store: Store
}

export function App({ store }: Props) {
  const [isAddingTodo, setIsAddingTodo] = useState(Date.now() + 86400 * 1000)
  const taskName = useRef<HTMLInputElement>()
  const taskDescription = useRef<HTMLTextAreaElement>()

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setIsAddingTodo(Date.now() + 86400 * 1000)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div>
      <article>
        <hgroup>
          <h1>TODO List</h1>
          <p>A simple TODO app created with Preact, Redux and TypeScript</p>
        </hgroup>
        <div style="display: flex; justify-content: center">
          <img src="banner.svg" />
        </div>
      </article>
      <article>
        <h2>Add a TODO</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (!taskName.current || !taskDescription.current) return

            setIsAddingTodo(Date.now() - 86400 * 1000)
            const task = taskName.current.value
            const description = taskDescription.current.value

            if (task && description) {
              store.dispatch({
                type: 'todo/add',
                todo: {
                  task,
                  description
                } as Todo
              })

              taskName.current.value = ''
              taskDescription.current.value = ''
            } else {
              alert('Task name or description cannot be empty!')
            }
          }}
        >
          <input
            ref={taskName as preact.RefObject<HTMLInputElement>}
            required
            type="text"
            placeholder="Enter task name..."
          />
          <textarea
            ref={taskDescription as preact.RefObject<HTMLTextAreaElement>}
            required
            style="resize: none"
            placeholder="Enter task details..."
          ></textarea>
          <button type="submit" aria-busy={isAddingTodo < Date.now()}>
            {isAddingTodo < Date.now() ? (
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
        {store.getState().todos.map((todo: Todo) => {
          const _todoTask = useRef<HTMLInputElement>()
          const _todoDescription = useRef<HTMLParagraphElement>()

          const addFocus = (elem: HTMLElement) => {
            if (!elem) return

            elem.setAttribute('contenteditable', 'true')
            elem.focus()
          }

          const removeFocus = (elem: HTMLElement) => {
            if (!elem || !_todoTask.current || !_todoDescription.current) return

            elem.removeAttribute('contenteditable')
            store.dispatch({
              type: 'todo/update',
              todo: {
                id: todo.id,
                task: _todoTask.current.innerText,
                description: _todoDescription.current.innerText
              } as Todo
            })
          }

          return (
            <details key={todo.id}>
              <summary
                onClick={(e) =>
                  e.detail === 2 &&
                  addFocus(_todoTask.current as HTMLInputElement)
                }
              >
                <input
                  type="checkbox"
                  onClick={() =>
                    store.dispatch({ type: 'todo/move-completed', todo })
                  }
                />
                &nbsp;
                <span
                  ref={_todoTask as preact.RefObject<HTMLInputElement>}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    removeFocus(e.target as HTMLInputElement)
                  }
                  onBlur={(e) => {
                    removeFocus(e.target as HTMLInputElement)
                  }}
                >
                  {todo.task}
                </span>
              </summary>
              <p
                ref={_todoDescription as preact.RefObject<HTMLParagraphElement>}
                onClick={(e) =>
                  e.detail === 2 && addFocus(e.target as HTMLParagraphElement)
                }
                onBlur={(e) => {
                  removeFocus(e.target as HTMLParagraphElement)
                }}
              >
                {todo.description}
              </p>
              <p>
                <div class="note-actions">
                  <a
                    role="button"
                    href="#"
                    onClick={() =>
                      addFocus(_todoDescription.current as HTMLParagraphElement)
                    }
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
        {store.getState().completed.map((todo: Todo) => {
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
