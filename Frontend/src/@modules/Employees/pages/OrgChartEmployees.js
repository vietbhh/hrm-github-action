// ** React Imports
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { usersApi } from "@apps/modules/settings/common/api"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import styled from "@emotion/styled"
import AddEmployeeModal from "@modules/Employees/components/modals/AddEmployeeModal"
import { Dropdown } from "antd"
import _, { isEmpty } from "lodash"
import React, { Fragment, useEffect, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { MoreVertical } from "react-feather"
import { Tree, TreeNode } from "react-organizational-chart"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import "../assets/scss/departmentsSetting.scss"
import { departmentApi, employeesApi } from "../common/api"
import DeleteDepartmentModal from "../components/modals/DeleteDepartmentModal"
import NewDepartmentModal from "../components/modals/NewDepartmentModal"
import { workspaceApi } from "../../Workspace/common/api"
const OrgChartEmployees = (props) => {
  const params = useParams()
  const action = params.action
  const moduleData = useSelector((state) => state.app.modules.employees)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const Setting = useSelector((state) => state.auth.settings)
  const memberActive = useSelector((state) => state.users.list)
  const module = moduleData.config
  const metas = moduleData.metas
  const options = moduleData.options
  const moduleName = module.name
  const [state, setState] = useMergedState({
    listDepartment: [],
    modalAdd: false,
    modalEmployee: false,
    modalDeleteDepartment: false,
    idParent: 0,
    dataDetail: {},
    params: {},
    app_owner: ""
  })
  const head = {
    name: Setting.app_name,
    line_manager: state.app_owner,
    id: 0,
    updateOwner: true,
    groupChatId: Setting?.company_chat_group
  }
  const allowAction = ["page", "add", "update", "detail", "import"]
  if (action !== undefined && !allowAction.includes(action)) {
    return (
      <Fragment>
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  const StyledNode = styled.div`
    padding: 5px;
    border-radius: 8px;
    display: inline-block;
    background-color: white;
    box-shadow: 0px 0px 9px -3px rgb(0 0 0 / 30%);
    border-radius: 10px;
    padding: 10px 20px;
  `
  const loadData = (params) => {
    departmentApi.loadData(params).then((res) => {
      setState({ listDepartment: res.data, params: params })
    })
  }
  useEffect(() => {
    loadData()
    usersApi.getDetail(Setting.app_owner).then((res) => {
      setState({ app_owner: res.data })
    })
  }, [])

  const handleAddNew = (data = {}) => {
    const parent = data.parent
    setState({ modalAdd: !state.modalAdd, idParent: parent, dataDetail: data })
  }
  const handleNewEmployee = (data = {}) => {
    setState({
      modalEmployee: !state.modalEmployee,
      dataDetail: { department: { value: data?.id, label: data?.name } }
    })
  }
  const handleDelete = (data) => {
    setState({
      modalDeleteDepartment: !state.modalDeleteDepartment,
      dataDetail: data
    })
  }
  const indexOfArray = (arr, value) => {
    return arr.findIndex((item) => parseInt(item.id) === parseInt(value))
  }

  const buildTree = (arr = [], parent = 0) => {
    const arrParent = []
    _.map(arr, (item) => {
      const itemParent = item.parent ? item.parent.value : 0
      if (itemParent === parent) {
        item.childers = buildTree(arr, item?.id)
        arrParent.push(item)
      }
    })
    return arrParent
  }

  const moveDepartment = (fromId, toId) => {
    departmentApi.updateParent(fromId, toId).then((res) => {
      const listDep = [...state.listDepartment]
      const index = indexOfArray(listDep, fromId)
      if (!listDep[index]?.parent) {
        listDep[index].parent = { value: toId }
      } else {
        listDep[index].parent.value = toId
      }
      setState({ listDepartment: listDep })
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }

  const create_workgroup = async (departmentId) => {
    await departmentApi
      .createDepartmentWorkspace(departmentId)
      .then((res) => {
        loadData(state.params)
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        notification.showError({
          text: err
        })
        setState({ loading: false })
      })
  }

  const moveEmployee = (idEmployee, idDepartmentFrom, idDepartmentTo) => {
    departmentApi
      .changeDepartment({
        id: idEmployee,
        department_from: idDepartmentFrom,
        department_id: idDepartmentTo
      })
      .then((res) => {
        loadData(state.params)
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage(
            "modules.departments.text." + err.response.data?.messages?.error
          )
        })
        setState({ loading: false })
      })
  }

  const renderEmployee = (arr = []) => {
    return _.map(arr, (item) => {
      const [{ isDragging }, drag] = useDrag({
        type: "employee",
        item: {
          name: item.full_name,
          type: "employee",
          id: item.id,
          department_id: item.department_id
        },
        end: (item, monitor) => {
          const dropResult = monitor.getDropResult()
          if (item && dropResult && item.department_id !== dropResult?.id) {
            moveEmployee(item.id, item.department_id, dropResult.id)
          }
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging()
        })
      })
      const items = [
        {
          label: (
            <div>{useFormatMessage("modules.departments.text.profile")}</div>
          ),
          key: "profile",
          onClick: () => window.open("/employees/u/" + item?.username, "_blank")
        }
      ]
      return (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
          className="me-50"
          key={`ava_${item?.id}`}>
          <div ref={drag} className="employee-drag">
            <Avatar
              src={item.avatar}
              title={item.full_name}
              className={"avatar_in_department"}
              style={{ border: "1px solid" }}
            />
          </div>
        </Dropdown>
      )
    })
  }
  const createCompanyChat = (info) => {
    employeesApi
      .getList({ perPage: 1000, filters: { status: 13 } })
      .then((res) => {
        if (res.data) {
          const arrMember = res.data.results
          const member = arrMember.map((item) => item.id)
          const data = {
            name: info.name,
            owner: info.line_manager.id,
            member: JSON.stringify(member)
          }

          workspaceApi.createCompanyChat(data).then((res) => {
            if (res.data?.groupChatId) {
              workspaceApi
                .saveCompanyChatGroup({ id: res.data.groupChatId })
                .then((res) => {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                })
            }
          })
        }
      })
  }
  const Organization = ({ org, onCollapse, collapsed }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "department",
      item: {
        name: org.name,
        type: "department",
        id: org.id,
        parentID: org.parent ? org.parent.value : 0
      },
      canDrag: org?.id > 0 ?? true,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult()
        if (
          item &&
          dropResult &&
          item.id !== dropResult?.id &&
          item.parentID !== dropResult?.id
        ) {
          moveDepartment(item.id, dropResult.id)
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    })
    const [{ canDrop, isOver }, drop] = useDrop({
      accept: ["department", "employee"],
      drop: () => ({ name: org.name, id: org.id }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    })
    const navigate = useNavigate()
    const isActive = canDrop && isOver
    let backgroundColor = "white"
    if (isActive) {
      backgroundColor = "#ddffd2"
    } else if (canDrop) {
      backgroundColor = "#ffeedc"
    }
    const items = [
      {
        label: (
          <div>
            {useFormatMessage("modules.departments.text.new_department_sub")}
          </div>
        ),
        key: "new_sub",
        onClick: () =>
          handleAddNew({
            parent: { value: org.id, label: org.name },
            id: org.id,
            newSub: true
          })
      },
      {
        label: (
          <div>
            {useFormatMessage("modules.departments.buttons.new_employee")}
          </div>
        ),
        key: "btn_new_employee",
        onClick: () => handleNewEmployee(org),
        disabled: !org.id
      },
      {
        label: <div>{useFormatMessage("button.edit")}</div>,
        key: "btn_edit",
        onClick: () => handleAddNew(org),
        disabled: !org.id
      },
      {
        label: <div>{useFormatMessage("button.delete")}</div>,
        key: "btn_deleta",
        onClick: () => handleDelete(org),
        disabled: !org.id
      },
      _.isEmpty(org.custom_fields?.workgroup_id) ||
      _.isUndefined(org.custom_fields?.workgroup_id)
        ? {
            label: <div>Create workgroup</div>,
            key: "btn_create_workgroup",
            onClick: () => {
              create_workgroup(org.id)
            },
            disabled: !org.id
          }
        : {
            label: <div>View workgroup</div>,
            key: "btn_view_workgroup",
            onClick: () => {
              navigate("/workspace/" + org.custom_fields?.workgroup_id)
            },
            disabled: !org.id
          },
      _.isEmpty(org.id) && _.isEmpty(org?.groupChatId)
        ? {
            label: (
              <div>
                {useFormatMessage("modules.departments.text.new_group_chat")}
              </div>
            ),
            key: "new_group_chat",
            onClick: () => createCompanyChat(org)
          }
        : {
            label: (
              <div>
                {useFormatMessage("modules.departments.text.view_group_chat")}
              </div>
            ),
            key: "new_group_chat",
            onClick: () => {
              navigate("/chat/" + org?.groupChatId)
            }
          }
    ]

    return (
      <div ref={drop}>
        <StyledNode variant="outlined" ref={drag} style={{ backgroundColor }}>
          <div
            className="d-flex"
            style={{
              whiteSpace: "nowrap",
              flexWrap: "initial",
              fontWeight: "700",
              minWidth: "105px"
            }}>
            {org.name}
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="drop_workschedule"
              className="ms-auto">
              <Button className="p-0" color="flat-primary">
                <MoreVertical size={16} />
              </Button>
            </Dropdown>
          </div>
          {!isEmpty(org.id) && (
            <div
              className="pt-1"
              style={{
                fontSize: "12px",
                whiteSpace: "nowrap",
                textAlign: "start"
              }}>
              <>
                <i className="fa-solid fa-user-tie me-50"></i>{" "}
                {org?.line_manager?.full_name}
              </>
            </div>
          )}

          <hr style={{ margin: "0.5rem 0" }} />
          <div className="d-flex flex-wrap mt-25">
            {org?.employees && renderEmployee(org?.employees)}
          </div>

          {org?.childers && org?.childers.length > 0 && (
            <Button
              color="flat-secondary"
              className="btn-icon"
              onClick={onCollapse}>
              {collapsed ? (
                <i className="fa-light fa-angle-down"></i>
              ) : (
                <i className="fa-light fa-angle-up"></i>
              )}
            </Button>
          )}
        </StyledNode>
      </div>
    )
  }

  const Node = ({ o, parent, arrDep }) => {
    const [collapsed, setCollapsed] = useState(o.collapsed)
    const handleCollapse = () => {
      setCollapsed(!collapsed)
    }
    React.useEffect(() => {
      o.collapsed = collapsed
    })
    const T = parent
      ? TreeNode
      : (props) => (
          <Tree
            {...props}
            lineWidth={"2px"}
            lineColor={"#bbc"}
            lineBorderRadius={"12px"}>
            {props.children}
          </Tree>
        )
    return collapsed ? (
      <T
        label={
          <Organization
            org={o}
            onCollapse={handleCollapse}
            collapsed={collapsed}
          />
        }
      />
    ) : (
      <T
        label={
          <Organization
            org={o}
            onCollapse={handleCollapse}
            collapsed={collapsed}
          />
        }>
        {_.map(o?.childers, (a) => (
          <Node o={a} parent={o} />
        ))}
        {_.map(arrDep, (c) => (
          <Node o={c} parent={o} />
        ))}
      </T>
    )
  }
  const fieldData = { ...metas.department_id }
  fieldData.field_options = { ...fieldData.field_options, multiple: true }

  // ** render
  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fad fa-sitemap"></i>
              </span>
              <span>
                {useFormatMessage("modules.departments.text.title_org_chart")}
              </span>
            </h1>
            <div className="ms-auto" style={{ width: "30%" }}>
              <FieldHandle
                module={moduleName}
                fieldData={fieldData}
                nolabel
                options={options}
                onChange={(e) => {
                  loadData({ parent: e })
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody
          className="pt-1"
          style={{
            backgroundColor: "rgb(244 247 249)",
            margin: "20px"
          }}>
          <PerfectScrollbar>
            <DndProvider backend={HTML5Backend}>
              <Node o={head} arrDep={buildTree(state.listDepartment)} />
            </DndProvider>
          </PerfectScrollbar>
        </CardBody>
      </Card>
      <NewDepartmentModal
        modal={state.modalAdd}
        handleModal={handleAddNew}
        loadData={loadData}
        params={state.params}
        parent={state.idParent}
        dataDetail={state.dataDetail}
      />
      <AddEmployeeModal
        modal={state.modalEmployee}
        metas={metas}
        loadData={loadData}
        params={state.params}
        module={module}
        options={options}
        fillData={state.dataDetail}
        handleModal={handleNewEmployee}
        optionsModules={optionsModules}
      />
      <DeleteDepartmentModal
        modal={state.modalDeleteDepartment}
        listDepartment={state.listDepartment}
        handleModal={handleDelete}
        params={state.params}
        loadData={loadData}
        dataDetail={state.dataDetail}
      />
    </React.Fragment>
  )
}

export default OrgChartEmployees
