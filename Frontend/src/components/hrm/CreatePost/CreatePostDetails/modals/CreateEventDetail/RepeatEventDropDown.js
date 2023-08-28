// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Dropdown } from "antd"
import { Fragment } from "react"
// ** Components

export const getAffix = (number) => {
  if (_.isEmpty(number)) {
    return ""
  } else if (parseInt(number) === 1) {
    return "st"
  } else if (parseInt(number) === 2) {
    return "nd"
  } else if (parseInt(number) === 3) {
    return "rd"
  }

  return "th"
}

const RepeatEventDropDown = (props) => {
  const {
    // ** props
    valueRepeat,
    // ** methods
    setValueRepeat,
    toggleModalCustomRepeat
  } = props

  const [state, setState] = useMergedState({
    openRepeatDropdown: false
  })

  const weekDay = valueRepeat?.week_day
  const dateInMonth = valueRepeat?.value_repeat
  const orderWeekDateInMonth = valueRepeat?.order_week_date_in_month

  const currentValueRepeat = valueRepeat

  const toggleOpenRepeatDropdown = (status = undefined) => {
    setState({
      openRepeatDropdown:
        status === undefined ? !state.openRepeatDropdown : status
    })
  }

  const handleOpenChange = (open) => {
    toggleOpenRepeatDropdown(open)
  }

  const handleChangeValueRepeat = (text) => {
    const newValue = {
      value: text
    }

    if (text === "repeat_every_weekday_on") {
      newValue["week_day"] = weekDay
    } else if (text === "repeat_every_month_on") {
      newValue["date_in_month"] = dateInMonth
    } else if (text === "repeat_on_week_day_num_every_month") {
      newValue["order_week_date_in_month"] = orderWeekDateInMonth
      newValue["week_day"] = weekDay
    }

    setValueRepeat(newValue)
  }

  const handleClickCustomize = () => {
    toggleModalCustomRepeat()
  }

  // ** render
  const renderCurrentRepeatText = (value) => {
    if (value === "repeat_every_weekday_on") {
      return (
        <Fragment>
          {useFormatMessage(
            "modules.feed.create_event.text.repeat_every_weekday_on",
            {
              week_day: useFormatMessage(`common.day_in_week.${weekDay}`)
            }
          )}
        </Fragment>
      )
    } else if (value === "repeat_every_month_on") {
      return (
        <Fragment>
          {useFormatMessage(
            "modules.feed.create_event.text.repeat_every_month_on",
            {
              date: `${dateInMonth}${getAffix(dateInMonth)}`
            }
          )}
        </Fragment>
      )
    } else if (value === "repeat_on_week_day_num_every_month") {
      return (
        <Fragment>
          {useFormatMessage(
            "modules.feed.create_event.text.repeat_on_week_day_num_every_month",
            {
              order: useFormatMessage(
                `modules.feed.create_event.text.ordinal_number.${orderWeekDateInMonth}`
              ),
              week_day: useFormatMessage(`common.day_in_week.${weekDay}`)
            }
          )}
        </Fragment>
      )
    }

    return (
      <Fragment>
        {useFormatMessage(`modules.feed.create_event.text.${value}`)}
      </Fragment>
    )
  }

  return (
    <div onClick={() => toggleOpenRepeatDropdown()}>
      <Dropdown
        open={state.openRepeatDropdown}
        onOpenChange={handleOpenChange}
        menu={{
          items: [
            {
              key: "repeat_every_day",
              label: (
                <div
                  onClick={() => handleChangeValueRepeat("repeat_every_day")}>
                  {useFormatMessage(
                    "modules.feed.create_event.text.repeat_every_day"
                  )}
                </div>
              )
            },
            {
              key: "repeat_every_weekday_on",
              label: (
                <div
                  onClick={() =>
                    handleChangeValueRepeat("repeat_every_weekday_on")
                  }>
                  <Fragment>
                    {renderCurrentRepeatText("repeat_every_weekday_on")}
                  </Fragment>
                </div>
              )
            },
            {
              key: "repeat_every_weekday",
              label: (
                <div
                  onClick={() =>
                    handleChangeValueRepeat("repeat_every_weekday")
                  }>
                  {useFormatMessage(
                    "modules.feed.create_event.text.repeat_every_weekday"
                  )}
                </div>
              )
            },
            {
              key: "repeat_every_month_on",
              label: (
                <div
                  onClick={() =>
                    handleChangeValueRepeat("repeat_every_month_on")
                  }>
                  <Fragment>
                    {renderCurrentRepeatText("repeat_every_month_on")}
                  </Fragment>
                </div>
              )
            },
            {
              key: "repeat_on_week_day_num_every_month",
              label: (
                <div
                  onClick={() =>
                    handleChangeValueRepeat(
                      "repeat_on_week_day_num_every_month"
                    )
                  }>
                  <Fragment>
                    {renderCurrentRepeatText(
                      "repeat_on_week_day_num_every_month"
                    )}
                  </Fragment>
                </div>
              )
            },
            {
              key: "no_repeat",
              label: (
                <div onClick={() => handleChangeValueRepeat("no_repeat")}>
                  {useFormatMessage("modules.feed.create_event.text.no_repeat")}
                </div>
              )
            },
            {
              key: "customize",
              label: (
                <div onClick={() => handleClickCustomize()}>
                  {useFormatMessage("modules.feed.create_event.text.customize")}
                </div>
              )
            }
          ]
        }}
        placement="bottom"
        trigger={["click"]}
        overlayClassName="feed dropdown-div-repeat">
        <div className="div-repeat">
          <span className="text-repeat">
            <Fragment>
              {renderCurrentRepeatText(currentValueRepeat?.value)}
            </Fragment>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none">
            <path
              d="M8.61251 0H4.45918H0.719181C0.0791811 0 -0.240819 0.773333 0.212515 1.22667L3.66585 4.68C4.21918 5.23333 5.11918 5.23333 5.67251 4.68L6.98585 3.36667L9.12585 1.22667C9.57251 0.773333 9.25251 0 8.61251 0Z"
              fill="#9399A2"
            />
          </svg>
        </div>
      </Dropdown>
    </div>
  )
}

export default RepeatEventDropDown
