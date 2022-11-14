// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Space, Collapse } from "antd"
// ** Components
import CustomFieldItem from "./CustomFieldItem"

const ListCustomField = (props) => {
  const {
    // ** props
    listCustomField,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  // ** render
  const renderCustomFieldItem = (item) => {
    return (
      <CustomFieldItem
        customField={item}
        handleModal={handleModal}
        setModalData={setModalData}
        loadTabContent={loadTabContent}
      />
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <Space direction="vertical" className="w-100">
          <div className="collapse-custom-field">
            {listCustomField.map((item, index) => {
              return (
                <Fragment key={`custom_field_item_${index}`}>
                  {renderCustomFieldItem(item)}
                </Fragment>
              )
            })}
          </div>
        </Space>
      </Fragment>
    )
  }
  return <Fragment>{renderComponent()}</Fragment>
}

export default ListCustomField
