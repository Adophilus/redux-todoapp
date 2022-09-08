import { render } from 'preact'
import { App } from './app'
import { createStore } from 'redux'
import { Store, StoreDispatchAction, Todo, StoreState } from './types'

const handleTodo = (state: Todo | null, action: StoreDispatchAction): Todo => {
  switch (action.type) {
    case 'todo/add':
      return {
        id: Date.now(),
        task: action.todo.task,
        description: action.todo.description
      } as Todo
    case 'todo/update':
      return {
        id: action.todo.id,
        task: action.todo.task,
        description: action.todo.description
      } as Todo
    default:
      return state as Todo
  }
}

const store: Store = createStore(
  (
    state: StoreState = {
      todos: [],
      completed: []
    },
    action: StoreDispatchAction
  ) => {
    switch (action.type) {
      case 'todo/add':
        return {
          ...state,
          todos: state.todos.concat(handleTodo(null, action))
        }
      case 'todo/move-completed':
        return Object.assign({}, state, {
          completed: state.completed.concat(
            state.todos.find((todo: Todo) => todo.id === action.todo.id) || []
          ),
          todos: state.todos.filter((todo: Todo) => todo.id !== action.todo.id)
        })
      case 'todo/move-todo':
        return Object.assign({}, state, {
          todos: state.todos.concat(
            state.completed.find((todo: Todo) => todo.id === action.todo.id) ||
              []
          ),
          completed: state.completed.filter(
            (todo: Todo) => todo.id !== action.todo.id
          )
        })
      case 'todo/update':
        return {
          ...state,
          todos: state.todos.map((todo: Todo) =>
            todo.id === action.todo.id ? handleTodo(todo, action) : todo
          )
        }
      default:
        return state
    }
  }
)

render(<App store={store} />, document.getElementById('app') as HTMLElement)
