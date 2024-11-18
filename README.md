# todo-app
 React.js Todo App w. FantaCSS & LocalStorage

 
# Basic Overview
 A Basic to-Do App with a customizable timer. The tasks are split into three sections: All, Open, and Completed. The website is styled using the FantaCSS library. LocalStorage is leveraged to save the user's session data when exiting.

# Technical Functionality
The app was built using the react.js framework. useState was used to update page data without having to refresh the page. useState was implemented for any dynamic data. useEffect was implemented to parse the localStorage database once the page was completely loaded. The database stored all the users' todos (in progress & completed) and was accessed by parsing the JSON data on page load. Once a todo was entered it would be stored in the database as JSON data. 

# Future Improvements
- Create a circular visual of the progress of the timer (data visualization)
- Develop a work tracker for the user to visualize how many hours they worked in a week/month
- Create a more complex backend for user authentication to store their todo list data and the amount of work they have done over time
- Implement a habit tracker tab that refreshes daily


 # Hosting
 Hosted using Vercel free plan
 https://todo-app-nivar.vercel.app/
