Todo App with Timer
Overview
The Todo App with Timer is a web-based application designed to help users manage their tasks efficiently. Built with HTML, CSS, and JavaScript, the app features a sleek glassmorphism design, interactive elements, and a timer functionality to keep track of task deadlines. Users can add, edit, delete, and categorize tasks, set priorities, and use timers to stay on top of their schedules.
Features

Task Management:

Add, edit, and delete tasks with descriptions, categories, priorities, and optional timers.
Mark tasks as completed or undo completion.
View all tasks in a pop-up table with options to select and delete multiple tasks at once.


Categories and Priorities:

Choose from a wide range of categories (e.g., Office, School, Home, etc.) with gradient-styled dropdown options.
Set task priorities (Low, Medium, High) with distinct gradient backgrounds for easy identification.


Timer Functionality:

Set a timer (in minutes) for tasks to track deadlines.
Receive an audio notification when a timer expires.
Timers persist across sessions using local storage.


Interactive Design:

Glassmorphism UI with a blurred background effect when the task table pop-up is open.
Mouse events: Hover effects, click animations, and scaling on buttons, table rows, and dropdowns.
Keyboard events: Use Enter to submit tasks, Esc to close the pop-up, and Ctrl + T to open the task table.


Responsive Design:

Fully responsive layout that works on desktops, tablets, and mobile devices.
Minimum column widths in the task table ensure readability on smaller screens.


Local Storage:

Tasks and timers are saved to local storage, ensuring persistence across browser sessions.



Usage
Prerequisites

A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
No additional software or dependencies are required since the app runs entirely in the browser.

Getting Started

Clone or Download the Project:

Clone the repository or download the project files to your local machine.


Open the App:

Open the index.html file in your web browser to launch the app.


Add a Task:

Fill in the task description (required), select a category (required), choose a priority (default: Medium), and optionally set a timer in minutes.
Click the "Add Task" button or press Enter to add the task.


View and Manage Tasks:

Click the "View Task Table" button or press Ctrl + T to open the task table pop-up.
In the pop-up:
Mark tasks as completed or undo completion using the "Done"/"Undo" button.
Edit a task by clicking "Edit" (this will close the pop-up and populate the form with the task details).
Delete a task by clicking "Delete".
Select multiple tasks using checkboxes and click "Delete Selected" to remove them in bulk.
Use "Select All" to toggle selection of all tasks.
Close the pop-up by clicking the "×" button or pressing Esc.




Timer Notifications:

If a timer is set for a task, the remaining time will be displayed in the table.
When the timer expires, an audio alert will play, and a notification will appear.



Files

index.html: The main HTML file containing the structure of the app.
styles.css: The CSS file with all styling, including glassmorphism effects, gradients, and responsive design.
script.js: The JavaScript file handling task management, timer functionality, and interactivity.
dhoom_tune.mp3: An audio file used for timer expiration notifications (replace with your own audio file if needed).

Customization

Audio File:

Replace dhoom_tune.mp3 with your preferred audio file for timer notifications. Update the reference in index.html accordingly.


Styling:

Modify styles.css to change colors, gradients, or other visual elements. For example:
Adjust the dropdown gradients under #taskCategory option and #taskPriority option.
Change the blur effect strength in #background-content.popup-open.




Categories:

Add or remove categories by editing the <option> elements in the #taskCategory <select> in index.html. Update the corresponding gradient styles in styles.css.



Limitations

Dropdown Option Styling:

The gradient styling on <option> elements may not work in all browsers (e.g., Firefox). For full cross-browser support, consider implementing a custom dropdown using <div> elements.


Audio Playback:

The timer notification audio (dhoom_tune.mp3) must be available and accessible. Browsers may block audio playback until user interaction occurs due to autoplay policies.



Future Improvements

Replace the native <select> with a custom dropdown for better cross-browser styling support.
Add sorting and filtering options to the task table.
Implement task reminders using browser notifications (if permitted by the user).
Add drag-and-drop functionality to reorder tasks.

License
This project is open-source and available under the MIT License.

Last updated: May 21, 2025
