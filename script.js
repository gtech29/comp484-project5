// Stores all quiz locations and their rectangular map boundaries.
// Each location has a name, grid label, and north/south/east/west bounds.
const csunLocations = [
  {
    name: "Santa Susana Hall",
    grid: "D2",
    north: 34.23785689046657,
    south: 34.23736342650573,
    east: -118.52915965340996,
    west: -118.52942527889772,
  },
  {
    name: "C.R. Johnson Auditorium",
    grid: "D5",
    north: 34.24169719660752,
    south: 34.241284676700964,
    east: -118.52874118123677,
    west: -118.52914143042558,
  },
  {
    name: "Charles H. Noski Auditorium",
    grid: "C5",
    north: 34.24236930514472,
    south: 34.242113256145174,
    east: -118.53113359999668,
    west: -118.5314381602808,
  },
  {
    name: "Bookstein Hall",
    grid: "C5",
    north: 34.24243259361179,
    south: 34.24141191302149,
    east: -118.53007829053918,
    west: -118.53107738510377,
  },
  {
    name: "Arbor Grill",
    grid: "D5",
    north: 34.2413176141375,
    south: 34.241036243056115,
    east: -118.52955305397798,
    west: -118.52979342989467,
  },
];

// Tracks the user's current score, current question, and quiz state.
let score = 0;
let currentQuestionIndex = 0;
let answered = false;
let gameComplete = false;

// Connects JavaScript to the side panel elements so the page can update dynamically.
const currentLocationDisplay = document.querySelector(".current-location");
const feedbackDisplay = document.querySelector("#feedback");
const scoreDisplay = document.querySelector("#score");

// Loads the Google Maps JavaScript API.
((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;

  b = b[c] || (b[c] = {});

  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");

        for (k in g) {
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k],
          );
        }

        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));

  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyDirjh69Fd4mc1C9IXSP1zbN3jqqH3qcUE",
  v: "weekly",
});

// Returns the location object for the current question.
function getCurrentLocation() {
  return csunLocations[currentQuestionIndex];
}

// Updates the score text in the side panel.
function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}/${csunLocations.length}`;
}

// Updates the side panel with the current location and current score.
function updateSidePanel() {
  const currentLocation = getCurrentLocation();

  currentLocationDisplay.textContent = currentLocation.name;
  feedbackDisplay.textContent = "";
  updateScoreDisplay();
}

// Checks whether the user's double-click is inside the current location's rectangle.
function isClickInsideLocation(latitude, longitude, location) {
  return (
    latitude <= location.north &&
    latitude >= location.south &&
    longitude <= location.east &&
    longitude >= location.west
  );
}

// Draws the correct location area on the map.
// Green means the user's guess was correct.
// Red means the user's guess was incorrect.
function drawLocationRectangle(map, location, isCorrect) {
  const rectangleColor = isCorrect ? "#008000" : "#ff0000";

  new google.maps.Rectangle({
    strokeColor: rectangleColor,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: rectangleColor,
    fillOpacity: 0.35,
    map: map,
    bounds: {
      north: location.north,
      south: location.south,
      east: location.east,
      west: location.west,
    },
  });
}

// Moves the quiz to the next location after a short delay.
// If there are no locations left, the quiz ends and shows the final score.
function moveToNextQuestion() {
  setTimeout(function () {
    if (currentQuestionIndex < csunLocations.length - 1) {
      currentQuestionIndex++;
      answered = false;
      updateSidePanel();
    } else {
      gameComplete = true;
      currentLocationDisplay.textContent = "Finished";
      feedbackDisplay.textContent = "Quiz complete!";
      scoreDisplay.textContent = `Final Score: ${score}/${csunLocations.length}`;
    }
  }, 1500);
}

// Initializes the Google Map after the Maps library has loaded.
async function initMap() {
  await google.maps.importLibrary("maps");
  await customElements.whenDefined("gmp-map");

  const mapElement = document.querySelector("gmp-map");

  // Gets the actual Google Map object from the gmp-map element.
  const map = mapElement.innerMap;

  // Locks the map so the user cannot pan, zoom, or use keyboard movement.
  map.setOptions({
    gestureHandling: "none",
    zoomControl: false,
    disableDefaultUI: true,
    keyboardShortcuts: false,
  });

  // Handles the user's double-click guess on the map.
  map.addListener("dblclick", function (e) {
    // Prevents guesses after the quiz is finished.
    if (gameComplete) {
      feedbackDisplay.textContent = "The quiz is already complete.";
      return;
    }

    // Prevents the user from answering the same question more than once.
    if (answered) {
      feedbackDisplay.textContent = "You already answered this section.";
      return;
    }

    // Gets the latitude and longitude of the user's double-click.
    const latitude = e.latLng.lat();
    const longitude = e.latLng.lng();

    // Gets the current location being asked in the quiz.
    const currentLocation = getCurrentLocation();

    // Determines whether the user's guess is inside the correct rectangle.
    const isCorrect = isClickInsideLocation(
      latitude,
      longitude,
      currentLocation,
    );

    // Draws the correct location area in green or red.
    drawLocationRectangle(map, currentLocation, isCorrect);

    // Updates feedback and score based on the user's answer.
    if (isCorrect) {
      feedbackDisplay.textContent = "Correct!";
      score++;
      updateScoreDisplay();
    } else {
      feedbackDisplay.textContent = "Sorry, wrong location.";
    }

    // Marks the current question as answered and moves forward.
    answered = true;
    moveToNextQuestion();
  });

  console.log("Google Map loaded successfully.");
}

// Starts the map and reports any loading errors.
initMap().catch((error) => {
  console.error("Google Map failed to load:", error);
});

// Displays the starting location and starting score when the page first loads.
updateSidePanel();
