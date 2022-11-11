//** React Imports
import { useEffect } from "react"

// ** Store Imports
import { useDispatch, useSelector } from "react-redux"
import { handleLayout, handleLastLayout } from "@store/layout"
import { updateUserSetting } from "redux/api"

export const useLayout = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector((state) => state.layout)

  const setLayout = (value, saveDB = true) => {
    dispatch(handleLayout(value))
    if (saveDB) {
      updateUserSetting("layout", value)
    }
  }

  const setLastLayout = (value) => {
    dispatch(handleLastLayout(value))
  }

  if (window) {
    const breakpoint = 1200

    useEffect(() => {
      if (window.innerWidth < breakpoint) {
        setLayout("vertical", false)
      }

      window.addEventListener("resize", () => {
        if (
          window.innerWidth <= breakpoint &&
          store.lastLayout !== "vertical" &&
          store.layout !== "vertical"
        ) {
          setLayout("vertical", false)
        }
        if (
          window.innerWidth >= breakpoint &&
          store.lastLayout !== store.layout
        ) {
          setLayout(store.lastLayout, false)
        }
      })
    }, [store.layout])
  }

  return {
    layout: store.layout,
    setLayout,
    lastLayout: store.lastLayout,
    setLastLayout
  }
}
