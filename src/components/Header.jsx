export function Header(props) {
    const { todos } = props // unbox the props
    const todosLength = todos.filter(val => !val.complete).length

    const isTasksPlural = todosLength != 1
    const tasksOrTasks = isTasksPlural ? 'tasks' : 'task'
    return (
        <header>
            <h1 className="text-gradient">You have {todosLength} open {tasksOrTasks}.</h1>
        </header>
    )
}