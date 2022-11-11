import { useFormatMessage } from "@apps/utility/common"
import classNames from "classnames"
import React, { Fragment, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Badge } from "reactstrap"
import { useTranslation } from "react-i18next"
import dataSearchConfig from "@src/configs/dataSearchConfig"

const QuickAccess = ({
  menuHover,
  menuCollapsed,
  windowWidth,
  windowWidthMin,
  menuData,
  saveQuickAccess,
  settingPermits,
  defaultMenuNav
}) => {
  const { t } = useTranslation()
  const sidebarCollapsed =
    !menuHover && menuCollapsed === true && windowWidth >= windowWidthMin
  const [listQuickAccess, setListQuickAccess] = useState([])

  useEffect(() => {
    let quick_access = localStorage.getItem("quick_access")
    if (quick_access) {
      quick_access = JSON.parse(quick_access)
    } else {
      quick_access = []
    }
    quick_access.sort(function (a, b) {
      if (a.count > b.count) return -1
      if (a.count < b.count) return 1
      return 0
    })

    const listQuickAccess_ = []
    let count_quick_access = 0
    _.forEach(quick_access, (value, index) => {
      if (count_quick_access <= 2) {
        let checkFound = false
        if (value.navLink === "/profile") {
          listQuickAccess_.push({
            ...value,
            title: useFormatMessage("app.profile")
          })
          checkFound = true
          count_quick_access++
        }

        if (checkFound === false) {
          _.forEach(menuData, (val) => {
            if (
              val.navLink &&
              val.navLink === value.navLink &&
              checkFound === false
            ) {
              listQuickAccess_.push({ ...value, title: t(val.title) })
              checkFound = true
              count_quick_access++
            } else {
              if (
                val.children &&
                !_.isEmpty(val.children) &&
                checkFound === false
              ) {
                _.forEach(val.children, (val2) => {
                  if (
                    val2.navLink &&
                    val2.navLink === value.navLink &&
                    checkFound === false
                  ) {
                    listQuickAccess_.push({ ...value, title: t(val2.title) })
                    checkFound = true
                    count_quick_access++
                  } else {
                    if (
                      val2.children &&
                      !_.isEmpty(val2.children) &&
                      checkFound === false
                    ) {
                      _.forEach(val2.children, (val3) => {
                        if (
                          val3.navLink &&
                          val3.navLink === value.navLink &&
                          checkFound === false
                        ) {
                          listQuickAccess_.push({
                            ...value,
                            title: t(val3.title)
                          })
                          checkFound = true
                          count_quick_access++
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }

        if (checkFound === false) {
          {
            _.forEach(settingPermits, (item) => {
              if (
                item.navLink &&
                item.navLink === value.navLink &&
                checkFound === false
              ) {
                listQuickAccess_.push({
                  ...value,
                  title: useFormatMessage(item.title)
                })
                checkFound = true
                count_quick_access++
              }
            })
          }
        }

        if (checkFound === false) {
          _.forEach(defaultMenuNav, (item) => {
            if (
              item.link &&
              item.link === value.navLink &&
              checkFound === false
            ) {
              listQuickAccess_.push({
                ...value,
                title: useFormatMessage(item.title)
              })
              checkFound = true
              count_quick_access++
            }
          })
        }

        if (checkFound === false) {
          _.forEach(dataSearchConfig, (item) => {
            if (
              item.navLink &&
              item.navLink === value.navLink &&
              checkFound === false
            ) {
              listQuickAccess_.push({
                ...value,
                title: useFormatMessage(item.title)
              })
              checkFound = true
              count_quick_access++
            }
          })
        }
      }
    })

    setListQuickAccess(listQuickAccess_)
  }, [localStorage.getItem("quick_access")])

  return (
    <Fragment>
      <p
        className={classNames("text-quick-access", {
          "text-quick-access-2": sidebarCollapsed
        })}>
        <span className="quick-access-expanded">
          {useFormatMessage("layout.quick_access")}
        </span>
        <span className="quick-access-not-expanded">
          {useFormatMessage("layout.quick")}
        </span>
      </p>

      <ul className={classNames({ "ul-menuHover": sidebarCollapsed })}>
        {listQuickAccess[0] && (
          <li>
            <NavLink
              to={listQuickAccess[0].navLink}
              onClick={() => saveQuickAccess(listQuickAccess[0].navLink)}>
              <div className="quick-access-expanded quick-access-circle quick-access-circle-green"></div>
              <span className="quick-access-expanded">
                {listQuickAccess[0].title}
              </span>

              <div className="quick-access-not-expanded quick-access-star-circle quick-access-star-circle-green">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.92 14.3203C17.66 14.5703 17.54 14.9393 17.601 15.2903L18.49 20.2103C18.561 20.6303 18.391 21.0493 18.04 21.2903C17.7 21.5403 17.25 21.5703 16.87 21.3703L12.441 19.0603C12.28 18.9803 12.11 18.9293 11.941 18.9293H11.67C11.57 18.9393 11.481 18.9803 11.4 19.0193L6.96995 21.3403C6.74995 21.4503 6.49995 21.4903 6.25995 21.4503C5.65995 21.3303 5.27095 20.7693 5.36995 20.1793L6.25995 15.2593C6.31995 14.9003 6.19995 14.5403 5.94095 14.2803L2.32995 10.7803C2.02995 10.4803 1.91995 10.0493 2.06095 9.6503C2.19095 9.2593 2.52995 8.9693 2.94995 8.9003L7.91995 8.1793C8.29995 8.1393 8.62995 7.9103 8.79995 7.5703L10.99 3.0803C11.04 2.9803 11.11 2.8893 11.191 2.8103L11.28 2.7403C11.32 2.6893 11.38 2.6503 11.441 2.6103L11.55 2.5703L11.72 2.5003H12.141C12.521 2.5403 12.851 2.7693 13.021 3.0993L15.24 7.5703C15.4 7.9003 15.71 8.1203 16.07 8.1793L21.04 8.9003C21.46 8.9603 21.811 9.2503 21.95 9.6503C22.08 10.0493 21.97 10.4903 21.66 10.7803L17.92 14.3203Z"
                    fill="white"
                  />
                </svg>
                <Badge
                  pill
                  color="warning"
                  className="badge-up quick-access-badge"></Badge>
              </div>
            </NavLink>
          </li>
        )}

        {listQuickAccess[1] && (
          <li>
            <NavLink
              to={listQuickAccess[1].navLink}
              onClick={() => saveQuickAccess(listQuickAccess[1].navLink)}>
              <div className="quick-access-expanded quick-access-circle quick-access-circle-orange"></div>
              <span className="quick-access-expanded">
                {listQuickAccess[1].title}
              </span>

              <div className="quick-access-not-expanded quick-access-star-circle quick-access-star-circle-orange">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.92 14.3203C17.66 14.5703 17.54 14.9393 17.601 15.2903L18.49 20.2103C18.561 20.6303 18.391 21.0493 18.04 21.2903C17.7 21.5403 17.25 21.5703 16.87 21.3703L12.441 19.0603C12.28 18.9803 12.11 18.9293 11.941 18.9293H11.67C11.57 18.9393 11.481 18.9803 11.4 19.0193L6.96995 21.3403C6.74995 21.4503 6.49995 21.4903 6.25995 21.4503C5.65995 21.3303 5.27095 20.7693 5.36995 20.1793L6.25995 15.2593C6.31995 14.9003 6.19995 14.5403 5.94095 14.2803L2.32995 10.7803C2.02995 10.4803 1.91995 10.0493 2.06095 9.6503C2.19095 9.2593 2.52995 8.9693 2.94995 8.9003L7.91995 8.1793C8.29995 8.1393 8.62995 7.9103 8.79995 7.5703L10.99 3.0803C11.04 2.9803 11.11 2.8893 11.191 2.8103L11.28 2.7403C11.32 2.6893 11.38 2.6503 11.441 2.6103L11.55 2.5703L11.72 2.5003H12.141C12.521 2.5403 12.851 2.7693 13.021 3.0993L15.24 7.5703C15.4 7.9003 15.71 8.1203 16.07 8.1793L21.04 8.9003C21.46 8.9603 21.811 9.2503 21.95 9.6503C22.08 10.0493 21.97 10.4903 21.66 10.7803L17.92 14.3203Z"
                    fill="white"
                  />
                </svg>
                <Badge
                  pill
                  color="warning"
                  className="badge-up quick-access-badge"></Badge>
              </div>
            </NavLink>
          </li>
        )}

        {listQuickAccess[2] && (
          <li>
            <NavLink
              to={listQuickAccess[2].navLink}
              onClick={() => saveQuickAccess(listQuickAccess[2].navLink)}>
              <div className="quick-access-expanded quick-access-circle quick-access-circle-blue"></div>
              <span className="quick-access-expanded">
                {listQuickAccess[2].title}
              </span>

              <div className="quick-access-not-expanded quick-access-star-circle quick-access-star-circle-blue">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.92 14.3203C17.66 14.5703 17.54 14.9393 17.601 15.2903L18.49 20.2103C18.561 20.6303 18.391 21.0493 18.04 21.2903C17.7 21.5403 17.25 21.5703 16.87 21.3703L12.441 19.0603C12.28 18.9803 12.11 18.9293 11.941 18.9293H11.67C11.57 18.9393 11.481 18.9803 11.4 19.0193L6.96995 21.3403C6.74995 21.4503 6.49995 21.4903 6.25995 21.4503C5.65995 21.3303 5.27095 20.7693 5.36995 20.1793L6.25995 15.2593C6.31995 14.9003 6.19995 14.5403 5.94095 14.2803L2.32995 10.7803C2.02995 10.4803 1.91995 10.0493 2.06095 9.6503C2.19095 9.2593 2.52995 8.9693 2.94995 8.9003L7.91995 8.1793C8.29995 8.1393 8.62995 7.9103 8.79995 7.5703L10.99 3.0803C11.04 2.9803 11.11 2.8893 11.191 2.8103L11.28 2.7403C11.32 2.6893 11.38 2.6503 11.441 2.6103L11.55 2.5703L11.72 2.5003H12.141C12.521 2.5403 12.851 2.7693 13.021 3.0993L15.24 7.5703C15.4 7.9003 15.71 8.1203 16.07 8.1793L21.04 8.9003C21.46 8.9603 21.811 9.2503 21.95 9.6503C22.08 10.0493 21.97 10.4903 21.66 10.7803L17.92 14.3203Z"
                    fill="white"
                  />
                </svg>
                <Badge
                  pill
                  color="warning"
                  className="badge-up quick-access-badge"></Badge>
              </div>
            </NavLink>
          </li>
        )}
      </ul>
    </Fragment>
  )
}

export default QuickAccess
