import {
  clearToast,
  handleToast,
  showToast
} from '../pages/redux/slice/toastSlice'

export const customToast = async (dispatch, payload) => {
  const data = {
    message: payload?.data?.message,
    status: payload?.status
  }

  await dispatch(
    showToast({
      ...data
    })
  )
  await dispatch(handleToast())

  setTimeout(() => {
    dispatch(clearToast())
  }, 6000)
}
