// ** React Imports
import { Fragment, useEffect, useMemo } from "react"
import { components } from "react-select"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
// ** Components
import { ErpSelect, ErpUserSelect } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"

const MemberSelect = (props) => {
  const {
    // ** props
    noLabel,
    label,
    placeholder,
    classNameProps,
    isMulti = true,
    options = [],
    value,
    selectDepartment = false,
    selectAll = false,
    // ** methods
    handleOnchange,
    // ** addon
    addOnOption
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    currentOption: []
  })

  const dataEmployee = useSelector((state) => state.users.list)

  const loadData = () => {
    setState({
      loading: true
    })

    if (options.length > 0) {
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
  }, [])

  // ** render
  const Option = (props) => {
    const { data } = props
    return (
      <>
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
                    ? `@${useFormatMessage(
                        "modules.calendar.fields.department"
                      )}`
                    : data.tag}
                </small>
              </p>
            </div>
          </div>
        </components.Option>
      </>
    )
  }

  const CustomMulti = ({ data, ...props }) => {
    return (
      <components.MultiValueLabel {...props}>
        <div className="d-flex align-items-center">
          <Avatar
            src={data.avatar}
            userId={data.value}
            className="my-0 me-50"
            size="sm"
          />
          <small>{data.label}</small>
        </div>
      </components.MultiValueLabel>
    )
  }

  const renderComponent = useMemo(() => {
    return (
      <ErpSelect
        nolabel={noLabel}
        label={label}
        placeholder={placeholder}
        className={`select select-member-select ${classNameProps}`}
        isMulti={isMulti}
        options={state.currentOption}
        value={value}
        components={{ Option: Option, MultiValueLabel: CustomMulti }}
        onChange={(e) => handleOnchange(e)}
        loading={state.loading}
        {...addOnOption}
      />
    )
  }, [value, state.loading])

  return <Fragment>{renderComponent}</Fragment>
}

export default MemberSelect
