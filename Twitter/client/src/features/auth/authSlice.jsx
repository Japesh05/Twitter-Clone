import { createSlice, nanoid } from "@reduxjs/toolkit";

function formatDate(date) {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

const initialState = {
  email: "",
  isLoggedin: false,
  posts: [
    {
      postid: 1,
      tweet: "Welcome to Fwitter",
      id: 31,
      username: "Fwitter",
      createdOn: formatDate(new Date()),
      email: "nn@gmail.com",
      verified: true,
    },
  ],
  focus: false,
  username: "",
  id: 0
};

const authSlice = createSlice({
  name: "authInfo",
  initialState,
  reducers: {
    updateLogin: (state, action) => {
      state.isLoggedin = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    addPost: (state, action) => {
      const post = {
        postid: nanoid(),
        tweet: action.payload.tweet,
        id: action.payload.id,
        username: action.payload.username,
        createdOn: formatDate(new Date()),
        email: action.payload.email,
        verified: action.payload.verified,
      };
      state.posts.push(post);
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id != action.payload.id);
    },
    updateFocus: (state, action) => {
      state.focus = action.payload;
    },
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setId : (state, action) => {
      state.id = action.payload;
    }
  },
});

export const {
  updateEmail,
  updateLogin,
  addPost,
  removePost,
  updateFocus,
  setUserName,
  setId
} = authSlice.actions;
export default authSlice.reducer;
