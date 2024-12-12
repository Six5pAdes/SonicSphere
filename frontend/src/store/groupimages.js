import { csrfFetch } from "./csrf";

const CREATE_GROUP_IMAGE = "groupImages/CREATE_GROUP_IMAGE";

const createGroupImage = (groupId, image) => {
  return {
    type: CREATE_GROUP_IMAGE,
    groupId,
    image,
  };
};

export const thunkCreateGroupImage = (groupId, image) => async (dispatch) => {
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
    const image = await response.json();
    dispatch(createGroupImage(groupId, image));
    return image;
  } else {
    return await response.json();
  }
};

const initialState = {};

export default function groupImageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_GROUP_IMAGE: {
      const newState = { ...state };
      if (!newState[action.groupId]) {
        newState[action.groupId] = {};
      }
      newState[action.groupId][action.image.id] = action.image;
      return newState;
    }
    default:
      return state;
  }
}
