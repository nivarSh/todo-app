# todo-app 
 React.js Todo App w. FantaCSS & LocalStorage

 
# Basic Overview
 A Basic to-Do App with a customizable timer. The tasks are split into three sections: All, Open, and Completed. LocalStorage is leveraged to save the user's session data when exiting and to save the daily amount of minutes the user worked. The daily logged minutes are shown for each day of the week. To store minutes for a week, there is a logging feature. The website is styled using the FantaCSS library.

# Technical Functionality
The app was built using the react.js framework. useState was used to update page data without having to refresh the page. useState was implemented for any dynamic data. useEffect was implemented to parse the localStorage database once the page was completely loaded. The database stored all the users' todos (in progress & completed) and was accessed by parsing the JSON data on page load. Once a todo was entered it would be stored in the database as JSON data. The database is split into two sections: storing the user's todos, and a dictionary object that stores minutes associated with each day (weekday[key] : minutes logged[value]).

# Future Improvements
- Option to edit todo content and reorder the vertical position of todos
- Option to create subtasks for each todo
- Create a circular visual of the progress of the timer (data visualization)
- Create a more complex backend for user authentication to store their todo list data and the amount of work they have done over time
- Implement a habit tracker tab that refreshes daily
