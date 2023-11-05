# Todo App

![Todo App](https://github.com/taraqr9/vue-todo/assets/130284178/df7998b5-bb6a-40a6-b455-39fcd374ef8b)

## Overview
The Todo App is a web application that simplifies your daily task management. You can create, edit, update, delete, and search for tasks using various filters, checkboxes, and a search bar. The app includes user authentication, allowing users to sign up and log in.

### User Authentication with `localStorage`
User authentication in this app is implemented manually using `localStorage`. When a user signs up or logs in, their authentication status and user details are securely stored in the browser's `localStorage`. This approach allows for a seamless user experience without the need for external authentication services.

### State Management with Pinia
For efficient state management, this project utilizes Pinia, a modern and highly customizable store for Vue 3. Pinia helps manage application data and user-related information, providing a smooth and responsive user experience.

## Features
- User authentication with sign-up and login.
- Create, edit, update, and delete tasks.
- Search tasks by keywords, categories, or status.
- Check and uncheck tasks with checkboxes.
- User-friendly interface.

## Technologies Used
- Vue.js: The frontend framework for building the app.
- Pinia: A state management system for Vue 3, ensuring efficient data handling.
- JSON Server: A simple JSON-based database server for API development.
- HTML, CSS: For structuring and styling the app.

## Getting Started
To run the Todo App locally, follow these steps:

1. Clone this repository to your local machine.
2. Run `npm install` to install the required packages.
3. Start the JSON Server by running `npm run db:serve`. This sets up your API.
4. Start the Vue.js development server by running `npm run serve`.

## Usage
1. Register or log in to access your tasks.
2. Create new tasks.
3. Edit, update, or delete tasks with ease.
4. Change the status from the home page.
4. Use checkboxes to mark tasks as complete or incomplete.
5. Apply filters and the search bar to quickly find tasks.

## Acknowledgments
- For User authentication, I used local storage and did it fully manually.
- Vue.js: A powerful JavaScript framework for building user interfaces.
- JSON Server: A hassle-free solution for creating APIs.

## License
This project is open-source and available under the [MIT License](LICENSE).

Feel free to contribute, report issues, or provide feedback. This project was created as a personal endeavor to improve web development skills and offer a practical task management solution.
