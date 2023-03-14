import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Tabs } from "antd"
import React, { useEffect, useRef } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { Col, Row } from "reactstrap"
const EmployeesSelect = (props) => {
  const { handleSelect, dataDetail, member_selected, department_selected } =
    props
  const [state, setState] = useMergedState({
    loading: false,
    page: 1,
    search: "",
    members: [],
    departments: [],
    jobtitles: [],
    recordsTotal: [],
    perPage: 10,
    dataSelected: [],
    typeAdd: "members"
  })
  const handleSelected = (key) => {
    let data = state.members

    if (state.typeAdd === "departments") {
      data = state.departments
    } else if (state.typeAdd === "jobtitles") {
      data = state.jobtitles
    }
    const dataSelected = [...state.dataSelected]

    const checkExist = checkExistSelected(data[key].id)
    if (checkExist >= 0) {
      dataSelected.splice(checkExist, 1)
      setState({ dataSelected: dataSelected })
    } else {
      const concat = dataSelected.concat(data[key])
      setState({ dataSelected: concat })
    }
  }

  const renderMemberSelected = (data = []) => {
    return data.map((item, key) => {
      return (
        <Col sm={12} key={item.id}>
          <div
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <Avatar src={item.avatar} className="me-50" />
            <div className="title">{item.full_name}</div>
          </div>
        </Col>
      )
    })
  }
  const renderMember = (data = []) => {
    return data.map((item, key) => {
      const checked = checkExistSelected(item.id) >= 0 ?? true
      return (
        <Col sm={12} key={key}>
          <div
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <Avatar src={item.avatar} className="me-50" />
            <div className="title">{item.full_name}</div>
            <div className="ms-auto">
              <ErpCheckbox checked={checked} />
            </div>
          </div>
        </Col>
      )
    })
  }

  const renderDepartment = (data = []) => {
    return data.map((item, key) => {
      const checked = checkExistSelected(item.id) >= 0 ?? true
      return (
        <Col sm={12} key={key}>
          <div
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
            <div className="ms-auto">
              <ErpCheckbox checked={checked} />
            </div>
          </div>
        </Col>
      )
    })
  }
  const renderDepartmentSelected = (data = []) => {
    return data.map((item, key) => {
      return (
        <Col sm={12} key={item.id}>
          <div
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
          </div>
        </Col>
      )
    })
  }
  const itemTab = () => {
    const arr = [
      {
        label: (
          <div className="text-center">
            <i className="fa-solid fa-user-group"></i>
            <p>Member</p>
          </div>
        ),
        key: "members",
        children: (
          <div className="d-flex ">
            <div className="content-select">
              <div className="title-tab-content mb-1">List member</div>
              <Row>
                <Col>
                  <ErpInput
                    nolabel
                    placeholder="Search"
                    prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                    onChange={(e) => handleFilterText(e.target.value)}
                  />
                </Col>
              </Row>
              <PerfectScrollbar
                onYReachEnd={() => endScrollLoad()}
                style={{
                  maxHeight: "400px",
                  minHeight: "50px"
                }}>
                <Row className="w-100">{renderMember(state.members)}</Row>
              </PerfectScrollbar>
            </div>

            <div
              className={`content-selected ${
                !state.dataSelected.length && `d-flex align-items-center`
              }`}>
              {state.dataSelected.length === 0 && <EmptyContent />}
              {state.dataSelected.length > 0 && (
                <>
                  <div className="title-tab-content">List selected</div>
                  <div className="mt-1 mb-2">
                    <i className="fa-solid fa-user-group me-50"></i>
                    {state.dataSelected.length} member
                  </div>
                  <PerfectScrollbar
                    style={{
                      maxHeight: "400px",
                      minHeight: "50px"
                    }}>
                    <Row>{renderMemberSelected(state.dataSelected)}</Row>
                  </PerfectScrollbar>
                </>
              )}
            </div>
          </div>
        )
      },
      {
        label: (
          <div className="text-center">
            <i className="fa-duotone fa-sitemap"></i>
            <p>Department</p>
          </div>
        ),
        key: "departments",
        children: (
          <div className="d-flex ">
            <div className="content-select">
              <div className="title-tab-content mb-1">List department</div>
              <Row>
                <Col>
                  <ErpInput
                    nolabel
                    placeholder="Search"
                    prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                    onChange={(e) => handleFilterText(e.target.value)}
                  />
                </Col>
              </Row>
              <PerfectScrollbar
                onYReachEnd={() => endScrollLoad()}
                style={{
                  maxHeight: "400px",
                  minHeight: "50px"
                }}>
                <Row className="w-100">
                  {renderDepartment(state.departments)}
                </Row>
              </PerfectScrollbar>
            </div>

            <div
              className={`content-selected ${
                !state.dataSelected.length && `d-flex align-items-center`
              }`}>
              {state.dataSelected.length === 0 && <EmptyContent />}
              {state.dataSelected.length > 0 && (
                <>
                  <div className="title-tab-content">List selected</div>
                  <div className="mt-1 mb-2">
                    <i className="fa-solid fa-user-group me-50"></i>
                    {state.dataSelected.length} department
                  </div>
                  <PerfectScrollbar
                    style={{
                      maxHeight: "400px",
                      minHeight: "50px"
                    }}>
                    <Row>{renderDepartmentSelected(state.dataSelected)}</Row>
                  </PerfectScrollbar>
                </>
              )}
            </div>
          </div>
        )
      },
      {
        label: (
          <div className="text-center">
            <i className="fa-light fa-briefcase"></i>
            <p>Job title</p>
          </div>
        ),
        key: 3,
        children: <div>under construction</div>
      },
      {
        label: (
          <div className="text-center">
            <i className="fa-light fa-file-excel"></i>
            <p>Excel</p>
          </div>
        ),
        key: 4,
        children: "under construction"
      }
    ]
    return arr
  }

  const findKeyByID = (arr = [], id) => {
    const index = arr.findIndex((p) => p.id === id)
    return index
  }

  const checkExistSelected = (id) => {
    const indexID = findKeyByID(state.dataSelected, id)
    return indexID
  }

  const loadData = (props) => {
    props.excepts = member_selected
    defaultModuleApi.getUsers(props).then((res) => {
      const members = state.members
      const concat = !props.search
        ? members.concat(res.data.results)
        : res.data.results
      setState({
        members: concat,
        page: res.data.page,
        recordsTotal: res.data.recordsTotal,
        perPage: res.data.recordsFiltered,
        ...props
      })
    })
  }
  const loadDepartment = (props) => {
    defaultModuleApi.getList("departments").then((res) => {
      const members = state.departments
      const concat = !props.search
        ? members.concat(res.data.results)
        : res.data.results
      setState({
        departments: concat,
        page: res.data.page,
        recordsTotal: res.data.recordsTotal,
        perPage: res.data.recordsFiltered,
        ...props
      })
    })
  }
  const endScrollLoad = () => {
    const page = state.page + 1
    if (state.recordsTotal > state.members.length) {
      loadData({ page: page, search: state.search })
    }
  }

  const handleAdd = () => {
    const dataSelected = state.dataSelected
    handleSelect(state.dataSelected)
    console.log("dataSelected", dataSelected)
  }
  const typingTimeoutRef = useRef(null)

  const handleFilterText = (e) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ search: e, page: 1 })
    }, 500)
  }

  useEffect(() => {
    loadData({ page: state.page, search: state.search })
    loadDepartment({ page: 1 })
  }, [])

  useEffect(() => {
    handleSelect(state.dataSelected, state.typeAdd)
  }, [state.dataSelected])
  return (
    <Tabs
      className="tab-invite"
      tabPosition={"left"}
      items={itemTab()}
      onTabClick={(key) => setState({ typeAdd: key, dataSelected: [] })}
    />
  )
}
export default EmployeesSelect
