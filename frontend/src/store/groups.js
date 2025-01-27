import { csrfFetch } from "./csrf";
// import { deleteAllEvents } from "./events";

export const LOAD_GROUPS = "groups/loadGroups";
export const LOAD_GROUP_DETAILS = "groups/loadGroupDetails";
export const LOAD_GROUP_EVENTS = "groups/loadGroupEvents";
export const CREATE_GROUP = "groups/createGroup";
export const ADD_GROUP_IMAGE = "groups/addGroupImage";
export const UPDATE_GROUP = "groups/updateGroup";
export const DELETE_GROUP = "groups/deleteGroup";
export const LOAD_MEMBERS = "groups/loadMembers";

export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const loadGroupDetails = (group) => ({
  type: LOAD_GROUP_DETAILS,
  group,
});

export const loadGroupEvents = (groupId, events) => ({
  type: LOAD_GROUP_EVENTS,
  groupId,
  events,
});

export const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

export const addGroupImage = (groupId, image) => ({
  type: ADD_GROUP_IMAGE,
  groupId,
  image,
});

export const updateGroup = (groupId, group) => ({
  type: UPDATE_GROUP,
  groupId,
  group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

export const loadMembers = (groupId, members) => ({
  type: LOAD_MEMBERS,
  groupId,
  members,
});

export const loadGroupsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const groups = await response.json();
  dispatch(loadGroups(groups));
};

export const loadGroupDetailsThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const group = await response.json();
  dispatch(loadGroupDetails(group));
  return group;
};

export const loadGroupEventsThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const events = await response.json();
    dispatch(loadGroupEvents(groupId, events));
    return events;
  } else {
    const err = await response.json();
    return err;
  }
};

export const createGroupThunk = (group) => async (dispatch) => {
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
    const err = await response.json();
    return err;
  }
};

export const addGroupImageThunk = (groupId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
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
    dispatch(addGroupImage(groupId, newImage));
    return newImage;
  } else {
    throw response;
  }
};

export const updateGroupThunk = (groupId, group) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const updatedGroup = await response.json();
    dispatch(updateGroup(groupId, updatedGroup));
    return updatedGroup;
  } else {
    const error = await response.json();
    return error;
  }
};

export const deleteGroupThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const msg = await response.json();
    // await group.Events.forEach((event) => {
    //   dispatch(deleteAllEvents(event.id));
    // });
    dispatch(deleteGroup(groupId));
    return msg;
  } else {
    const error = await response.json();
    return error;
  }
};

export const loadMembersThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`);
  if (response.ok) {
    const members = await response.json();
    dispatch(loadMembers(groupId, members));
    return members;
  } else {
    const error = await response.json();
    return error;
  }
};

const groupReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS: {
      const groupState = { ...state };
      action.groups.Groups.forEach((group) => {
        groupState[group.id] = { ...state[group.id], ...group };
      });
      return groupState;
    }
    case LOAD_GROUP_DETAILS: {
      const groupState = { ...state };
      groupState[action.group.id] = {
        ...state[action.group.id],
        ...action.group,
      };
      return groupState;
    }
    case LOAD_GROUP_EVENTS: {
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Events: action.events.Events,
        },
      };
    }
    case LOAD_MEMBERS: {
      const Members = {};
      action.members.Members.forEach((member) => {
        Members[member.id] = member;
      });
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Members,
        },
      };
    }
    case CREATE_GROUP: {
      const groupState = { ...state };
      groupState[action.group.id] = action.group;
      return groupState;
    }
    case ADD_GROUP_IMAGE: {
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          GroupImages: [...state[action.groupId].GroupImages, ...action.image],
        },
      };
    }
    case UPDATE_GROUP: {
      const groupState = { ...state };
      groupState[action.groupId] = {
        ...groupState[action.groupId],
        ...action.group,
      };
      return groupState;
    }
    case DELETE_GROUP: {
      const groupState = { ...state };
      delete groupState[action.groupId];
      return groupState;
    }
    default:
      return state;
  }
};

export default groupReducer;
