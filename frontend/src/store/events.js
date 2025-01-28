import { csrfFetch } from "./csrf";

export const LOAD_EVENTS = "events/loadEvents";
export const LOAD_EVENT_DETAILS = "events/loadEventDetails";
export const CREATE_EVENT = "events/createEvent";
export const ADD_EVENT_IMAGE = "events/addEventImage";
export const UPDATE_EVENT = "events/updateEvent";
export const DELETE_EVENT = "events/deleteEvent";
export const DELETE_ALL_EVENTS = "events/deleteAllEvents";

export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const loadEventDetails = (event) => ({
  type: LOAD_EVENT_DETAILS,
  event,
});

export const createEvent = (event) => ({
  type: CREATE_EVENT,
  event,
});

export const addEventImage = (eventId, image) => ({
  type: ADD_EVENT_IMAGE,
  eventId,
  image,
});

export const updateEvent = (eventId, event) => ({
  type: UPDATE_EVENT,
  eventId,
  event,
});

export const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

export const deleteAllEvents = (eventId) => ({
  type: DELETE_ALL_EVENTS,
  eventId,
});

export const loadEventsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");
  const events = await response.json();
  if (response.ok) {
    dispatch(loadEvents(events.Events));
  }
};

export const loadEventDetailsThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  const event = await response.json();
  if (response.ok) {
    dispatch(loadEventDetails(event));
  }
};

export const createEventThunk = (groupId, event) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  if (response.ok) {
    const newEvent = await response.json();
    dispatch(createEvent(newEvent));
    return newEvent;
  } else {
    throw response;
  }
};

export const addEventImageThunk = (eventId, image) => async (dispatch) => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    const eventImage = await response.json();
    dispatch(addEventImage(eventId, eventImage));
    return eventImage;
  } else {
    throw response;
  }
};

export const updateEventThunk = (eventId, event) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  if (response.ok) {
    const updatedEvent = await response.json();
    dispatch(updateEvent(eventId, updatedEvent));
    return updatedEvent;
  } else {
    const error = await response.json();
    return error;
  }
};

export const deleteEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const msg = await response.json();
    dispatch(deleteEvent(eventId));
    return msg;
  } else {
    const error = await response.json();
    return error;
  }
};

const eventReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS: {
      const eventState = { ...state };
      action.events.forEach((event) => {
        if (!eventState[event.id]) {
          eventState[event.id] = event;
        }
      });
      return eventState;
    }
    case LOAD_EVENT_DETAILS: {
      const eventState = { ...state };
      eventState[action.event.id] = action.event;
      return eventState;
    }
    case CREATE_EVENT: {
      const eventState = { ...state };
      eventState[action.event.id] = action.event;
      return eventState;
    }
    case ADD_EVENT_IMAGE: {
      if (state[action.eventId].EventImages) {
        return {
          ...state,
          [action.eventId]: {
            ...state[action.eventId],
            EventImages: [...state[action.eventId].EventImages, action.image],
          },
        };
      } else {
        return {
          ...state,
          [action.eventId]: {
            ...state[action.eventId],
            EventImages: [action.image],
          },
        };
      }
    }
    case UPDATE_EVENT: {
      const eventState = { ...state };
      eventState[action.eventId] = {
        ...eventState[action.eventId],
        ...action.event,
      };
      return eventState;
    }
    case DELETE_EVENT: {
      const eventState = { ...state };
      delete eventState[action.eventId];
      return eventState;
    }
    case DELETE_ALL_EVENTS: {
      const eventState = { ...state };
      delete eventState[action.eventId];
      return eventState;
    }
    default:
      return state;
  }
};

export default eventReducer;
