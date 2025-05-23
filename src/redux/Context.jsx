import React, { createContext, use, useState } from 'react'
export const mya = createContext()
const Context = ({children}) => {
    const [state, setState] = useState(false)
    const [userPermissions, setUserPermissions] = useState([])
  return (
    <mya.Provider value={{state, setState,userPermissions, setUserPermissions}}>
        {children}
    </mya.Provider>
  )
}

export default Context