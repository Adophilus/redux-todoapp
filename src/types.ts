export interface Todo {
  id: number
  task: string
  description: string
}

export interface StoreState {
  todos: Todo[]
  completed: Todo[]
}

export interface StoreDispatchAction {
  type: string
  todo: Todo
}

export interface Store {
  subscribe: (fn: Function) => Function
  getState: () => StoreState
  dispatch: (action: StoreDispatchAction) => StoreState
}
