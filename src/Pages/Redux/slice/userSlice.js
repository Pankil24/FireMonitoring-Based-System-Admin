import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: null,
  pageAccess: null,
  userToken: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action?.payload?.userInfo
      state.pageAccess = action?.payload?.pageAccess
      state.userToken = action?.payload?.userToken
    },
    logout: () => {
      return initialState
    }
  }
})

export const { setUserInfo, logout } = userSlice.actions

export default userSlice.reducer
