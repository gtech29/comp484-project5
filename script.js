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
  },
  {
    name: "Charles H. Noski Auditorium",
    grid: "C5",
  },
  {
    name: "Bookstein Hall",
    grid: "C5",
  },
  {
    name: "Arbor Grill",
    grid: "D5",
  },
];
let score = 0;
let currentQuestionIndex = 0;
const currentLocationDisplay = document.querySelector(".current-location");
const feedbackDisplay = document.querySelector("#feedback");
const scoreDisplay = document.querySelector("#score");
let answered = false;

// Google Maps
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

// load map
async function initMap() {
  await google.maps.importLibrary("maps");
  await customElements.whenDefined("gmp-map");
  const mapElement = document.querySelector("gmp-map");

  // get inner map
  const map = mapElement.innerMap;

  // lock map movement
  map.setOptions({
    gestureHandling: "none",
    zoomControl: false,
    disableDefaultUI: true,
    keyboardShortcuts: false,
  });

  // get latitude and longitude when user double-clicks
  const doubleClick = map.addListener("dblclick", function (e) {
    const latitude = e.latLng.lat();
    const longitude = e.latLng.lng();
    //check if current location has already been answered
    if (answered) {
      feedbackDisplay.textContent = "You already answered this section";
    } else if (
      latitude <= csunLocations[currentQuestionIndex].north &&
      latitude >= csunLocations[currentQuestionIndex].south &&
      longitude <= csunLocations[currentQuestionIndex].east &&
      longitude >= csunLocations[currentQuestionIndex].west
    ) {
      feedbackDisplay.textContent = "Correct!";
      scoreDisplay.textContent = `Score: ${++score}/${csunLocations.length}`;
      answered = true;
    } else {
      feedbackDisplay.textContent = "Sorry, wrong location";
      answered = true;
    }
  });

  console.log("Google Map loaded successfully.");
}

initMap().catch((error) => {
  console.error("Google Map failed to load:", error);
});
/////////////////////////////////////////
/////          Tracker 1            /////
/////////////////////////////////////////
// This tracker needs to determine Which location/question should the side panel ask the user to find right now?
// start on the first location: Santa Susana Hall
// after the user makes a guess the app moves to the next question/location and so on.
// keep going until all five locations are finished

function updateSidePanel() {
  const currentLocation = csunLocations[currentQuestionIndex];
  currentLocationDisplay.textContent = currentLocation.name;
  feedbackDisplay.textContent = "";
  scoreDisplay.textContent = `Score: ${score}/${csunLocations.length}`;
}
updateSidePanel();
/////////////////////////////////////////
/////          Tracker 2            /////
/////////////////////////////////////////
// This tracker calculates and keeps track of the score,
// it starts at 0/5 and if the answer is right then add 1 to the score
// if the answer is incorrect the score stays the same
// show total score at the end
