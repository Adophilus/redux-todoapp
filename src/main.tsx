import { render } from 'preact'
import { App } from './app'
import { createStore } from 'redux'

const todo = (state, action) => {
  switch (action.type) {
    case 'todo/add':
      return {
        id: Date.now(),
        task: action.todo.task,
        description: action.todo.description
      }
    case 'todo/update':
      return {
        id: todo.id,
        task: action.todo.task || todo.task,
        description: action.todo.description || todo.description
      }
    default:
      return state
  }
}

const store = createStore(
  (
    state = {
      todos: [],
      completed: []
    },
    action
  ) => {
    switch (action.type) {
      case 'todo/add':
        return {
          ...state,
          todos: state.todos.concat(todo(null, action))
        }
      case 'todo/move-completed':
        return Object.assign({}, state, {
          completed: state.completed.concat(
            state.todos.find((todo) => todo.id === action.todo.id) || []
          ),
          todos: state.todos.filter((todo) => todo.id !== action.todo.id)
        })
      case 'todo/move-todo':
        return Object.assign({}, state, {
          todos: state.todos.concat(
            state.completed.find((todo) => todo.id === action.todo.id) || []
          ),
          completed: state.completed.filter(
            (todo) => todo.id !== action.todo.id
          )
        })
      case 'todo/update':
        return {
          ...state,
          todos: state.todos.map((_todo) =>
            _todo.id === action.todo.id ? todo(_todo, action) : _todo
          )
        }
      default:
        return state
    }
  }
)

render(<App store={store} />, document.getElementById('app') as HTMLElement)
