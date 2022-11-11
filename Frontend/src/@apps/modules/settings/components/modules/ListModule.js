import { ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { valuesToErpSelect } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import React, { useEffect, useMemo, useState } from "react"
import DataTable from "react-data-table-component"
import {
  ChevronDown,
  ExternalLink,
  Plus,
  Search,
  Settings,
  Trash
} from "react-feather"
import ReactPaginate from "react-paginate"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import { moduleManagerApi } from "../../common/api"
import ModuleFormModal from "./ModuleFormModal"

const ListModule = (props) => {
  // ** States
  const [state, setState] = useMergedState({
    modalTitle: "add",
    currentPage: 0,
    searchValue: "",
    data: [],
    filteredData: [],
    modal: false,
    updateData: [],
    modalLoading: false,
    loading: false
  })

  const [configData, setConfigData] = useState({
    moduleConfig: [],
    permits: [],
    groups: [],
    systemModules: []
  })
  const [deleteId, setDeleteId] = useState([])
  const perPage = useSelector((state) => state.auth.settings.perPage) || 10

  const loadData = () => {
    setState({
      loading: true
    })
    moduleManagerApi.getList().then((response) => {
      setState({
        data: response.data.modules,
        filteredData: response.data.modules,
        loading: false
      })
      setConfigData({
        moduleConfig: response.data.config,
        permits: response.data.permits,
        groups: response.data.groups,
        systemModules: response.data.systemModules
      })
    })
  }

  const createModal = () => {
    setState({
      modal: !state.modal,
      updateData: false
    })
  }

  const updateModal = (name) => {
    setState({
      modalTitle: "update",
      modalLoading: true,
      updateData: []
    })
    moduleManagerApi.getDetail(name).then((response) => {
      setState({
        updateData: valuesToErpSelect(response.data, [
          "type",
          "layout",
          "field_icon_type",
          "field_type",
          "field_select_field_show",
          "field_select_module",
          "update_mode",
          "add_mode",
          "view_mode",
          "fullWidth"
        ]),
        modal: !state.modal,
        modalLoading: false
      })
    })
  }

  const deleteConfirmHander = (id) => {
    moduleManagerApi
      .delete(id)
      .then((result) => {
        loadData()
        deleteAlertHander()
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  const deleteAlertHander = (id = "") => {
    if (id !== "") {
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete")
      }).then((res) => {
        if (res.value) {
          deleteConfirmHander([...deleteId, id])
        }
      })
    } else {
      setDeleteId([])
    }
  }
  const columns = useMemo(
    () => [
      {
        name: "#",
        width: "100px",
        sortable: true,
        cell: (row, index) => {
          return <span data-id={row.id}>{row.sequenceNum}</span>
        }
      },
      {
        name: useFormatMessage("manage.module.name"),
        selector: (row) => row.name,
        sortable: true
      },
      {
        name: useFormatMessage("manage.module.tableName"),
        selector: (row) => row.tableName,
        sortable: true
      },
      {
        name: useFormatMessage("manage.module.type"),
        selector: (row) => row.type,
        sortable: true
      },
      {
        name: useFormatMessage("manage.module.layout"),
        selector: (row) => row.layout,
        sortable: true
      },
      {
        name: useFormatMessage("manage.module.icon"),
        selector: (row) => row.icon,
        sortable: true
      },
      {
        name: useFormatMessage("app.action"),
        width: "200px",
        cell: (row) => {
          const updateUrl = "/" + row.name.replaceAll("_", "-")
          return (
            <React.Fragment>
              <Button.Ripple
                color="flat-dark"
                size="sm"
                to={updateUrl}
                target="_blank"
                tag={Link}>
                <ExternalLink size={14} />
              </Button.Ripple>
              <Button.Ripple
                color="flat-dark"
                size="sm"
                onClick={() => {
                  updateModal(row.name)
                }}>
                <Settings size={14} />
              </Button.Ripple>
              <Button.Ripple
                color="flat-dark"
                size="sm"
                onClick={() => {
                  deleteAlertHander(row.id)
                }}>
                <Trash size={14} />
              </Button.Ripple>
            </React.Fragment>
          )
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true
      }
    ],
    []
  )

  // ** Function to handle Modal toggle
  const handleModal = () =>
    setState({
      modal: !state.modal
    })

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    if (value.length) {
      updatedData = state.data.filter((item) => {
        const startsWith =
          item.name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.tableName.toLowerCase().startsWith(value.toLowerCase()) ||
          item.icon.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.tableName.toLowerCase().includes(value.toLowerCase()) ||
          item.icon.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setState({
        filteredData: updatedData,
        searchValue: value
      })
    } else {
      setState({
        searchValue: value
      })
    }
  }

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setState({ currentPage: page.selected })
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
          ? Math.ceil(state.filteredData.length / perPage)
          : Math.ceil(state.data.length / perPage) || 1
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
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
    />
  )

  useEffect(() => {
    loadData()
  }, [])
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="pb-0">
          <div className="d-flex flex-wrap justify-content-between w-100">
            <div className="add-new">
              <Button.Ripple color="flat-dark" size="md" onClick={createModal}>
                <Plus size={20} /> {useFormatMessage("app.create")}
              </Button.Ripple>
            </div>
            <div className="mb-1">
              <ErpInput
                value={state.searchValue}
                onChange={(e) => {
                  handleFilter(e)
                }}
                prepend={<Search size="15" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          {state.loading ? (
            <DefaultSpinner />
          ) : (
            <DataTable
              noHeader
              pagination
              className="react-dataTable"
              columns={columns}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={state.searchValue.length ? state.filteredData : state.data}
              paginationPerPage={parseInt(perPage)}
              paginationDefaultPage={state.currentPage + 1}
            />
          )}
        </CardBody>
      </Card>
      <ModuleFormModal
        loadData={loadData}
        modalTitle={state.modalTitle}
        modal={state.modal}
        handleModal={handleModal}
        moduleConfig={configData.moduleConfig}
        permits={configData.permits}
        groups={configData.groups}
        systemModules={configData.systemModules}
        modules={state.data}
        updateData={state.updateData}
        modalLoading={state.modalLoading}
      />
    </React.Fragment>
  )
}
export default ListModule
