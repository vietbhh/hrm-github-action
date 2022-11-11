import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { columnHandle } from "@apps/utility/TableHandler"
import { filter, isEmpty, map, orderBy } from "lodash"
import React, { Fragment, useContext, useEffect } from "react"
import update from "react-addons-update"
import DataTable from "react-data-table-component"
import { ChevronDown, Edit, Trash } from "react-feather"
import { useForm } from "react-hook-form"
import ReactPaginate from "react-paginate"
import { useSelector } from "react-redux"
import { Button, Col, Form, Input, Label, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"

const FormTable = (props) => {
  const { module, fields, handleUpdate, options, tableProps, tableSearch } =
    props
  const hideFields = props.hideFields || []
  const ability = useContext(AbilityContext)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const [state, setState] = useMergedState({
    data: [],
    currentPage: 0,
    searchValue: "",
    filteredData: [],
    isUpdate: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, setValue, reset } = methods

  const handleUpdateClick = (rowIndex) => {
    const rowData = state.data.filter((item, index) => index === rowIndex)[0]
    reset(rowData)
    setState({
      isUpdate: rowIndex
    })
  }

  const hadleDeleteClick = (rowIndex) => {
    const arrayData = state.data.filter((item, index) => index !== rowIndex)
    setState({
      data: arrayData
    })
  }

  const columns = React.useMemo(() => {
    const cols = columnHandle(module, fields, hideFields)
    cols.push({
      name: useFormatMessage("app.action"),
      width: "150px",
      cell: (row, index) => {
        let canUpdate = false,
          canDelete = false
        if (ability.can("updateAll", module)) canUpdate = true
        else {
          if (
            ability.can("update", module) &&
            !isEmpty(row.owner) &&
            (row.owner.value === userId ||
              (!isEmpty(row.update_permissions) &&
                row.update_permissions.some(
                  (viewPer) => viewPer.value === userId
                )))
          ) {
            canUpdate = true
          }
        }
        //just owner or who have delete all permissions can delete record
        if (ability.can("deleteAll", module)) canDelete = true
        else {
          if (
            ability.can("delete", module) &&
            !isEmpty(row.owner) &&
            row.owner.value === userId
          ) {
            canDelete = true
          }
        }

        return (
          <Fragment>
            {canUpdate && (
              <Button.Ripple
                title={`update ${row.id}`}
                color="flat-dark"
                size="sm"
                onClick={() => {
                  handleUpdateClick(index)
                }}>
                <Edit size={14} />
              </Button.Ripple>
            )}
            {canDelete && (
              <Button.Ripple
                color="flat-dark"
                size="sm"
                onClick={() => {
                  hadleDeleteClick(index)
                }}>
                <Trash size={14} />
              </Button.Ripple>
            )}
          </Fragment>
        )
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    })
    return cols
  }, [module, fields, state.data])

  const perPage = 5

  useEffect(() => {
    handleUpdate(state.data)
  }, [state.data])

  const resetForm = () => {
    if (!isEmpty(fields)) {
      map(
        filter(
          fields,
          (field) =>
            !hideFields.includes(field.field) &&
            [
              "select_option",
              "select_module",
              "number_int",
              "number_dec",
              "date",
              "datetime",
              "time"
            ].includes(field.field_type)
        ),
        (field) => {
          setValue(field.field, null)
        }
      )
    }
    reset({})
    setState({
      isUpdate: false
    })
  }

  const onSubmit = (values) => {
    let arrayData = [...state.data]
    if (state.isUpdate === false) {
      arrayData = [...arrayData, values]
    } else {
      arrayData = update(arrayData, { [state.isUpdate]: { $set: values } })
    }
    setState({
      data: arrayData
    })
    resetForm()
  }

  const handleFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    setState({
      searchValue: value
    })

    if (value.length) {
      updatedData = state.data.filter((item) => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.post.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.age.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title
            .toLowerCase()
            .startsWith(value.toLowerCase())

        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.post.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.age.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
          item.start_date.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setState({
        filteredData: updatedData
      })
    }
  }

  const handlePagination = (page) => {
    setstate({
      currentPage: page.selected
    })
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={state.currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={
        state.searchValue.length
          ? state.filteredData.length / perPage
          : state.data.length / perPage || 1
      }
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      nextLinkClassName="page-link"
      nextClassName="page-item next"
      previousClassName="page-item prev"
      previousLinkClassName="page-link"
      pageLinkClassName="page-link"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
    />
  )

  return (
    <Fragment>
      <Form className="row" onSubmit={handleSubmit(onSubmit)}>
        {!isEmpty(fields) &&
          orderBy(
            map(
              filter(
                fields,
                (field) =>
                  field.field_form_show && !hideFields.includes(field.field)
              ),
              (field, key) => {
                const fieldsProps = {
                  module: module,
                  fieldData: field,
                  useForm: methods,
                  options
                }
                return (
                  <Fragment key={key}>
                    <Col md={field.field_form_col_size}>
                      <FieldHandle {...fieldsProps} />
                    </Col>
                  </Fragment>
                )
              }
            ),
            (field) => parseInt(field.field_form_order),
            "asc"
          )}
        <Col md="2" className="pt-2">
          {state.isUpdate === false ? (
            <Button.Ripple type="submit" color="primary" outline>
              <span className="align-middle">
                <i className="fal fa-plus" />
              </span>
            </Button.Ripple>
          ) : (
            <Fragment>
              <Button.Ripple type="submit" color="warning" outline>
                <span className="align-middle">
                  <i className="fal fa-check" />
                </span>
              </Button.Ripple>
              &nbsp;
              <Button.Ripple
                type="button"
                onClick={resetForm}
                color="danger"
                outline
                className="ms-10">
                <span className="align-middle">
                  <i className="fal fa-times" />
                </span>
              </Button.Ripple>
            </Fragment>
          )}
        </Col>
      </Form>
      {tableSearch && (
        <Row className="justify-content-end mx-0">
          <Col
            className="d-flex align-items-center justify-content-end mt-1"
            md="3"
            sm="12">
            <Label className="me-1" for="search-input">
              {useFormatMessage("app.search")}
            </Label>
            <Input
              className="dataTable-filter mb-50"
              type="text"
              size="sm"
              id="search-input"
              value={state.searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
      )}

      <DataTable
        noHeader
        pagination={true}
        columns={columns}
        paginationPerPage={perPage}
        className="react-dataTable"
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={state.currentPage + 1}
        paginationComponent={CustomPagination}
        data={state.searchValue.length ? state.filteredData : state.data}
        {...tableProps}
      />
    </Fragment>
  )
}

export default FormTable
