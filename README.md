# CSUN Google Maps Quiz App

A browser-based map quiz application built with the Google Maps JavaScript API. The user is prompted to find CSUN campus locations by double-clicking on the map. The app checks whether the selected point is inside the correct location area, gives feedback, displays the correct area in green or red, and shows the final score after five locations.

## Live Demo

GitHub Pages: https://gtech29.github.io/comp484-project5/

GitHub Repository: https://github.com/gtech29/comp484-project5

## Features

- Displays a Google Map centered on the CSUN campus.
- Prompts the user to find five CSUN locations:
  - Santa Susana Hall
  - C.R. Johnson Auditorium
  - Charles H. Noski Auditorium
  - Bookstein Hall
  - Arbor Grill
- Allows the user to double-click on the map to make a guess.
- Checks whether the user's double-click is inside the correct rectangular location boundary.
- Displays feedback after each guess.
- Shows the correct location area on the map:
  - Green rectangle for a correct answer.
  - Red rectangle for an incorrect answer.
- Tracks the user's score during the quiz.
- Displays the final score after all five locations are completed.
- Prevents the user from answering the same question more than once.
- Disables map panning, zooming, default controls, and keyboard shortcuts.

## Technologies Used

- HTML5
- CSS
- JavaScript
- Google Maps JavaScript API
- Google Maps Rectangle Overlays
- DOM Manipulation
- Event Listeners

## How It Works

The app stores a list of CSUN locations. Each location includes a name, grid label, and rectangular map boundaries using north, south, east, and west coordinate values.

When the user double-clicks on the map, the app captures the latitude and longitude of the selected point. It then compares those coordinates against the current location's boundary values.

If the selected point is inside the correct boundary, the app marks the answer as correct, displays a green rectangle over the correct location, and increases the score.

If the selected point is outside the correct boundary, the app marks the answer as incorrect, displays a red rectangle over the correct location, and leaves the score unchanged.

After each guess, the quiz moves to the next location. Once all five locations have been answered, the app displays the user's final score.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/gtech29/comp484-project5.git
```

Open the project folder:

```bash
cd comp484-project5
```

Add your Google Maps API key in `script.js` by replacing the placeholder value:

```js
key: "YOUR_API_KEY_HERE"
```

Run the project using a local server, such as the Live Server extension in Visual Studio Code.

Open the local URL in your browser. For example:

```text
http://127.0.0.1:5500/index.html
```

## Project Structure

```text
comp484-project5/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Author

Juan C. Rodriguez - CSUN COMP484
