import { useLayoutEffect } from "react"

const ItemTest = (props) => {
  const {
    // ** props
    index,
    item
    // ** methods
  } = props


  return <div style={{height: "300px"}}>{item.full_name}</div>
}

export default ItemTest
