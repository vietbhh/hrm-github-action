// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Space, Collapse } from "antd"
// ** Components
import ContractTypeItem from "./ContractTypeItem"

const ListContractType = (props) => {
  const {
    // ** props
    listContractType,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  // ** render
  const renderContractTypeItem = (item) => {
    return (
      <ContractTypeItem
        contractType={item}
        handleModal={handleModal}
        setModalData={setModalData}
        loadTabContent={loadTabContent}
      />
    )
  }

  return (
    <Fragment>
      <Space direction="vertical" className="w-100">
        <div className="collapse-custom-field">
          {listContractType.map((item, index) => {
            return (
              <Fragment key={`contact_item_${index}`}>
                {renderContractTypeItem(item)}
              </Fragment>
            )
          })}
        </div>
      </Space>
    </Fragment>
  )
}

export default ListContractType
