import TableDefaultModule from "@apps/modules/default/components/table/TableDefaultModule"
import { getBool, useFormatMessage } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import { cellHandle, defaultCellHandle } from "@apps/utility/TableHandler"
import { filter, isUndefined, map } from "lodash"
import React, { Fragment, useContext } from "react"
import { Trash } from "react-feather"
import { useSelector } from "react-redux"
import { Button } from "reactstrap"
import { Table } from "rsuite"
import { AbilityContext } from "utility/context/Can"
const RequestsList = (props) => {
  //  const action = props.match.params.action;
  const moduleStore = useSelector((state) => state.app.modules.recruitments)
  const module = moduleStore.config
  const filterConfig = useSelector((state) => state.app.filters)
  const defaultFields = filterConfig.defaultFields
  const moduleName = moduleStore.config.name
  const {
    handleDetail,
    handleEdit,
    handleDelete,
    loadData,
    loading,
    params,
    data,
    pagination
  } = props
  const { Cell } = Table
  const CellDisplay = (props) => {
    const { field, rowData, cellProps } = props
    switch (field.field) {
      case "recruitment_code":
        return (
          <div
            key={rowData.id}
            className="d-flex flex-column cursor"
            onClick={() => handleDetail(rowData.id)}>
            <p className="user-name text-truncate mb-0">
              <span className="font-weight-bold">
                {rowData.recruitment_code}
              </span>
            </p>
          </div>
        )
      default:
        return cellHandle(field, rowData, cellProps)
    }
  }
  const ActionCellComp = ({ module, rowData, ...props }) => {
    const ability = useContext(AbilityContext)
    const moduleName = module.name
    const { update_mode, view_mode, options } = module
    const userId = useSelector((state) => state.auth.userData.id) || 0
    const canUpdate = canUpdateData(ability, moduleName, userId, rowData)
    const canDelete = canDeleteData(ability, moduleName, userId, rowData)
    return (
      <Cell {...props} className="link-group">
        <Button.Ripple
          color="flat-dark"
          size="sm"
          className="btn-edit"
          key={"btn-view"}
          onClick={() => {
            handleDetail(rowData.id, false)
          }}>
          <i className="fal fa-eye"></i>
        </Button.Ripple>
        {canUpdate && update_mode === "full-todo" && (
          <Button.Ripple
            title={`update ${rowData.id}`}
            color="flat-dark"
            size="sm"
            className="btn-edit"
            key={"btn-edit"}
            onClick={() => {
              handleEdit(rowData.id)
            }}>
            <i className="iconly-Edit-Square icli"></i>
          </Button.Ripple>
        )}

        {canDelete && (
          <Button.Ripple
            color="flat-dark"
            size="sm"
            className="btn-delete"
            key={"btn-delete"}
            onClick={() => {
              handleDelete(rowData.id)
            }}>
            <Trash size={15} />
          </Button.Ripple>
        )}
      </Cell>
    )
  }
  let customColumnAfter = [
    {
      props: {
        width: 130,
        align: "center",
        verticalAlign: "middle",
        fixed: "right"
      },
      header: useFormatMessage("app.action"),
      cellComponent: (cellProps) => {
        return <ActionCellComp {...cellProps} module={moduleStore.config} />
      }
    }
  ]

  customColumnAfter = [
    ...map(
      filter(
        defaultFields,
        (field) =>
          !isUndefined(
            module.user_options?.table?.metas?.[field.field]?.field_table_show
          ) &&
          getBool(
            module.user_options?.table?.metas?.[field.field]?.field_table_show
          ) === true
      ),
      (field) => {
        return {
          props: {
            width: 110,
            align: "center",
            verticalAlign: "middle"
          },
          header: useFormatMessage(`common.${field.field}`),
          cellComponent: (props) => {
            return (
              <Cell
                {...props}
                dataKey={field.field}
                className={`table_cell_${field.field}`}>
                {(rowData) => {
                  return defaultCellHandle(field, rowData[field.field])
                }}
              </Cell>
            )
          }
        }
      }
    ),
    ...customColumnAfter
  ]
  return (
    <React.Fragment>
      <TableDefaultModule
        metas={moduleStore.metas}
        data={data}
        recordsTotal={pagination.toltalRow}
        currentPage={pagination.currentPage}
        perPage={pagination.perPage}
        module={moduleStore.config}
        loading={loading}
        onChangePage={(page) => {
          loadData({ ...params, page: page })
        }}
        onChangeLength={(length) => {
          loadData({ ...params, length: length.toString() })
        }}
        onSortColumn={(key, type) => {
          loadData({
            orderCol: key,
            orderType: type
          })
        }}
        onSelectedRow={false}
        onDragColumn={false}
        onResize={(field, width) => {
          defaultModuleApi.updateUserMetas(moduleName, {
            data: [
              {
                module_id: field.module,
                module_meta_id: field.id,
                field_table_width: width
              }
            ]
          })
        }}
        customColumnAfter={customColumnAfter}
      />
    </React.Fragment>
  )
}
export default RequestsList
