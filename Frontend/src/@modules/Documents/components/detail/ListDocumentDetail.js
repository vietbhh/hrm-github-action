// ** React Imports
import { Fragment } from "react"
import { getDocumentMemoType } from "../../common/common"
import { useFormatMessage, addComma } from "@apps/utility/common"
import { NavLink as RRNavLink } from "react-router-dom"
// ** Styles
import { NavLink } from "reactstrap"
import { Folder } from "react-feather"
// ** Components
import { Table } from "rsuite"
import notification from "@apps/utility/notification"
import FileAction from "./FileAction"
import ListDocument from "./ListDocument"

const { Column, HeaderCell, Cell } = Table

const ListDocumentDetail = (props) => {
  const {
    // ** props
    loading,
    data,
    listFileUpload,
    options,
    moduleName,
    // ** methods
    setViewFileModal,
    setViewFileModalData,
    toggleAddModal,
    toggleShareModal,
    setModalData,
    setParentFolder,
    setLoading,
    loadData
  } = props

  const pathname = "/documents"
  const fileType = getDocumentMemoType()
  const isDocumentParent = listFileUpload.some(
    (item) => item.type === "document"
  )

  const handleClickFileName = (data) => {
    if (
      data.type === "image/jpeg" ||
      data.type === "image/jpg" ||
      data.type === "image/png"
    ) {
      setViewFileModal(true)
      setViewFileModalData(data)
    } else {
      notification.showWarning({
        text: useFormatMessage("modules.documents.text.not_support_file")
      })
    }
  }

  // ** render
  const FileNameCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.type === "document") {
      return (
        <Cell {...props}>
          <NavLink
            className="d-flex align-items-center"
            to={`${pathname}/${rowData.id}`}
            tag={RRNavLink}
            active={pathname.startsWith(`${pathname}/${rowData.id}`)}>
            <Folder size={16} className="me-25" /> <b>{rowData.name}</b>
          </NavLink>
        </Cell>
      )
    }

    return (
      <Cell {...props}>
        <span
          onClick={() => handleClickFileName(rowData)}
          style={{ cursor: "pointer" }}>
          <div className="d-flex align-items-center">
            {fileType[rowData.type]}{" "}
            <span className="ms-50">{rowData.filename_origin}</span>
          </div>
        </span>
      </Cell>
    )
  }

  const FileSizeCell = ({ rowData, dataKey, ...props }) => {
    const mbSize = rowData.size / (1024 * 1024)
    return <Cell {...props}>{addComma(mbSize.toFixed(3))} MB</Cell>
  }

  const FileActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <FileAction
          fileData={rowData}
          loadData={loadData}
          dataDocument={data}
          options={options}
          moduleName={moduleName}
        />
      </Cell>
    )
  }

  const renderTableDocumentAndFileList = () => {
    return (
      <ListDocument
        loading={loading}
        data={listFileUpload}
        dataDocument={data}
        options={options}
        setLoading={setLoading}
        toggleAddModal={toggleAddModal}
        toggleShareModal={toggleShareModal}
        setModalData={setModalData}
        setParentFolder={setParentFolder}
        handleClickFileName={handleClickFileName}
        loadData={loadData}
      />
    )
  }

  const renderTableFileList = () => {
    return (
      <Fragment>
        <Table
          autoHeight={true}
          data={listFileUpload}
          id="table"
          rowHeight={50}>
          <Column width={850} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.documents.fields.name")}
            </HeaderCell>
            <FileNameCell />
          </Column>
          <Column width={260} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.documents.fields.size")}
            </HeaderCell>
            <FileSizeCell />
          </Column>
          <Column flexGrow={1} align="right" verticalAlign="middle">
            <HeaderCell></HeaderCell>
            <FileActionCell />
          </Column>
        </Table>
      </Fragment>
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        {isDocumentParent
          ? renderTableDocumentAndFileList()
          : renderTableFileList()}
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListDocumentDetail
