import AppCollapse from "@apps/components/app-collapse"
import { ErpCheckbox } from "@apps/components/common/ErpField"
import {
  objectMap,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { filter, forEach, isEmpty, map } from "lodash"
import { isUndefined } from "lodash-es"
import { Fragment, useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"

const getPermitId = (permits, list, defaultVal = false) => {
  let data = { ...list }
  forEach(permits, (item, index) => {
    if (item.hasOwnProperty("id")) {
      const perId = parseInt(item.id)
      data = {
        ...data,
        [perId]: {
          id: perId,
          checked: defaultVal
        }
      }
    } else {
      data = getPermitId(item, data, defaultVal)
    }
  })
  return data
}

const PermitFormTabSelection = (props) => {
  const { listPermits, selectPermissions, updatePermissions } = props
  const [state, setState] = useMergedState(
    isEmpty(listPermits) ? {} : getPermitId(listPermits, {})
  )
  const [select, setSelect] = useMergedState(
    isEmpty(listPermits?.modules)
      ? {}
      : objectMap(listPermits?.modules, (k, v) => {
          return {
            total: Object.keys(v).length - 1,
            selected: {},
            manage: false,
            manageItem: v.manage,
            childs: v
          }
        })
  )
  const modulesPer = isEmpty(listPermits?.modules)
    ? []
    : map(listPermits?.modules, (item, index) => {
        const selectedModule = select?.[index]
        const manageId = parseInt(selectedModule.manageItem?.id)
        return {
          title: (
            <Fragment>
              <ErpCheckbox
                id={`modules_${index}`}
                name={`modules_${index}`}
                label={index}
                innerRef={(ref) => {
                  global["ref_" + index] = ref
                  global["per_manage_" + manageId] = ref
                }}
                data-name={index}
                onChange={(e) => {
                  const perIds = getPermitId(item, {}, e.target.checked)

                  if (e.target.checked) {
                    selectedModule.manage = true
                    selectedModule.selected = objectMap(perIds, (k, v) => {
                      return true
                    })
                    delete selectedModule.selected?.[manageId]
                  } else {
                    selectedModule.manage = false
                    selectedModule.selected = {}
                  }
                  setSelect({
                    ...select,
                    [index]: selectedModule
                  })
                  setState({
                    ...state,
                    ...perIds
                  })
                }}
              />
            </Fragment>
          ),
          content: (
            <div className="d-flex ms-3 flex-wrap mb-0">
              {map(item, (per, perIndex) => {
                const perId = parseInt(per.id)
                return perIndex === "manage" ? null : (
                  <Fragment key={perIndex}>
                    <div className="col-md-6 pb-1">
                      <ErpCheckbox
                        id={`modules_${index}_${perIndex}`}
                        name={`modules_${index}_${perIndex}`}
                        label={perIndex}
                        data-parent={index}
                        innerRef={(ref) => (global["per_" + perId] = ref)}
                        checked={state?.[perId]?.checked}
                        onChange={(e) => {
                          let currentState = { ...state }
                          if (e.target.checked) {
                            selectedModule.selected = {
                              ...selectedModule.selected,
                              [perId]: true
                            }
                          } else {
                            delete selectedModule.selected?.[perId]
                          }

                          if (
                            Object.keys(selectedModule.selected).length > 0 &&
                            selectedModule.total ===
                              Object.keys(selectedModule.selected).length
                          ) {
                            global[`ref_${index}`].checked = true
                            global[`ref_${index}`].indeterminate = false
                            selectedModule.manage = true
                            currentState = {
                              ...currentState,
                              [manageId]: {
                                id: manageId,
                                checked: true
                              }
                            }
                          } else if (
                            Object.keys(selectedModule.selected).length > 0 &&
                            selectedModule.total >
                              Object.keys(selectedModule.selected).length
                          ) {
                            global[`ref_${index}`].indeterminate = true
                            global[`ref_${index}`].checked = false
                            selectedModule.manage = false
                            currentState = {
                              ...currentState,
                              [manageId]: {
                                id: manageId,
                                checked: false
                              }
                            }
                          } else {
                            global[`ref_${index}`].checked = false
                            global[`ref_${index}`].indeterminate = false
                            selectedModule.manage = false
                            currentState = {
                              ...currentState,
                              [manageId]: {
                                id: manageId,
                                checked: false
                              }
                            }
                          }
                          setSelect({
                            ...select,
                            [index]: selectedModule
                          })
                          setState({
                            ...currentState,
                            [perId]: {
                              id: perId,
                              checked: e.target.checked
                            }
                          })
                        }}
                      />

                      <small className="text-secondary fw-light text-smaller">
                        {per.description}
                      </small>
                    </div>
                  </Fragment>
                )
              })}
            </div>
          )
        }
      })

  useEffect(() => {
    const perIds = map(
      filter(state, (item) => {
        if (item.checked === true) return item
      }),
      (item) => parseInt(item.id)
    )
    forEach(select, (item) => {
      if (item.manage) {
        forEach(item.selected, (k, v) => {
          const index = perIds.indexOf(parseInt(v))
          if (index > -1) {
            perIds.splice(index, 1)
          }
        })
      }
    })
    selectPermissions(perIds)
  }, [state])

  useEffect(() => {
    let checkPermissions = {}
    let selectPers = { ...select }
    forEach(updatePermissions, (item) => {
      const perId = parseInt(item)
      checkPermissions = {
        ...checkPermissions,
        [perId]: {
          id: perId,
          checked: true
        }
      }
      if (!isUndefined(global["per_" + perId])) {
        const parent = global["per_" + perId].getAttribute("data-parent")
        const selectedModule = selectPers[parent]
        selectedModule.selected = {
          ...selectedModule.selected,
          [perId]: true
        }
        selectPers = {
          ...selectPers,
          [parent]: selectedModule
        }

        global[`ref_${parent}`].indeterminate = true
        global[`ref_${parent}`].checked = false
      }
      if (!isUndefined(global["per_manage_" + perId])) {
        global[`per_manage_${perId}`].indeterminate = false
        global[`per_manage_${perId}`].checked = true
        const parentName =
          global["per_manage_" + perId].getAttribute("data-name")
        const selectedModule = selectPers[parentName]
        selectedModule.manage = true
        forEach(select?.[parentName].childs, (v, k) => {
          if (k !== "manage") {
            selectedModule.selected = {
              ...selectedModule.selected,
              [parseInt(v.id)]: true
            }
            checkPermissions = {
              ...checkPermissions,
              [parseInt(v.id)]: {
                id: parseInt(v.id),
                checked: true
              }
            }
          }
        })
        selectPers = {
          ...selectPers,
          [parentName]: selectedModule
        }
      }
    })
    setSelect(selectPers)
    setState({
      ...state,
      ...checkPermissions
    })
  }, [updatePermissions])

  return (
    <Fragment>
      <PerfectScrollbar
        style={{
          maxHeight: "400px",
          minHeight: "50px"
        }}>
        {map(listPermits, (item, index) => {
          return (
            <Fragment key={index}>
              <div className="d-block mb-1">
                <h6 className="mb-50">
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    <i className="iconly-Lock icli"></i>{" "}
                    {useFormatMessage(`modules.permissions.display.${index}`)}
                  </span>
                </h6>
                {index !== "modules" &&
                  map(item, (subItem, subIndex) => {
                    return (
                      <div className="d-block ms-2 mb-1" key={subIndex}>
                        <p className="fw-bold font-italic mb-50 text-capitalize">
                          {subIndex}
                        </p>
                        {map(subItem, (per, perIndex) => {
                          const perId = parseInt(per.id)
                          return (
                            <Fragment key={perIndex}>
                              <div className="d-flex mb-25">
                                <div className="ms-3">
                                  <ErpCheckbox
                                    id={`${index}_${subIndex}_${perIndex}`}
                                    name={`${index}_${subIndex}_${perIndex}`}
                                    label={perIndex}
                                    checked={state?.[perId]?.checked}
                                    onChange={(e) => {
                                      setState({
                                        ...state,
                                        [perId]: {
                                          id: perId,
                                          checked: e.target.checked
                                        }
                                      })
                                    }}
                                  />
                                </div>
                                <div className="ms-auto">
                                  <small className="text-secondary fw-light text-smaller">
                                    {per.description}
                                  </small>
                                </div>
                              </div>
                            </Fragment>
                          )
                        })}
                      </div>
                    )
                  })}

                {index === "modules" && (
                  <AppCollapse
                    className="permissions-modules-list"
                    data={modulesPer}
                    accordion
                  />
                )}

                <hr />
              </div>
            </Fragment>
          )
        })}
      </PerfectScrollbar>
    </Fragment>
  )
}
export default PermitFormTabSelection
