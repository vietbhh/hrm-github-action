// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import SettingTableModal from "@apps/modules/default/components/modals/SettingTableModal"
import notification from "@apps/utility/notification"
import "@styles/react/apps/app-todo.scss"
//import ShortcutButtonsPlugin from "assets/plugins/shortcut-buttons-flatpickr/dist/shortcut-buttons-flatpickr"
import { isEmpty } from "lodash-es"
import React, { useContext, useEffect, useState } from "react"
import Flatpickr from "react-flatpickr"
import { NavLink as RRNavLink } from "react-router-dom"
import {
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  UncontrolledButtonDropdown
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import blueBg from "../assets/images/blue.svg"
import redBg from "../assets/images/red.svg"
import yellowBg from "../assets/images/yellow.svg"
import { candidatesApi, recruitmentsApi } from "../common/api"
import PreviewListCV from "../components/details/PreviewListCV"
import UploadCVModal from "../components/modals/UploadCVModal"
const RecruitmentLayout = (props) => {
  const pathname = window.location.pathname
  const ability = useContext(AbilityContext)
  const [windowWidth, setWindowWidth] = useState(null)
  const { state, setState, loadData, metas, options, module, moduleName } =
    props
  useEffect(() => {
    if (window !== undefined) {
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", setWindowWidth(window.innerWidth))
    }
  }, [])

  const toggleSettingModal = () => {
    setState({
      settingModal: !state.settingModal
    })
  }

  const toggleUploadCVModal = () => {
    setState({
      uploadCVModal: !state.uploadCVModal
    })
  }

  const dateTimeToYMD = (date) => {
    const dateFrom = isEmpty(date)
      ? ""
      : new Date(date[0]).toLocaleDateString("en-CA")
    const dateTo = isEmpty(date)
      ? ""
      : new Date(date[1]).toLocaleDateString("en-CA")
    const stateEx = { ...state.params }
    stateEx.dateFrom = dateFrom
    stateEx.dateTo = dateTo
    loadData({ ...stateEx })
  }

  const handleAddListCVInvalid = (
    name,
    index,
    newListCVInvalid,
    error = ""
  ) => {
    const newListCVInvalidTemp = { ...newListCVInvalid }
    if (
      _.some(
        newListCVInvalidTemp,
        (itemInvalid) => parseInt(itemInvalid.key) === parseInt(index)
      )
    ) {
      const [newValueFilter] = _.filter(
        _.map(newListCVInvalid, (itemInvalid) => {
          if (parseInt(itemInvalid.key) === parseInt(index)) {
            return {
              ...itemInvalid,
              [name]: error !== "" ? error : `empty_${name}`
            }
          }
        }),
        (itemFilter) => {
          return itemFilter !== undefined
        }
      )
      newListCVInvalidTemp[index] = newValueFilter
    } else {
      newListCVInvalidTemp[index] = {
        key: index,
        [name]: error !== "" ? error : `empty_${name}`
      }
    }
    newListCVInvalid = newListCVInvalidTemp
    return newListCVInvalid
  }

  const handleSetListInvalidCV = () => {
    let newListCVInvalid = {}
    const arrDuplicateEmail = []
    const arrEmptyName = []
    const arrEmptyEmail = []
    const arrEmptyPhone = []

    const newListCVUpload = { ...state.listCVUpload }
    _.map(newListCVUpload, (item, index) => {
      if (item.name.trim().length === 0) {
        arrEmptyName.push(item.key)
      }
      if (item.email.trim().length === 0) {
        arrEmptyEmail.push(item.key)
      } else {
        _.map(newListCVUpload, (itemSecond, indexSecond) => {
          if (
            item.email === itemSecond.email &&
            index !== indexSecond &&
            item.recruitment_proposal?.value ===
              itemSecond.recruitment_proposal?.value
          ) {
            arrDuplicateEmail.push(itemSecond.key)
          }
        })
        if (state.listEmployeeEmail[item.recruitment_proposal?.value]) {
          state.listEmployeeEmail[item.recruitment_proposal?.value].map(
            (employeeEmail) => {
              if (employeeEmail === item.email) {
                if (
                  !arrDuplicateEmail.some(
                    (itemDuplicate) =>
                      parseInt(itemDuplicate) === parseInt(item.key)
                  )
                ) {
                  arrDuplicateEmail.push(item.key)
                }
              }
            }
          )
        }
      }

      if (item.phone.trim().length === 0) {
        arrEmptyPhone.push(item.key)
      }
    })
    if (arrDuplicateEmail.length > 0) {
      arrDuplicateEmail.map((item) => {
        newListCVInvalid = handleAddListCVInvalid(
          "email",
          item,
          { ...newListCVInvalid },
          "duplicate_email"
        )
      })
    }

    if (arrEmptyName.length > 0) {
      arrEmptyName.map((item) => {
        newListCVInvalid = handleAddListCVInvalid("name", item, {
          ...newListCVInvalid
        })
      })
    }

    if (arrEmptyEmail.length > 0) {
      arrEmptyEmail.map((item) => {
        newListCVInvalid = handleAddListCVInvalid("email", item, {
          ...newListCVInvalid
        })
      })
    }

    if (arrEmptyPhone.length > 0) {
      arrEmptyPhone.map((item) => {
        newListCVInvalid = handleAddListCVInvalid("phone", item, {
          ...newListCVInvalid
        })
      })
    }

    setState({
      listCVInvalid: newListCVInvalid
    })
  }

  const exportExcel = () => {
    const params = { ...state.params }
    candidatesApi
      .exportData(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Candidates.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      })
      .catch((err) => {
        setState({ loading_export: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.error")
        })
      })
  }
  const loadEmployeeEmail = (arrJob = []) => {
    recruitmentsApi.loadEmployeeEmail(arrJob).then((res) => {
      setState({
        listEmployeeEmail: res.data
      })
    })
  }

  // ** effect
  useEffect(() => {
    if (
      state.listCVUpload !== undefined &&
      Object.keys(state.listCVUpload).length > 0
    ) {
      handleSetListInvalidCV()
    }
  }, [state.listCVUpload, state.listEmployeeEmail])

  // ** render
  const settingMenu = [
    {
      id: "approve",
      title: "Approval",
      type: "item",
      action: "approve",
      resource: "recruitments",
      icon: "fal fa-check-circle",
      moduleName: "recruitments",
      navLink: "/recruitments/approval"
    },
    {
      id: "request",
      title: "Request",
      type: "item",
      action: "add",
      resource: "about",
      icon: "icpega Briefcase-Portfolio",
      moduleName: "recruitments",
      navLink: "/recruitments/request"
    },
    {
      id: "jobs",
      title: "Jobs",
      type: "item",
      action: "add",
      resource: "about",
      icon: "iconly-Star icli",
      moduleName: "recruitments",
      navLink: "/recruitments/jobs"
    },
    {
      id: "candidates",
      title: "Candidates",
      type: "item",
      action: "add",
      resource: "about",
      icon: "iconly-Document icli",
      moduleName: "candidates",
      navLink: "/candidates"
    },
    {
      id: "careers",
      title: "careers",
      type: "item",
      action: "add",
      resource: "about",
      icon: "fas fa-id-card-alt",
      moduleName: "careers",
      navLink: "/careers"
    }
  ]
  const renderMenu = () => {
    return settingMenu.map((menu) => {
      const icon = menu.icon
      if (ability.can(menu.id, menu.moduleName)) {
        return (
          <NavItem key={menu.id}>
            <NavLink
              exact="true"
              to={menu.navLink}
              tag={RRNavLink}
              active={pathname.startsWith(menu.navLink)}>
              <i className={`${icon}`}></i>
              <span className="d-md-inline-block d-none align-middle ms-1">
                {menu.title}
              </span>
            </NavLink>
          </NavItem>
        )
      }
    })
  }

  const renderUploadCVModal = () => {
    return (
      <UploadCVModal
        modal={state.uploadCVModal}
        listCVUpload={state.listCVUpload}
        metas={metas}
        moduleName={moduleName}
        handleModal={toggleUploadCVModal}
        setState={setState}
      />
    )
  }

  const renderPreviewCV = () => {
    return (
      <PreviewListCV
        visible={state.showPreviewCV}
        listCVUpload={state.listCVUpload}
        listCVInvalid={state.listCVInvalid}
        listFileCV={state.listFileCV}
        listEmployeeEmail={state.listEmployeeEmail}
        recruitmentProposal={state.recruitmentProposal}
        metas={metas}
        moduleName={moduleName}
        setState={setState}
        loadData={loadData}
        changeJob={loadEmployeeEmail}
      />
    )
  }

  return (
    <React.Fragment>
      {props.breadcrumbs}
      <Card className="extraWidthLayoutPage">
        <CardBody className="p-md-0 recruitment">
          <Row className="contentWrapper">
            <div
              className={`col-sm-12 col-md-3 sideBarColumn ${
                windowWidth >= 769 ? "nav-vertical" : ""
              }`}>
              <h1 className="box-title">
                {useFormatMessage("modules.recruitments.title.mainTitle")}
              </h1>

              <div className="quickCalendarWrapper mt-5">
                <img src={blueBg} className="blueBg" />
                <img src={redBg} className="redBg" />
                <img src={yellowBg} className="yellowBg" />
                <div className="quickCalendar">
                  <Flatpickr
                    name="quickCalendar"
                    type="date"
                    ref={(flatpickrRef) =>
                      (global["quickCalendar"] = flatpickrRef)
                    }
                    options={{
                      mode: "range",
                      dateFormat: "Y-m-d",
                      inline: true,
                      shorthandCurrentMonth: true,
                      plugins: [
                        /* ShortcutButtonsPlugin({
                          button: [
                            {
                              label: "Today",
                              class: "btn btn-sm ms-50",
                              title: "Today"
                            },
                            {
                              label: "x",
                              class: "btn btn-sm ms-50",
                              title: "Clear date selection"
                            }
                          ],
                          onClick: (index, fp) => {
                            switch (index) {
                              case 0:
                                fp.setDate(new Date())
                                break
                              case 1:
                                fp.clear()
                                dateTimeToYMD("")
                                break
                            }
                          }
                        }) */
                      ]
                    }}
                    className="d-none"
                    autoComplete="off"
                    onChange={(date) => {
                      if (date.length >= 2) {
                        dateTimeToYMD(date)
                      }
                    }}
                  />
                </div>
              </div>
              <Nav className="module-menu nav-left w-100" tabs>
                {renderMenu()}
              </Nav>
            </div>
            <div className="col-sm-12 col-md-9 mainContent">
              <div className="row add-new d-flex align-items-center">
                {props.filter}
                {props.viewType}
                {moduleName === "candidates" && (
                  <UncontrolledButtonDropdown className="w-auto d-block ml-1 pr-1">
                    <DropdownToggle
                      color="flat-primary"
                      tag="div"
                      className="text-primary btn-table-more">
                      <i className="iconly-Filter icli"></i>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem
                        className="w-100"
                        onClick={() => exportExcel()}>
                        <i className="fa-regular fa-download"></i>
                        <span className="align-middle ms-1">
                          {useFormatMessage("app.export")}
                        </span>
                      </DropdownItem>

                      <DropdownItem
                        className="w-100"
                        onClick={() => toggleUploadCVModal()}>
                        <i className="fa-regular fa-upload"></i>
                        <span className="align-middle ms-1">
                          {useFormatMessage(
                            "modules.candidates.button.upload_cv"
                          )}
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                )}
              </div>
              {props.children}
            </div>
          </Row>
        </CardBody>
      </Card>
      <SettingTableModal
        modal={state.settingModal}
        handleModal={toggleSettingModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
      />
      {renderUploadCVModal()}
      {renderPreviewCV()}
    </React.Fragment>
  )
}
export default RecruitmentLayout
