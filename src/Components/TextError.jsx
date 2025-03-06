import React from 'react'

function TextError(props) {
  return (
    <div
      className='text-red-500
'
    >
      {/* // <div className={`${props.customclass} text-danger` || "text-danger"}> */}
      {props?.children}
    </div>
  )
}

export default TextError
