// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { ErpSelect } from "@apps/components/common/ErpField"

const ChosenShareUserItem = (props) => {
  const {
    // ** props
    item,
    methods,
    // ** methods
    setChosenUser
  } = props

  const options = [
    {
      value: "view_only",
      label: useFormatMessage("modules.drive.text.view_only")
    },
    {
      value: "editable",
      label: useFormatMessage("modules.drive.text.editable")
    }
  ]

  let defaultValue = options[0]
  if (item?.share_permission) {
    const [defaultValueTemp] = options.filter((itemOptions) => {
      return itemOptions.value === item.share_permission
    })

    defaultValue = defaultValueTemp
  }

  const handleChangeSharePermission = (value, index) => {
    methods.setValue(`share-permission-${index}`, value)
    const newItem = { ...item, share_permission: value?.value }
    setChosenUser(newItem)
  }

  // ** render
  const renderComponent = () => {
    if (item.with_modules_option_type === "offices") {
      return (
        <Fragment>
          <div className="mb-1 mt-50 d-flex align-item-center justify-content-between chosen-share-user-item">
            <div className="d-flex align-items-center">
              <div className="me-50">
                <div className="d-flex align-items-center justify-content-center me-50 drive-rounded-icon drive-rounded-icon-lg"></div>
              </div>
              <div>
                <p className="mb-0">{item.name}</p>
                <small>{item.with_modules_option_type}</small>
              </div>
            </div>
            <div className="w-50">
              <ErpSelect
                name={`share-permission-${item.with_modules_option_type}-${item.id}`}
                nolabel={true}
                options={options}
                defaultValue={defaultValue}
                useForm={methods}
                onChange={(value) =>
                  handleChangeSharePermission(value, `${item.with_modules_option_type}-${item.id}`)
                }
                isClearable={false}
              />
            </div>
          </div>
        </Fragment>
      )
    }

    if (item.with_modules_option_type === "departments") {
      return (
        <Fragment>
          <div className="mb-1 mt-50 d-flex align-item-center justify-content-between chosen-share-user-item">
            <div className="d-flex align-items-center">
              <div className="me-50">
                <div className="d-flex align-items-center justify-content-center me-50 drive-rounded-icon drive-rounded-icon-lg"></div>
              </div>
              <div>
                <p className="mb-0">{item.name}</p>
                <small>{item.with_modules_option_type}</small>
              </div>
            </div>
            <div className="w-50">
              <ErpSelect
                name={`share-permission-${item.with_modules_option_type}-${item.id}`}
                nolabel={true}
                options={options}
                defaultValue={defaultValue}
                useForm={methods}
                onChange={(value) =>
                  handleChangeSharePermission(value, `${item.with_modules_option_type}-${item.id}`)
                }
                isClearable={false}
              />
            </div>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div className="mb-1 mt-50 d-flex align-item-center justify-content-between chosen-share-user-item">
          <div className="d-flex align-items-center">
            <div className="me-50">
              <Avatar src={item.icon} />
            </div>
            <div>
              <p className="mb-0">{item.full_name}</p>
              <small>{item.email}</small>
            </div>
          </div>
          <div className="w-50">
            <ErpSelect
              name={`share-permission-users-${item.id}`}
              nolabel={true}
              options={options}
              defaultValue={defaultValue}
              useForm={methods}
              onChange={(value) => handleChangeSharePermission(value, `user-${item.id}`)}
              isClearable={false}
            />
          </div>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ChosenShareUserItem
