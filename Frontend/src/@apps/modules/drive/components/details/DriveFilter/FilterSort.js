// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** redux
import { useDispatch } from "react-redux"
import { setFilter } from "@apps/modules/drive/common/reducer/drive"
// ** Styles
import { Input, Dropdown, Menu } from "antd"
// ** Components

const FilterSort = (props) => {
  const {
    // ** props
    filter
    // ** render
  } = props

  const [state, setState] = useMergedState({
    openFilter: false
  })

  const dispatch = useDispatch()

  const filterItem = [
    {
      label: "due_date",
      value: "due_date"
    },
    {
      label: "name",
      value: "name"
    },
    {
      label: "type",
      value: "type"
    },
    {
      label: "size",
      value: "size"
    }
  ]

  const handleClickAddonAfter = () => {
    setState({
      openFilter: !state.openFilter
    })
  }

  const handleChangeSort = (value) => {
    const newFilter = {
      ...filter,
      sort: value
    }
    dispatch(setFilter(newFilter))

    setState({
      openFilter: !state.openFilter
    })
  }

  // ** render
  const menu = (
    <Menu>
      {filterItem.map((item, index) => {
        return (
          <Menu.Item
            key={`item-menu-filter-sort-${index}`}
            onClick={() => handleChangeSort(item)}>
            {useFormatMessage(`modules.drive.text.filter_drive.${item.label}`)}
          </Menu.Item>
        )
      })}
    </Menu>
  )

  return (
    <Fragment>
      <Dropdown
        overlay={menu}
        placement="bottom"
        trigger="click"
        overlayClassName="dropdown-filter-sort-drive"
        visible={state.openFilter}>
        <div className="d-flex align-items-center input-filter-drive">
          <div className="d-flex align-items-center h-100 text-filter-drive-container">
            <p className="me-50 mb-0 sort-by-text">
              {useFormatMessage("modules.drive.text.sort_by")} :
            </p>
            <p className="mb-0 mt-0 sort-content">
              {useFormatMessage(
                `modules.drive.text.filter_drive.${filter.sort.label}`
              )}
            </p>
          </div>
          <div
            className="d-flex align-items-center justify-content-center h-100 icon-filter-drive-container"
            onClick={() => handleClickAddonAfter()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="10px"
              height="7px"
              viewBox="0 0 10 7"
              enableBackground="new 0 0 10 7"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="10"
                height="7"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHBAMAAADDgsFQAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAKlBMVEUAAACRkZySkpyTk5yS kp2RkZyTk5yPj5+Skp2UlJySkp2UlJySkp3///8pRJmnAAAADHRSTlMAb59vj8/PIN8fL1+ecyWy AAAAAWJLR0QN9rRh9QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMAgs3A2ZradoAAAAv SURBVAjXYxBSUlJSZrA5c+bMYQYWIOnAwBBz5hgDA0PFmU4gyXVmAZBksGZgAAAd+AwTZcVZuwAA ACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wMlQxMDo1NTowMyswMTowMDeaTC4AAAAldEVYdGRh dGU6bW9kaWZ5ADIwMjItMTItMDJUMTA6NTU6MDMrMDE6MDBGx/SSAAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
        </div>
      </Dropdown>
    </Fragment>
  )
}

export default FilterSort
