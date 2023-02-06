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
  return (
    <Fragment>
      <Space direction="vertical" className="w-100">
        <div className="collapse-custom-field">
          {listContractType.map((item, index) => {
            return (
              <Fragment key={`contact_item_${index}`}>
                <ContractTypeItem
                  contractType={item}
                  handleModal={handleModal}
                  setModalData={setModalData}
                  loadTabContent={loadTabContent}
                />
              </Fragment>
            )
          })}
        </div>
      </Space>
    </Fragment>
  )
}

export default ListContractType
