// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
// ** Styles
import { List } from "antd"
import { Button } from "reactstrap"
import { X } from "react-feather"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const ListEmployeeChosen = (props) => {
  const {
    // ** props
    listEmployeeAdd,
    listEmployeeRemove,
    listEmployeeRemain,
    listEmployeeRemoveFromAdd,
    listEmployeeRemoveFromRemain,
    // ** methods
    setListEmployeeAdd,
    setListEmployeeRemove,
    setListEmployeeRemain,
    setListEmployeeRemoveFromRemain
  } = props

  const data = listEmployeeAdd.map((employee) => {
    return {
      value: employee.value,
      title: employee.full_name,
      full_name: employee.full_name,
      icon: employee.icon,
      email: employee.email,
      isEmployeeRemain: false
    }
  })

  listEmployeeRemain.map((employee) => {
    data.push({
      value: employee.value,
      title: employee.full_name,
      full_name: employee.full_name,
      icon: employee.icon,
      email: employee.email,
      isEmployeeRemain: true
    })
  })

  const handleRemoveEmployee = (item) => {
    if (item.isEmployeeRemain === false) {
      const newListEmployee = listEmployeeAdd.filter((employee) => {
        return parseInt(employee.value) !== parseInt(item.value)
      })
      setListEmployeeAdd(newListEmployee)
      if (
        listEmployeeRemoveFromAdd.some(
          (employee) => parseInt(employee.value) === parseInt(item.value)
        )
      ) {
        setListEmployeeRemove([...listEmployeeRemove, item])
      }
    } else {
      const newListEmployeeRemain = listEmployeeRemain.filter((employee) => {
        return employee.value !== item.value
      })
      setListEmployeeRemain(newListEmployeeRemain)
      setListEmployeeRemove([...listEmployeeRemove, item])
      setListEmployeeRemoveFromRemain([...listEmployeeRemoveFromRemain, item])
    }
  }

  // ** render
  const renderTitle = (item) => {
    return (
      <span>
        {item.title} <small>{item.email}</small>
      </span>
    )
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={renderTitle(item)}
            avatar={<Avatar className="my-0 me-0" size="sm" src={item.icon} />}
          />
          <div>
            <Button.Ripple
              className="btn-icon"
              color="flat-danger"
              size="sm"
              onClick={() => handleRemoveEmployee(item)}>
              <X size={13} />
            </Button.Ripple>
          </div>
        </List.Item>
      )}
    />
  )
}

export default ListEmployeeChosen
