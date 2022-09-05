import { render } from 'preact'
import { App } from './app'
import { createStore } from 'redux'

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
          todos: [
            ...state.todos,
            {
              id: Date.now(),
              task: action.todo.task,
              description: action.todo.description
            }
          ]
        }
      case 'todo/move-completed':
        const newState = {
          ...state,
          completed: [
            ...state.completed,
            state.todos.find((todo) => todo.id === action.todo.id)
          ].filter((todo) => todo),
          todos: [...state.todos].filter((todo) => todo.id !== action.todo.id)
        }
        console.log('newState:', newState)
        return newState
      case 'todo/move-todo':
        return {
          ...state,
          todos: [
            ...state.todos,
            state.completed.find((todo) => todo.id === action.todo.id)
          ].filter((todo) => todo),
          completed: [...state.completed].filter(
            (todo) => todo.id !== action.todo.id
          )
        }
      case 'todo/update':
        return {
          ...state,
          todos: [...state.todos].map((todo) =>
            todo.id === action.todo.id
              ? {
                  id: todo.id,
                  task: action.todo.task || todo.task,
                  description: action.todo.description || todo.description
                }
              : todo
          )
        }
      default:
        return state
    }
  }
)

render(<App store={store} />, document.getElementById('app') as HTMLElement)
