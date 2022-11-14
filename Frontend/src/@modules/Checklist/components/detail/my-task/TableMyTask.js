// ** React Imports
import { Fragment, useState } from "react"
import { formatDate, useFormatMessage } from "@apps/utility/common"
import { Link } from "react-router-dom"
// ** Styles
import { Circle, CheckCircle } from "react-feather"
// ** Components
import { Table } from "rsuite"
import Avatar from "@apps/modules/download/pages/Avatar"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox } from "@apps/components/common/ErpField"

const { Column, HeaderCell, Cell } = Table

const TableMyTask = (props) => {
  const {
    // ** props
    data,
    additionalData,
    chosenTask,
    // ** methods
    handleCompleteTask,
    setChosenTask
  } = props

  const showCheckBoxCell = data.some(
    (item) => item.task_type?.name_option === "checkbox"
  )

  const handleCheck = (value, checked) => {
    const newChosen = checked
      ? [...chosenTask, value]
      : chosenTask.filter((item) => {
          return parseInt(item.id) !== parseInt(value.id)
        })
    setChosenTask(newChosen)
  }

  const handleCheckAll = (checked) => {
    const newChosen = checked
      ? data.filter((item) => {
          if (item.task_type?.name_option === "checkbox") {
            return item
          }
        })
      : []
    console.log(data)
    setChosenTask(newChosen)
  }

  // ** render
  const CheckCell = ({ rowData, onChange, chosenTask, dataKey, ...props }) => {
    if (rowData.task_type?.name_option === "checkbox") {
      return (
        <Cell {...props} style={{ padding: 0 }}>
          <div>
            <ErpCheckbox
              defaultValue={rowData[dataKey]}
              inline
              onChange={(e) => {
                handleCheck(rowData, e.target.checked)
              }}
              checked={chosenTask.some(
                (item) =>
                  parseInt(item.id) === parseInt(rowData[dataKey]) ||
                  item.id === rowData[dataKey]
              )}
              id={`select_row_${rowData[dataKey]}`}
              name={`select_row_${rowData[dataKey]}`}
            />
          </div>
        </Cell>
      )
    }

    return <Cell {...props} style={{ padding: 0 }}></Cell>
  }

  const CompleteActionCell = ({ rowData, dataKey, ...props }) => {
    if (parseInt(rowData.status.value) === 470) {
      return (
        <Cell {...props}>
          <button
            className="btn-with-icon"
            onClick={() => {
              handleCompleteTask(rowData, true)
            }}>
            <CheckCircle color="Green" size={17} />
          </button>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <button
            className="btn-with-icon mb-25"
            onClick={() => {
              handleCompleteTask(rowData)
            }}>
            <Circle size={17} />
          </button>
        </Cell>
      )
    }
  }

  const ChecklistInfoCell = ({ rowData, dataKey, ...props }) => {
    const [currentChecklistInfo] = additionalData.checklist.filter(
      (checklist) => {
        return checklist.id === rowData.checklist_id?.value
      }
    )
    if (currentChecklistInfo !== undefined) {
      return (
        <Cell {...props} className="checklist-detail-action">
          <div className="pr-25">
            {currentChecklistInfo.type?.name_option}{" "}
            {useFormatMessage("modules.checklist_detail.text.for")}
          </div>
          <Fragment>
            <Link
              className="d-flex justify-content-left align-items-center text-dark"
              tag="div"
              to={`/employees/u/${rowData.assignee.value}`}>
              <Avatar
                className="my-0 ms-50 me-50"
                size="sm"
                src={rowData.assignee.icon}
              />
              <div className="d-flex flex-column">
                <p className="user-name text-truncate mb-0">
                  <span className="fw-bold">
                    {currentChecklistInfo.employee_id?.full_name}
                  </span>{" "}
                </p>
              </div>
            </Link>
          </Fragment>
        </Cell>
      )
    } else {
      return <Cell {...props} className="checklist-detail-action"></Cell>
    }
  }

  const DateCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{formatDate(rowData.due_date)}</Cell>
  }

  const renderTable = () => {
    if (data.length > 0) {
      return (
        <Table
          autoHeight={true}
          data={data}
          id="table"
          className="ps-0"
          affixHorizontalScrollbar>
          {showCheckBoxCell && (
            <Column width={50} align="center" fixed verticalAlign="middle">
              <HeaderCell style={{ padding: 0 }}>
                <div style={{ lineHeight: "40px" }}>
                  <ErpCheckbox
                    id="select_all_row"
                    name="select_all_row"
                    inline
                    defaultChecked={false}
                    onChange={(e) => {
                      handleCheckAll(e.target.checked)
                    }}
                  />
                </div>
              </HeaderCell>
              <CheckCell
                dataKey="id"
                chosenTask={chosenTask}
                onChange={handleCheck}
              />
            </Column>
          )}
          <Column width={50} align="center" verticalAlign="middle">
            <HeaderCell style={{ padding: 0 }}>
              <div style={{ lineHeight: "40px" }}></div>
            </HeaderCell>
            <CompleteActionCell />
          </Column>
          <Column width={600} align="center" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.checklist_detail.fields.task_name")}
            </HeaderCell>
            <Cell dataKey="task_name" />
          </Column>
          <Column width={160} verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.checklist_detail.fields.due_date")}
            </HeaderCell>
            <DateCell />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>
              {useFormatMessage("modules.checklist_detail.fields.checklist_id")}
            </HeaderCell>
            <ChecklistInfoCell />
          </Column>
        </Table>
      )
    } else {
      return <EmptyContent />
    }
  }
  return <Fragment>{renderTable()}</Fragment>
}

export default TableMyTask
