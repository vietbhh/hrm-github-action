import { ErpSwitch } from "@apps/components/common/ErpField"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import Photo from "@apps/modules/download/pages/Photo"
import {
  addComma,
  coppyLink,
  fieldLabel,
  functionUnderContruction,
  sortFieldsDisplay,
  stringInject,
  timeDifference,
  useFormatMessage
} from "@apps/utility/common"
import { toArray } from "lodash"
import { isArray, isEmpty, isObject } from "lodash-es"
import React, { Fragment } from "react"
import EllipsisText from "react-ellipsis-text"
import {
  Bookmark,
  FileText,
  Link2,
  MoreVertical,
  Share,
  Trash
} from "react-feather"
import { Link } from "react-router-dom"
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  PopoverBody,
  PopoverHeader,
  UncontrolledDropdown,
  UncontrolledPopover,
  UncontrolledTooltip
} from "reactstrap"
import { isUndefined } from "./handleData"
import { defaultModuleApi } from "./moduleApi"
import notification from "./notification"
import { canDeleteData, canUpdateData } from "./permissions"

export const defaultCellHandle = (define, data, formatTime = true) => {
  const { field } = define
  if (isEmpty(data)) return ""
  switch (field) {
    case "owner":
    case "created_by":
    case "updated_by":
      return <Link to={`/users/${data.label}`}>{data.label}</Link>
    case "created_at":
    case "updated_at":
    case "deleted_at":
      return formatTime ? timeDifference(data) : data
    case "view_permissions":
    case "update_permissions":
      return (
        <Fragment>
          <span className="text-primary cursor-pointer" id="update_permissions">
            {data.length}
          </span>
          <UncontrolledTooltip placement="top" target="update_permissions">
            {data.map((item, index) => {
              let str = `${item.label}`
              if (index !== data.length - 1) str += ","
              return str
            })}
          </UncontrolledTooltip>
        </Fragment>
      )
    default:
      return ""
  }
}

export const cellHandle = (define, data, props) => {
  const { field_type, field, field_options } = define
  if (isEmpty(data[field]) && field_type !== "switch") return ""
  switch (field_type) {
    case "number_int":
    case "number_dec":
      return addComma(data[field])
    case "select_option":
      let stringValues = ""
      if (isArray(data[field])) {
        stringValues += data[field].map((item) =>
          useFormatMessage(`${item.label}`)
        )
      } else {
        stringValues += !isUndefined(data[field].label)
          ? useFormatMessage(`${data[field].label}`)
          : ""
      }
      return stringValues
    case "select_module":
      const linkClick = field_options.link || {
        isLink: false,
        link: `/{parentModule}/detail/{value}`
      }
      if (isArray(data[field])) {
        return data[field].map((dataItem, index) => {
          const linkr = stringInject(linkClick.link, {
            parentModule: define.field_select_module,
            value: dataItem.value,
            label: dataItem.label
          })
          return linkClick.isLink ? (
            <Fragment key={index}>
              <Link key={index} to={linkr}>
                {dataItem.label}
              </Link>
              {index < data[field].length - 1 ? ", " : ""}
            </Fragment>
          ) : (
            <span key={index}>
              {dataItem.label}
              {index < data[field].length - 1 ? ", " : ""}
            </span>
          )
        })
      } else {
        const linkr = stringInject(linkClick.link, {
          parentModule: define.field_select_module,
          value: data[field].value,
          label: data[field].label
        })
        return linkClick.isLink ? (
          <Link to={linkr}>{data[field].label}</Link>
        ) : (
          <span>{data[field].label}</span>
        )
      }
    case "checkbox":
      if (isArray(data[field])) {
        return data[field].map((dataItem, index) => (
          <Badge key={index} color="primary" className="me-1 mb-25">
            {useFormatMessage(`${dataItem.label}`)}
          </Badge>
        ))
      } else {
        return (
          <Badge color="primary" className="me-1 mb-25">
            {useFormatMessage(`${data[field].label}`)}
          </Badge>
        )
      }
    case "checkbox_module":
      if (isArray(data[field])) {
        return data[field].map((dataItem, index) => (
          <Badge key={index} color="primary" className="me-1 mb-25">
            {dataItem.label}
          </Badge>
        ))
      } else {
        return (
          <Badge color="primary" className="me-1 mb-25">
            {data[field].label}
          </Badge>
        )
      }
    case "radio":
      return (
        <Badge color="light-primary" pill>
          {useFormatMessage(`${data[field].label}`)}
        </Badge>
      )
    case "radio_module":
      return (
        <Badge color="light-primary" pill>
          {data[field].label}
        </Badge>
      )
    case "switch":
      const fastUpdate =
        !isUndefined(field_options?.fastUpdate) &&
        field_options?.fastUpdate === true
      const switchId =
        `tbl_switch_${field}` + (!isUndefined(data.id) ? `_${data.id}` : "")
      return (
        <ErpSwitch
          id={switchId}
          name={switchId}
          inline
          defaultValue={data[field]}
          readOnly={!fastUpdate}
          onChange={(e) => {
            if (fastUpdate && data?.id) {
              defaultModuleApi
                .postSave(
                  define?.moduleName,
                  {
                    id: data?.id,
                    [field]: e.target.checked
                  },
                  true
                )
                .then((res) => {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                })
            }
          }}
        />
      )
    case "upload_one":
      return (
        <DownloadFile
          className="align-items-center"
          fileName={data[field].fileName}
          src={data[field].url}>
          <Badge color="light-secondary" pill>
            <Link2 size={12} />
            <span className="align-middle ms-50">{data[field].fileName}</span>
          </Badge>
        </DownloadFile>
      )
    case "upload_multiple":
      return data[field].length > 1 ? (
        <Fragment>
          <Button.Ripple color="secondary" size="sm" outline id="popClick">
            <Link2 size={12} /> {data[field].length} files
          </Button.Ripple>
          <UncontrolledPopover
            trigger="click"
            placement="top"
            target="popClick">
            <PopoverHeader>Files</PopoverHeader>
            <PopoverBody>
              {data[field].map((item, index) => {
                return (
                  <DownloadFile
                    fileName={item.fileName}
                    key={index}
                    src={item.url}>
                    <Badge color="light-primary" pill>
                      <Link2 size={12} />
                      <span className="align-middle ms-50">
                        {item.fileName}
                      </span>
                    </Badge>
                  </DownloadFile>
                )
              })}
            </PopoverBody>
          </UncontrolledPopover>
        </Fragment>
      ) : (
        <DownloadFile
          fileName={data[field][0].fileName}
          src={data[field][0].url}>
          <Badge color="primary" pill>
            <Link2 size={12} />
            <span className="align-middle ms-50">
              {data[field][0].fileName}
            </span>
          </Badge>
        </DownloadFile>
      )

    case "upload_image":
      return (
        <div
          className="d-block m-auto"
          style={{
            padding: ".72rem 1.5rem"
          }}>
          <Photo
            src={data[field].url}
            className="rounded align-middle"
            style={{
              height: "30px"
            }}
          />
        </div>
      )
    case "text":
    case "textarea":
      const compact = props?.textarea?.compact
      let clickDetail = define.field_options?.display?.clickDetail
      if (isUndefined(clickDetail)) clickDetail = false
      let textProps = {}
      if (clickDetail) {
        textProps = {
          onClick: () => {
            props?.handleDetailClick(data.id)
          }
        }
      }
      const textVal =
        isObject(data[field]) || isArray(data[field])
          ? JSON.stringify(data[field])
          : data[field]
      return compact === true ? (
        <Fragment>
          <EllipsisText
            text={textVal}
            length={15}
            id={`${field_type}_${field}`}
            data-tag="allowRowEvents"
            {...textProps}
          />
        </Fragment>
      ) : (
        <span data-tag="allowRowEvents" {...textProps}>
          {textVal}
        </span>
      )
    case "date":
    case "datetime":
    case "time":
    default:
      return isObject(data[field]) || isArray(data[field])
        ? JSON.stringify(data[field])
        : data[field]
  }
}

export const columnHandle = (
  module,
  metas,
  hideFields = [],
  cellProps = {}
) => {
  const column = [
    /* {
      name: '#',
      selector: 'id',
      width: '100px',
      sortable: true
    } */
  ]
  const metasData = isArray(metas) ? metas : toArray(metas)

  if (isArray(metasData)) {
    metasData
      .filter(
        (item) => item.field_table_show && !hideFields.includes(item.field)
      )
      .sort((a, b) => {
        return sortFieldsDisplay(a, b, "field_table_order")
      })
      .map((item) => {
        const colOpts = item.field_options?.table?.options || {}
        const colStyles = item.field_options?.table?.options?.styles || {}
        const styles = {
          "white-space": "nowrap",
          ...colStyles
        }
        delete colOpts.style
        const col = {
          name: fieldLabel(module, item.field),
          selector: item.field,
          sortable: item.field_table_sortable,
          cell: (row) => {
            return cellHandle(item, row, cellProps)
          },
          style: styles,
          ...colOpts
        }
        if (item.field.field_table_width)
          col.width = item.field.field_table_width
        return column.push(col)
      })
  }

  return column
}

export const addColButtonTable = (
  data,
  {
    moduleData,
    ability,
    userId,
    handleUpdateClick,
    handleDeleteClick,
    handleDetailClick,
    handleBookmarkClick
  }
) => {
  const { update_mode, view_mode, options } = moduleData
  const module = moduleData.name
  const moreBtn = options?.config?.tableRowMoreBtn
  data.push({
    name: useFormatMessage("app.action"),
    width: "150px",
    cell: (row) => {
      const canUpdate = canUpdateData(ability, module, userId, row)
      const canDelete = canDeleteData(ability, module, userId, row)
      return (
        <React.Fragment>
          {canUpdate && update_mode !== "full" && (
            <Button.Ripple
              title={`update ${row.id}`}
              color="flat-dark"
              size="sm"
              className="btn-edit"
              onClick={() => {
                handleUpdateClick(row.id)
              }}>
              <i className="iconly-Edit-Square icli"></i>
            </Button.Ripple>
          )}
          {canUpdate && update_mode === "full" && (
            <Button.Ripple
              tag={Link}
              to={`${module}/update/${row.id}`}
              color="flat-dark"
              size="sm"
              className="btn-edit">
              <i className="iconly-Edit-Square icli"></i>
            </Button.Ripple>
          )}
          {canDelete && (
            <Button.Ripple
              color="flat-dark"
              size="sm"
              className="btn-delete"
              onClick={() => {
                handleDeleteClick(row.id)
              }}>
              <Trash size={15} />
            </Button.Ripple>
          )}
          {moreBtn && (
            <UncontrolledDropdown>
              <DropdownToggle tag="div" className="btn btn-sm">
                <MoreVertical size={14} className="cursor-pointer" />
              </DropdownToggle>
              <DropdownMenu end>
                {view_mode !== "full" && (
                  <DropdownItem
                    className="w-100"
                    onClick={() => handleDetailClick(row.id)}>
                    <FileText size={14} className="me-50" />
                    <span className="align-middle">
                      {useFormatMessage("module.default.table.details")}
                    </span>
                  </DropdownItem>
                )}
                {view_mode === "full" && (
                  <DropdownItem
                    className="w-100"
                    tag={Link}
                    to={`${module}/detail/${row.id}`}>
                    <FileText size={14} className="me-50" />
                    <span className="align-middle">
                      {useFormatMessage("module.default.table.details")}
                    </span>
                  </DropdownItem>
                )}
                <DropdownItem
                  className="w-100"
                  onClick={() => functionUnderContruction()}>
                  <Bookmark size={14} className="me-50" />
                  <span className="align-middle">
                    {useFormatMessage("module.default.table.bookmark")}
                  </span>
                </DropdownItem>
                <DropdownItem
                  className="w-100"
                  onClick={() => functionUnderContruction()}>
                  <Share size={14} className="me-50" />
                  <span className="align-middle">
                    {useFormatMessage("module.default.table.permission")}
                  </span>
                </DropdownItem>
                <DropdownItem
                  className="w-100"
                  onClick={() =>
                    coppyLink(
                      `${process.env.REACT_APP_URL}/${module}/detail/${row.id}`
                    )
                  }>
                  <Link2 size={14} className="me-50" />
                  <span className="align-middle">
                    {useFormatMessage("module.default.table.coppylink")}
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </React.Fragment>
      )
    },
    ignoreRowClick: true,
    allowOverflow: true,
    button: true
  })
  return data
}
