import {useState} from 'react'

export function TodoInput(props) {
    const { handleAddTodo } = props
    const [inputValue, setInputValue] = useState('')
    
    return (
        <div className="input-container">
            <input value = {inputValue} 
            onChange={(e) => {
                setInputValue(e.target.value)
            }} 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleAddTodo(inputValue);
                    setInputValue('')
                }
            }}
            placeholder="Add task">
            </input>
            <button onClick={() => {
                if (!inputValue) {return} // prevent empty todos
                handleAddTodo(inputValue)
                setInputValue('')
            }}>
            <i className="fa-solid fa-plus"></i>
            </button>
        </div>
    )
}