// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { NavLink as RRNavLink } from "react-router-dom"
import { getDocumentMemoType } from "../../common/common"
// ** Styles
import { NavLink } from "reactstrap"
import { Folder } from "react-feather"
// ** Components
import { Table } from "rsuite"
import CreatorCell from "./TableCellComponent/CreatorCell"
import CreatedDateCell from "./TableCellComponent/CreatedDateCell"
import ShareDocumentCell from "./TableCellComponent/ShareDocumentCell"
import SharedWithCell from "./TableCellComponent/SharedWithCell"
import NumberOfFileCell from "./TableCellComponent/NumberOfFileCell"
import TotalSizeCell from "./TableCellComponent/TotalSizeCell"
import FolderActionCell from "./TableCellComponent/FolderActionCell"

const { Column, HeaderCell, Cell } = Table

const ListDocument = (props) => {
  const {
    // ** props
    loading,
    data,
    dataDocument,
    moduleName,
    options,
    // ** methods
    setLoading,
    toggleAddModal,
    toggleShareModal,
    setModalData,
    setParentFolder,
    handleClickFileName,
    loadData
  } = props

  const pathname = "/documents"
  const fileType = getDocumentMemoType()

  // ** render
  const FolderNameCell = ({ rowData, dataKey, ...props }) => {
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

  const renderComponent = () => {
    const propFolderActionCell = {
      dataDocument: dataDocument,
      moduleName: moduleName,
      toggleAddModal: toggleAddModal,
      toggleShareModal: toggleShareModal,
      setModalData: setModalData,
      setParentFolder: setParentFolder,
      loadData: loadData
    }

    const propShareDocumentCell = {
      loading: loading,
      setLoading: setLoading,
      loadData: loadData
    }

    return (
      <Table
        autoHeight={true}
        data={data}
        id="table"
        rowHeight={60}
        className="table-document">
        <Column width={250} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.name")}
          </HeaderCell>
          <FolderNameCell />
        </Column>
        <Column width={120} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.create_by")}
          </HeaderCell>
          <CreatorCell />
        </Column>
        <Column width={220} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.created_at")}
          </HeaderCell>
          <CreatedDateCell />
        </Column>
        <Column width={350} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.description")}
          </HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={120} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.share")}
          </HeaderCell>
          <ShareDocumentCell other={propShareDocumentCell} />
        </Column>
        <Column width={200} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.shared_with")}
          </HeaderCell>
          <SharedWithCell options={options} />
        </Column>
        <Column width={150} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.number_of_files")}
          </HeaderCell>
          <NumberOfFileCell />
        </Column>
        <Column width={120} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.documents.fields.size")}
          </HeaderCell>
          <TotalSizeCell />
        </Column>
        <Column width={140} align="left" verticalAlign="middle">
          <HeaderCell></HeaderCell>
          <FolderActionCell
            data={data}
            options={options}
            other={propFolderActionCell}
          />
        </Column>
      </Table>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListDocument
