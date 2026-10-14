# Almdrasa Notes

A simple, responsive notes web app for creating, organizing, searching, and managing personal notes. Notes are saved locally in the browser, so they remain available on the same browser without requiring a backend or account.

## Features

- **Create notes** with a title, author, and note content.
- **Pin and unpin notes** to keep important notes in a dedicated section.
- **Delete notes** you no longer need.
- **Search notes** by title, author, or content.
- **View note details** by selecting a note.
- **Responsive layout** designed for desktop and mobile screens.
- **Local persistence** using the browser's `localStorage`.
- **Mobile navigation** with a collapsible sidebar.

## Built With

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Browser `localStorage`

## Getting Started

No build tools or package installation are required.

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same directory.
3. Open `index.html` in your browser.

For local development, you can also use the **Live Server** extension in Visual Studio Code.

## Project Structure

```text
Almdrasa-Notes/
├── index.html   # App structure and note template
├── style.css    # Layout, styling, and responsive rules
├── script.js    # Note operations and local storage logic
└── README.md    # Project documentation
```

## How to Use

1. Open the app in your browser.
2. Choose **Add Notes** or press the **+** button.
3. Enter the note title, author, and content.
4. Choose **Add Note** to save it, or **Add pinned note** to save it in the pinned section.
5. Use **Pin/Unpin** to move a note between the pinned and regular notes sections.
6. Select a note to read its full content.
7. Use the search field to find notes by title, author, or content.
8. Press **Delete** to remove a note.

## Data Storage

The app stores notes in the browser's `localStorage` under the key `almdrasa-notes-v1`.

- Notes are stored locally in the current browser profile.
- Data is not automatically synchronized between devices or browsers.
- Clearing browser site data may remove saved notes.

## Limitations

- There is no server-side database or user authentication.
- Notes are available only in the browser profile where they were created.
- The app requires JavaScript to be enabled.

## License

No license has been specified for this project. Add a license file if you plan to distribute or reuse the project publicly.
