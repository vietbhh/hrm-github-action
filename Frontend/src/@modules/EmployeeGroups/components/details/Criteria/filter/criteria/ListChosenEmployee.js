// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const ListChosenEmployee = (props) => {
  const {
    // ** props
    filter,
    filterKey,
    listEmployee,
    // ** methods
    setFilter
  } = props

  const handleRemoveExceptEmployee = (employeeId) => {
    const newFilter = {...filter}
    const newFilterKey = [...newFilter[filterKey]]

    const newEmployeeExcept = newFilterKey.filter((item) => {
        return item.id !== employeeId
    })

    newFilter[filterKey] = newEmployeeExcept
    setFilter(newFilter)
  }

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        {listEmployee.map((item, index) => {
          return (
            <div className="d-flex  mb-2 justify-content-between" key={`except-employee-${index}`}>
              <div className="d-flex">
                <div className="me-50">
                  <Avatar src={item.icon} imgHeight="28" imgWidth="28" />
                </div>
                <div className="d-flex align-items-center">
                  <p className="mb-0 me-1">{item.full_name}</p>
                  <small>{item.email}</small>
                </div>
              </div>
              <div className="me-25">
                <Button.Ripple size="sm" color="flat-primary" onClick={() => handleRemoveExceptEmployee(item.id)}>
                    <i className="fal fa-trash-alt" />
                </Button.Ripple>
              </div>
            </div>
          )
        })}
      </Fragment>
    )
  }

  return <div>{renderComponent()}</div>
}

export default ListChosenEmployee
