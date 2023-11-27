// ** React Imports
import { Fragment, useMemo } from "react"
import { components } from "react-select"
// ** Styles
import classnames from "classnames"
// ** Components
import { Skeleton } from "antd"

const MemberSelected = (props) => {
  const {
    // ** props
    data,
    dataMember,
    ...rest
    // ** methods
  } = props

  const [currentMember] =
    dataMember === undefined
      ? {}
      : dataMember.filter((itemFilter) => {
          return itemFilter.value === data.value
        })

  // ** render
  const renderAvatar = () => {
    if (currentMember?.avatar_url === undefined) {
      return (
        <div
          className={classnames(
            props.className,
            "rounded-circle avatar-component"
          )}>
          <Skeleton.Avatar
            active={true}
            size="default"
            shape="circle"
            className="d-flex"
          />
        </div>
      )
    }

    return (
      <div
        className={classnames(
          props.className,
          "rounded-circle avatar-component avatar-image"
        )}
        style={{
          backgroundImage: `url(${currentMember.avatar_url})`
        }}></div>
    )
  }

  const renderComponent = useMemo(() => {
    return (
      <components.MultiValueLabel {...rest}>
        <div className="d-flex align-items-center">
          <Fragment>{renderAvatar()}</Fragment>
          <small>{data.label}</small>
        </div>
      </components.MultiValueLabel>
    )
  }, [dataMember])

  return <Fragment>{renderComponent}</Fragment>
}

export default MemberSelected