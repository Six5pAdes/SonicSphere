import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

// Define Action Types as Constants
const GET_GROUPS = "groups/GET_GROUPS";
const GET_USER_GROUPS = "groups/GET_USER_GROUPS";
const GET_GROUP_BY_ID = "groups/GET_GROUP_BY_ID";
const CREATE_GROUP = "groups/CREATE_GROUP";
const DELETE_GROUP = "groups/DELETE_GROUP";

// Define Action Creators
const getGroups = (groups) => {
  return {
    type: GET_GROUPS,
    groups,
  };
};
const getUserGroups = (groups) => {
  return {
    type: GET_USER_GROUPS,
    groups,
  };
};
const getGroupById = (group) => {
  return {
    type: GET_GROUP_BY_ID,
    group,
  };
};
const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group,
  };
};
const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId,
  };
};

// Define Thunks
export const thunkGetGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const groups = await response.json();
    dispatch(getGroups(groups.Groups));
    return groups.Groups;
  } else {
    return await response.json();
  }
};

export const thunkGetUserGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups/current", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const groups = await response.json();
    dispatch(getUserGroups(groups.Groups));
    return groups.Groups;
  } else {
    return await response.json();
  }
};

export const thunkGetGroupById = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const group = await response.json();
    dispatch(getGroupById(group));
    return group;
  } else {
    return await response.json();
  }
};

export const thunkCreateGroup = (group) => async (dispatch) => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const newGroup = await response.json();
    dispatch(createGroup(newGroup));
    return newGroup;
  } else {
    return await response.json();
  }
};

export const thunkUpdateGroup = (group, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const updatedGroup = await response.json();
    dispatch(getGroupById(updatedGroup));
    return updatedGroup;
  } else {
    return await response.json();
  }
};

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteGroup(groupId));
  } else {
    return await response.json();
  }
};

const selectGroups = (state) => {
  return state.groups.Groups;
};
export const selectGroupsArray = createSelector([selectGroups], (groups) => {
  return Object.values(groups);
});

// Define an initial state
const initialState = { Groups: {} };

export default function groupsReducer(state = { ...initialState }, action) {
  switch (action.type) {
    case GET_GROUPS: {
      const newState = { ...state, Groups: { ...state.Groups } };
      action.groups.forEach((group) => {
        newState.Groups[group.id] = group;
      });
      return newState;
    }
    case GET_USER_GROUPS: {
      const newState = {
        ...state,
        Groups: { ...state.Groups, User: { ...action.groups } },
      };
      return newState;
    }
    case GET_GROUP_BY_ID: {
      const newState = { ...state, Groups: { ...state.Groups } };
      newState[action.group.id] = action.group;
      return newState;
    }
    case CREATE_GROUP: {
      const newState = { ...state, Groups: { ...state.Groups } };
      newState.Groups[action.group.id] = action.group;
      newState[action.group.id] = action.group;
      return newState;
    }
    case DELETE_GROUP: {
      const newState = { ...state, Groups: { ...state.Groups } };
      delete newState.Groups[action.groupId];
      delete newState[action.groupId];
      return newState;
    }
    default:
      return state;
  }
}
