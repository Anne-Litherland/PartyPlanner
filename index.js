/**
 * @typedef Event
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} imageUrl
 */
// === Constants
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2412-FTB-ET-WEB-AM";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let events = [];
let selectedEvent;

async function getEvents() {
  try {
    const response = await fetch(API);
    if (!response.ok) throw Error("Something went wrong :(");
    const result = await response.json();
    events = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

async function getEvent(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedEvent = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===
function EventListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `
        <a href="#selected">${event.name}</a>
    `;
  $li.addEventListener("click", () => getEvent(event.id));
  return $li;
}

function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("Events");

  const $events = events.map(EventListItem);
  $ul.replaceChildren(...$events);

  return $ul;
}

function EventDetails() {
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Please Select an event to learn more.";
    return $p;
  }

  const $event = document.createElement("section");
  const eventDate = new Date(selectedEvent.date);
  $event.classList.add("event");
  $event.innerHTML = `
        <h2>${selectedEvent.name} #${selectedEvent.id}</h2>
        <h3>${selectedEvent.location} ${eventDate.getFullYear()}-${
    eventDate.getMonth() + 1
  }-${eventDate.getDate()}</h3>
        <figure>
            <img alt=${selectedEvent.name} src=${selectedEvent.imageUrl} />
        </figure>
        <p>${selectedEvent.description}</p>
    `;
  return $event;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
        <h1>Fullstack Events</h1>
        <main>
            <section>
                <h2>Events</h2>
                <EventList></EventList>
            </section>
            <section id="selected">
                <h2>Event Details</h2>
                <EventDetails></EventDetails>
            </section>
        </main>
    `;
  $app.querySelector("EventList").replaceWith(EventList());
  $app.querySelector("EventDetails").replaceWith(EventDetails());
}

async function init() {
  await getEvents();
  render();
}

init();
