import React, { createContext, use, useState } from 'react'
export const mya = createContext()
const Context = ({children}) => {
    const [state, setState] = useState(false)
  return (
    <mya.Provider value={{state, setState}}>
        {children}
    </mya.Provider>
  )
}

export default Context
