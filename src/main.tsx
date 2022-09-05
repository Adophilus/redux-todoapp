import { render } from 'preact'
import { App } from './app'
import { createStore } from 'redux'

const store = createStore((state = {
  todos: [],
  completed: []
}, action) => {
    switch (action.type) {
      case "todos/add":
        return { ...state, [todos]: [...state.todos, { [task]: action.task, [description]: action.description } ]}
      default:
      return state
    }
  })

render(<App store={store} />, document.getElementById('app') as HTMLElement)
