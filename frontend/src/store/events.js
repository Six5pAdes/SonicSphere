import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const GET_EVENTS = "events/GET_EVENTS";
const GET_GROUP_EVENTS = "events/GET_GROUP_EVENTS";
const GET_ONE_EVENT = "events/GET_ONE_EVENT";
const GET_USER_EVENTS = "events/GET_USER_EVENTS";
const CREATE_EVENT = "events/CREATE_EVENT";
const CREATE_EVENT_IMAGE = "events/CREATE_EVENT_IMAGE";
const DELETE_EVENT = "events/DELETE_EVENT";

// Define Action Creators
const getEvents = (events) => {
  return {
    type: GET_EVENTS,
    events,
  };
};
const getGroupEvents = (groupId, events) => {
  return {
    type: GET_GROUP_EVENTS,
    groupId,
    events,
  };
};
const getOneEvent = (event) => {
  return {
    type: GET_ONE_EVENT,
    event,
  };
};
const getUserEvents = (events) => {
  return {
    type: GET_USER_EVENTS,
    events,
  };
};
const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};
const createEventImage = (eventId, image) => {
  return {
    type: CREATE_EVENT_IMAGE,
    eventId,
    image,
  };
};
const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId,
  };
};

// Define Thunks
export const thunkGetEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const events = await response.json();
    dispatch(getEvents(events.Events));
    return events.Events;
  } else {
    return await response.json();
  }
};

export const thunkGetGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const events = await response.json();
    dispatch(getGroupEvents(groupId, events.Events));
    return events.Events;
  } else {
    return await response.json();
  }
};

export const thunkGetOneEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  if (response.ok) {
    const event = await response.json();
    const groupId = event.groupId;
    const data = await csrfFetch(`/api/groups/${groupId}`);
    const group = await data.json();
    event.Group = group;
    dispatch(getOneEvent(event));
    return event;
  } else {
    return await response.json();
  }
};

export const thunkGetUserEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events/current");
  const events = await response.json();
  if (response.status !== 200) return console.log(response);
  dispatch(getUserEvents(events));
};

export const thunkCreateEvent = (event, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const newEvent = await response.json();
    const groupId = newEvent.groupId;
    const data = await csrfFetch(`/api/groups/${groupId}`);
    const group = await data.json();
    newEvent.Group = group;
    dispatch(createEvent(newEvent));
    return newEvent;
  } else {
    return await response.json();
  }
};

export const thunkCreateEventImage = (eventId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: image,
      preview: true,
    }),
  });

  if (response.ok) {
    const newImage = await response.json();
    dispatch(createEventImage(eventId, newImage));
    return newImage;
  } else {
    return await response.json();
  }
};

export const thunkUpdateEvent = (event, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const updatedEvent = await response.json();
    dispatch(getOneEvent(updatedEvent));
    return updatedEvent;
  } else {
    return await response.json();
  }
};

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  await dispatch(thunkGetEvents());

  if (response.ok) {
    dispatch(deleteEvent(eventId));
  } else {
    return await response.json();
  }
};

const selectEvents = (state) => {
  return state.events.All;
};
export const selectEventsArray = createSelector(selectEvents, (events) => {
  return Object.values(events);
});

const initialState = { Past: {}, Upcoming: {}, Events: {}, All: {} };

export default function eventsReducer(state = { ...initialState }, action) {
  switch (action.type) {
    case GET_EVENTS: {
      const newState = { ...state, All: { ...state.All } };
      const events = action.events.sort((a, b) => {
        const aTime = new Date(a.startDate).getTime();
        const bTime = new Date(b.startDate).getTime();
        if (aTime < bTime) {
          return 1;
        } else if (aTime > bTime) {
          return -1;
        } else return 0;
      });
      events.forEach((event) => {
        newState.All[event.id] = event;
      });
      return newState;
    }
    case GET_GROUP_EVENTS: {
      const newState = {
        Past: { ...state.Past },
        Upcoming: { ...state.Upcoming },
        Events: { ...state.Events },
        All: { ...state.All },
      };
      if (action.events.length) {
        newState.Events[action.groupId] = action.events;
      } else {
        newState.Events[action.groupId] = [];
      }
      newState.Upcoming[action.groupId] = [];
      newState.Past[action.groupId] = [];
      const events = action.events.sort((a, b) => {
        const aTime = new Date(a.startDate).getTime();
        const bTime = new Date(b.startDate).getTime();
        if (aTime < bTime) {
          return 1;
        } else if (aTime > bTime) {
          return -1;
        } else return 0;
      });
      events.forEach((event) => {
        const today = new Date().getTime();
        const startDate = new Date(event.startDate).getTime();
        today > startDate
          ? newState.Past[action.groupId].push(event)
          : newState.Upcoming[action.groupId].push(event);
      });
      return newState;
    }
    case GET_ONE_EVENT: {
      const newState = {
        Past: { ...state.Past },
        Upcoming: { ...state.Upcoming },
        Events: { ...state.Events },
        All: { ...state.All },
      };
      newState.All[action.event.id] = action.event;
      return newState;
    }
    case GET_USER_EVENTS: {
      const userEventsState = {};
      action.events.forEach((event) => {
        userEventsState[event.id] = event;
      });
      return userEventsState;
    }
    case CREATE_EVENT: {
      const newState = {
        Past: { ...state.Past },
        Upcoming: { ...state.Upcoming },
        Events: { ...state.Events },
        All: { ...state.All },
      };
      newState.All[action.event.id] = action.event;
      return newState;
    }
    case DELETE_EVENT: {
      const newState = {
        Past: { ...state.Past },
        Upcoming: { ...state.Upcoming },
        Events: { ...state.Events },
        All: { ...state.All },
      };
      delete newState.All[action.eventId];
      delete newState.Past[action.eventId];
      delete newState.Upcoming[action.eventId];
      return newState;
    }
    case CREATE_EVENT_IMAGE: {
      const newState = {
        Past: { ...state.Past },
        Upcoming: { ...state.Upcoming },
        Events: { ...state.Events },
        All: { ...state.All },
      };
      return newState;
    }
    default:
      return state;
  }
}
