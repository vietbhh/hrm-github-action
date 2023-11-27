// ** React Imports
import { Fragment, useEffect, useMemo, useRef } from "react"
import { components } from "react-select"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { downloadApi } from "@apps/modules/download/common/api"

// ** Styles
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { Button } from "reactstrap"
import MemberSelected from "./MemberSelected"

const MemberSelect = (props) => {
  const {
    // ** props
    noLabel,
    label,
    placeholder,
    classNameProps,
    isMulti = true,
    options,
    value,
    selectDepartment = false,
    selectAll = false,
    renderHeader = false,
    // ** methods
    handleOnchange,
    // ** addon
    addOnOption
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    menuIsOpen: false,
    dataMember: [],
    currentOption: []
  })

  const dataEmployee = useSelector((state) => state.users.list)

  const loadData = () => {
    setState({
      loading: true
    })

    if (!_.isUndefined(options)) {
      setState({
        currentOption:
          selectAll === true
            ? [
                {
                  value: "all",
                  label: useFormatMessage(
                    "modules.feed.create_post.text.select_all"
                  ),
                  tag: "@all",
                  avatar: ""
                },
                ...options
              ]
            : [...options],
        loading: false
      })
    } else {
      const resultOption =
        selectAll === true
          ? [
              {
                value: "all",
                label: useFormatMessage(
                  "modules.feed.create_post.text.select_all"
                ),
                tag: "@all",
                avatar: ""
              }
            ]
          : []

      _.forEach(dataEmployee, (item) => {
        resultOption.push({
          value: `${item.id}_employee`,
          label: item.full_name,
          tag: item.email,
          avatar: item.avatar
        })
      })

      if (selectDepartment === true) {
        defaultModuleApi
          .getList("departments", { disableLoading: true })
          .then((res) => {
            _.forEach(res.data.results, (item) => {
              resultOption.push({
                value: `${item.id}_department`,
                label: item.name,
                tag: "department",
                avatar: ""
              })
            })
            setState({
              currentOption: resultOption,
              loading: false
            })
          })
          .catch((err) => {
            setState({
              currentOption: resultOption,
              loading: false
            })
          })
      } else {
        setState({
          currentOption: resultOption,
          loading: false
        })
      }
    }
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [options])

  useEffect(() => {
    if (value !== undefined) {
      const promises = []
      _.forEach(value, (item, index) => {
        const promise = new Promise(async (resolve, reject) => {
          const [currentUser] = state.dataMember.filter((itemFilter) => {
            return itemFilter.value === item.value
          })

          const [userId] = item.value.split("_employee")
          if (currentUser?.avatar_url !== undefined) {
            resolve(currentUser)
          } else {
            await downloadApi
              .getAvatarByUserId(userId)
              .then((response) => {
                const newItem = {
                  ...item,
                  avatar_url: URL.createObjectURL(response.data)
                }
                resolve(newItem)
              })
              .catch((err) => {})
          }
        })

        promises.push(promise)
      })

      Promise.all(promises).then((res) => {
        setState({
          dataMember: res
        })
      })
    }
  }, [value])

  // ** render
  const Option = (props) => {
    const { data } = props
    return (
      <components.Option {...props}>
        <div className="d-flex justify-content-left align-items-start">
          <Avatar
            userId={data.value}
            className="my-0 me-50 mt-25"
            size="sm"
            src={data.avatar}
          />
          <div className="d-flex flex-column">
            <p className="user-name text-truncate mb-0">
              <span className="d-block fw-bold">{data.label}</span>{" "}
              <small className="text-truncate text-username mb-0">
                {data.tag === "department"
                  ? `@${useFormatMessage("modules.calendar.fields.department")}`
                  : data.tag}
              </small>
            </p>
          </div>
        </div>
      </components.Option>
    )
  }

  const CustomMulti = ({ data, ...props }) => {
    return (
      <MemberSelected
        data={data}
        dataMember={state.dataMember}
        currentOption={state.currentOption}
        {...props}
      />
    )
  }

  const formatGroupLabel = (data) => {
    return (
      <div className="d-flex align-items-center justify-content-between select-header">
        <p className="label">{data.label}</p>
        <Button.Ripple
          className="btn-sm close-button"
          onClick={() => {
            setState({
              menuIsOpen: false
            })
          }}>
          {data.btnText}
        </Button.Ripple>
      </div>
    )
  }

  const renderComponent = useMemo(() => {
    const groupOptions = [
      {
        label: "Suggestions",
        btnText: "Close",
        options: state.currentOption
      }
    ]

    return (
      <ErpSelect
        menuIsOpen={state.menuIsOpen}
        nolabel={noLabel}
        label={label}
        placeholder={placeholder}
        className={`select select-member-select ${classNameProps}`}
        isMulti={isMulti}
        options={renderHeader ? groupOptions : state.currentOption}
        value={value}
        components={{ Option: Option, MultiValueLabel: CustomMulti }}
        onChange={(e) => handleOnchange(e)}
        loading={state.loading}
        formatGroupLabel={formatGroupLabel}
        onMenuOpen={() => setState({ menuIsOpen: true })}
        onMenuClose={() => setState({ menuIsOpen: false })}
        {...addOnOption}
      />
    )
  }, [
    value,
    state.loading,
    state.menuIsOpen,
    state.currentOption,
    state.dataMember
  ])

  return <Fragment>{renderComponent}</Fragment>
}

export default MemberSelect