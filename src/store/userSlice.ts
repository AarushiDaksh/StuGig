import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/types/User"; 
interface UserState {
  currentUser: UserType | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccessful(state, action: PayloadAction<UserType>) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { loginSuccessful, logout } = userSlice.actions;
export default userSlice.reducer;
