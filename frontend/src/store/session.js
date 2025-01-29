import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const LOAD_USER_GROUPS = "session/loadUserGroups";
const LOAD_USER_EVENTS = "session/loadUserEvents";
const LOAD_USER_GROUP_EVENTS = "session/loadUserGroupEvents";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

const loadUserGroups = (groups) => {
  return {
    type: LOAD_USER_GROUPS,
    groups,
  };
};

const loadUserEvents = (events) => {
  return {
    type: LOAD_USER_EVENTS,
    events,
  };
};

const loadUserGroupEvents = (groupId, events) => {
  return {
    type: LOAD_USER_GROUP_EVENTS,
    groupId,
    events,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

export const loadUserGroupsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups/current");

  if (res.ok) {
    const groups = await res.json();
    dispatch(loadUserGroups(groups));
    return groups;
  } else {
    const err = await res.json();
    return err;
  }
};

export const loadUserEventsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/events/current");

  if (res.ok) {
    const events = await res.json();
    dispatch(loadUserEvents(events));
    return events;
  } else {
    const err = await res.json();
    return err;
  }
};

export const loadUserGroupEventsThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`);

  if (res.ok) {
    const events = await res.json();
    dispatch(loadUserGroupEvents(groupId, events));
    return events;
  } else {
    const err = await res.json();
    return err;
  }
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case LOAD_USER_GROUPS: {
      const Groups = {};
      action.groups.Groups.forEach((group) => {
        Groups[group.id] = group;
      });
      return { ...state, user: { ...state.user, Groups } };
    }
    case LOAD_USER_EVENTS: {
      const ownedEvents = {};
      const attendingEvents = {};
      action.events.ownedEvents.forEach((event) => {
        ownedEvents[event.id] = event;
      });
      action.events.attendingEvents.forEach((event) => {
        attendingEvents[event.id] = event;
      });
      return {
        ...state,
        user: {
          ...state.user,
          Events: {
            ownedEvents,
            attendingEvents,
          },
        },
      };
    }
    case LOAD_USER_GROUP_EVENTS: {
      const userState = {
        ...state,
        user: {
          ...state.user,
          Groups: {
            ...state.user.Groups,
            [action.groupId]: {
              ...state.user.Groups[action.groupId],
              ...action.events,
            },
          },
        },
      };
      return userState;
    }
    default:
      return state;
  }
};

export default sessionReducer;
