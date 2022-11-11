import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { objectMap, useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import UILoader from "@core/components/ui-loader"
import React, { useEffect, useRef, useState } from "react"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap"
import { isObjEmpty } from "utility/Utils"
import { moduleManagerApi } from "../../common/api"
import ModuleGroupPermitFormComponent from "./form/ModuleGroupPermitFormComponent"
import ModuleMainForm from "./form/ModuleMainForm"
import ModuleMetaFormComponent from "./form/ModuleMetaFormComponent"
import ModulePermitFormComponent from "./form/ModulePermitFormComponent"
import ModuleRouteFormComponent from "./form/ModuleRouteFormComponent"

function ModuleFormModal(props) {
  const mainFormRef = useRef()
  const [routes, setRoutes] = useState([])
  const [defaultRoutes, setDefaultRoutes] = useState([])
  const [metas, setMetas] = useState([])
  const [permits, setPermits] = useState([])
  const [groupsPermits, setGroupsPermits] = useState([])
  const [currentType, setCurentModuleType] = useState("default")
  const [active, setActive] = useState("1")
  const [areInputting, setAreInputting] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMetas(props.updateData?.metas || [])
    if (props.updateData && props.updateData.permits) {
      setPermits(props.updateData ? props.updateData.permits : [])
    } else {
      setPermits(props.permits ? props.permits : [])
    }
    if (props.updateData && props.updateData.customRoutes) {
      setDefaultRoutes(props.updateData ? props.updateData.customRoutes : [])
    } else {
      setDefaultRoutes(
        props.moduleConfig.routes ? props.moduleConfig.routes[currentType] : []
      )
    }
    let defaultGroupData = {}
    if (props.updateData && props.updateData.groupsPermits) {
      setGroupsPermits(props.updateData.groupsPermits)
    } else {
      props.permits.map((item) => {
        props.groups.map((group) => {
          defaultGroupData = {
            ...defaultGroupData,
            [group.id]: {
              ...defaultGroupData[group.id],
              [item.name]: parseInt(group.id) === 1
            }
          }
        })
      })
      setGroupsPermits(defaultGroupData)
    }
  }, [
    props.permits,
    props.groups,
    props.updateData,
    props.updateData.metas,
    props.modalLoading
  ])
  const setCurentType = (type) => {
    if (type === "extend" && active === "1") {
      toggle("2")
      setMetas([])
    }
    setCurentModuleType(type)

    if (props.updateData && props.updateData.customRoutes) {
      let routeData = routes.filter((item) => !item.default)
      if (type !== "extend") {
        routeData = [...routeData, ...props.moduleConfig.routes[type]]
      }
      setDefaultRoutes(routeData)
    } else {
      setDefaultRoutes(
        props.moduleConfig.routes ? props.moduleConfig.routes[type] : []
      )
    }
  }

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const fieldSelectOpions = []
  const moduleSelectOptions = [
    ...props.modules.map((item) => {
      const fieldData = []
      if (!isObjEmpty(item.metasFields)) {
        objectMap(item.metasFields, (k, v) => {
          fieldData.push({
            value: v.field,
            label: v.field
          })
        })
      }
      fieldSelectOpions[item.name] = fieldData
      return {
        value: item.name,
        label: `${item.name} (${item.tableName})`
      }
    }),
    ...props.systemModules.map((item) => {
      const fieldData = []
      if (!isObjEmpty(item.metasFields)) {
        objectMap(item.metasFields, (k, v) => {
          fieldData.push({
            value: v.field,
            label: v.field
          })
        })
      }
      fieldSelectOpions[item.name] = fieldData
      return {
        value: item.name,
        label: `${item.name} (${item.tableName})`
      }
    })
  ]
  const moduleFormHandleSubmit = (values) => {
    if (areInputting) {
      SwAlert.showWarning({
        title: "Oops...",
        text: useFormatMessage("manage.module.form.inputting_alert"),
        confirmButtonText: useFormatMessage("button.skip")
      }).then((res) => {
        if (res.value) {
          formModalSubmit(values)
        }
      })
    } else {
      formModalSubmit(values)
    }
  }
  const formModalSubmit = (values) => {
    values.customRoutes = routes
    values.metas = metas
    values.permits = permits
    values.groupsPermits = groupsPermits
    setLoading(true)
    if (props.updateData) {
      moduleManagerApi
        .putUpdate(values, props.updateData.module.id)
        .then((res) => {
          setLoading(false)
          props.handleModal()
          props.loadData()
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    } else {
      moduleManagerApi
        .postAdd(values)
        .then((res) => {
          props.handleModal()
          setLoading(false)
          props.loadData()
          notification.showSuccess({
            text: useFormatMessage("notification.create.success")
          })
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          notification.showError({
            text: useFormatMessage("notification.create.error")
          })
        })
    }
  }
  const handleSubmit = () => {
    if (mainFormRef.current) {
      mainFormRef.current.props.onSubmit()
    }
  }
  const onCloseModal = () => {
    setCurentModuleType("default")
    toggle("1")
    setMetas([])
  }
  if (props.modalLoading) return <DefaultSpinner />
  else
    return (
      <React.Fragment>
        <Modal
          isOpen={props.modal}
          onClosed={onCloseModal}
          toggle={props.handleModal}
          backdrop={"static"}
          className="modal-lg">
          <UILoader blocking={loading} loader={<DefaultSpinner />}>
            <ModalHeader toggle={props.handleModal}>
              {useFormatMessage("manage.module.form." + props.modalTitle)}
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col md="12">
                  <ModuleMainForm
                    moduleConfig={props.moduleConfig}
                    innerRef={mainFormRef}
                    moduleFormHandleSubmit={moduleFormHandleSubmit}
                    setCurentType={setCurentType}
                    updateData={props.updateData && props.updateData.module}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="divider">
                    <div className="divider-text">
                      {useFormatMessage("manage.module.form.configuration")}
                    </div>
                  </div>
                  <Nav tabs>
                    {currentType === "default" && (
                      <NavItem>
                        <NavLink
                          active={active === "1"}
                          onClick={() => {
                            toggle("1")
                          }}>
                          {useFormatMessage(
                            "manage.module.form.fields_management"
                          )}
                        </NavLink>
                      </NavItem>
                    )}

                    <NavItem>
                      <NavLink
                        active={active === "2"}
                        onClick={() => {
                          toggle("2")
                        }}>
                        {useFormatMessage(
                          "manage.module.form.routes_management"
                        )}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === "3"}
                        onClick={() => {
                          toggle("3")
                        }}>
                        {useFormatMessage(
                          "manage.module.form.permits_management"
                        )}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === "4"}
                        onClick={() => {
                          toggle("4")
                        }}>
                        {useFormatMessage(
                          "manage.module.form.groups_permits_management"
                        )}
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent className="py-50" activeTab={active}>
                    <TabPane tabId="1">
                      {currentType === "default" && (
                        <ModuleMetaFormComponent
                          fieldSelectOpions={fieldSelectOpions}
                          moduleSelectOptions={moduleSelectOptions}
                          setMetas={setMetas}
                          metas={metas}
                          moduleConfig={props.moduleConfig}
                          setAreInputting={setAreInputting}
                          modalLoading={props.modalLoading}
                        />
                      )}
                    </TabPane>
                    <TabPane tabId="2">
                      <ModuleRouteFormComponent
                        currentType={currentType}
                        defaultRoutes={defaultRoutes}
                        setRoutes={setRoutes}
                        moduleConfig={props.moduleConfig}
                        routes={routes}
                        updateData={
                          props.updateData && props.updateData.customRoutes
                        }
                      />
                    </TabPane>
                    <TabPane tabId="3">
                      <ModulePermitFormComponent
                        setPermits={setPermits}
                        permits={permits}
                        updateData={
                          props.updateData && props.updateData.permits
                        }
                      />
                    </TabPane>
                    <TabPane tabId="4">
                      <ModuleGroupPermitFormComponent
                        permits={permits}
                        groupsPermits={groupsPermits}
                        setGroupsPermits={setGroupsPermits}
                        groups={props.groups}
                        updateData={props.updateData}
                      />
                    </TabPane>
                  </TabContent>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button.Ripple
                color="primary"
                type="submit"
                onClick={handleSubmit}>
                {useFormatMessage("app.save")}
              </Button.Ripple>
            </ModalFooter>
          </UILoader>
        </Modal>
      </React.Fragment>
    )
}

export default ModuleFormModal
