# Text To Calendar Chrome Extension

The Text To Calendar Chrome Extension is a tool that allows users to easily add event details to their Google Calendar using the ChatGPT API and Google Calendar API. With this extension, you can convert plain text containing event information into a Google Calendar event effortlessly.

# Tech

- **HTML/Javascript/CSS**: simple form for entering event details.
- **Node.js Server**: communicate with openAI API (not possible via browser extension) hosted on google cloud platform.
- **OpenAI API**: extract event details data from text to a structured format.
- **Google Calendar API**: create a new event on the user's calendar.
- **Typescript**
- **Webpack**


# How to Run
- clone the project
- add environment variables
- npm install
- npm run build
- a dist folder is created. Compress it to a zip file.
- add it in chrome://extensions 
