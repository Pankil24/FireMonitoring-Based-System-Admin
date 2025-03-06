import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
const initialState = {
  show: false,
  variant: '',
  message: ''
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      const { status, message } = action.payload
      state.show = true
      state.message = message ?? 'An error accoure'
      state.variant = status === 201 || status === 200 ? 'success' : 'error'
    },
    clearToast: (state) => {
      state.show = initialState.show
      state.variant = initialState.variant
      state.message = initialState.message
    }
  }
})

export const { showToast, clearToast } = toastSlice.actions
export default toastSlice.reducer

export function handleToast() {
  return async (dispatch, getState) => {
    const { variant, message } = await getState().toast
    toast[variant](message)
  }
}
