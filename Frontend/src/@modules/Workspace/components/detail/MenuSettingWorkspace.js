import { Dropdown, Space } from "antd"
import { useFormatMessage } from "@apps/utility/common"
import { Button, Card, CardBody } from "reactstrap"

import { ErpSelect } from "@apps/components/common/ErpField"
import { useNavigate } from "react-router-dom"
const MenuSettingWorkspace = (props) => {
  const { menu, idWorkgroup } = props
  const menuSettingLayout = [
    {
      label: (
        <div className="d-flex align-items-center">
          <div className="me-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none">
              <path
                d="M16.4934 11.8398H23.4934"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.50659 11.8398L9.50659 12.8398L12.5066 9.83984"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.4934 21.1729H23.4934"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.50659 21.1729L9.50659 22.1728L12.5066 19.1729"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.0001 29.3337H20.0001C26.6667 29.3337 29.3334 26.667 29.3334 20.0003V12.0003C29.3334 5.33366 26.6667 2.66699 20.0001 2.66699H12.0001C5.33341 2.66699 2.66675 5.33366 2.66675 12.0003V20.0003C2.66675 26.667 5.33341 29.3337 12.0001 29.3337Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-bold">
              {useFormatMessage(
                `modules.workspace.display.nav_menu_setting_layout.feed`
              )}
            </span>
          </div>
        </div>
      ),
      value: "feed"
    },
    {
      label: (
        <div className="d-flex align-items-center">
          <div className="me-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none">
              <path
                d="M16.4934 11.8398H23.4934"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.50659 11.8398L9.50659 12.8398L12.5066 9.83984"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.4934 21.1729H23.4934"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.50659 21.1729L9.50659 22.1728L12.5066 19.1729"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.0001 29.3337H20.0001C26.6667 29.3337 29.3334 26.667 29.3334 20.0003V12.0003C29.3334 5.33366 26.6667 2.66699 20.0001 2.66699H12.0001C5.33341 2.66699 2.66675 5.33366 2.66675 12.0003V20.0003C2.66675 26.667 5.33341 29.3337 12.0001 29.3337Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-bold">
              {useFormatMessage(
                `modules.workspace.display.nav_menu_setting_layout.approvals`
              )}
            </span>
          </div>
        </div>
      ),
      value: "approvals"
    },
    {
      label: (
        <div className="d-flex align-items-center">
          <div className="me-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none">
              <path
                d="M16.16 17.04C16.0667 17.0266 15.9467 17.0266 15.84 17.04C13.4934 16.96 11.6267 15.04 11.6267 12.68C11.6267 10.2666 13.5734 8.30664 16 8.30664C18.4134 8.30664 20.3734 10.2666 20.3734 12.68C20.36 15.04 18.5067 16.96 16.16 17.04Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24.9868 25.8401C22.6134 28.0134 19.4668 29.3334 16.0001 29.3334C12.5334 29.3334 9.38676 28.0134 7.01343 25.8401C7.14676 24.5867 7.94676 23.3601 9.37343 22.4001C13.0268 19.9734 19.0001 19.9734 22.6268 22.4001C24.0534 23.3601 24.8534 24.5867 24.9868 25.8401Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.0001 29.3337C23.3639 29.3337 29.3334 23.3641 29.3334 16.0003C29.3334 8.63653 23.3639 2.66699 16.0001 2.66699C8.63628 2.66699 2.66675 8.63653 2.66675 16.0003C2.66675 23.3641 8.63628 29.3337 16.0001 29.3337Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-bold">
              {useFormatMessage(
                `modules.workspace.display.nav_menu_setting_layout.request`
              )}
            </span>
          </div>
        </div>
      ),
      value: "request"
    },
    {
      label: (
        <div className="d-flex align-items-center">
          <div className="me-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none">
              <path
                d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66675 17.1736V14.8269C2.66675 13.4402 3.80008 12.2936 5.20008 12.2936C7.61341 12.2936 8.60008 10.5869 7.38675 8.49357C6.69341 7.29357 7.10675 5.73357 8.32008 5.04024L10.6267 3.72024C11.6801 3.09357 13.0401 3.46691 13.6667 4.52024L13.8134 4.77357C15.0134 6.86691 16.9867 6.86691 18.2001 4.77357L18.3467 4.52024C18.9734 3.46691 20.3334 3.09357 21.3867 3.72024L23.6934 5.04024C24.9067 5.73357 25.3201 7.29357 24.6267 8.49357C23.4134 10.5869 24.4001 12.2936 26.8134 12.2936C28.2001 12.2936 29.3467 13.4269 29.3467 14.8269V17.1736C29.3467 18.5602 28.2134 19.7069 26.8134 19.7069C24.4001 19.7069 23.4134 21.4136 24.6267 23.5069C25.3201 24.7202 24.9067 26.2669 23.6934 26.9602L21.3867 28.2802C20.3334 28.9069 18.9734 28.5336 18.3467 27.4802L18.2001 27.2269C17.0001 25.1336 15.0267 25.1336 13.8134 27.2269L13.6667 27.4802C13.0401 28.5336 11.6801 28.9069 10.6267 28.2802L8.32008 26.9602C7.10675 26.2669 6.69341 24.7069 7.38675 23.5069C8.60008 21.4136 7.61341 19.7069 5.20008 19.7069C3.80008 19.7069 2.66675 18.5602 2.66675 17.1736Z"
                stroke="#696760"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-bold">
              {useFormatMessage(
                `modules.workspace.display.nav_menu_setting_layout.setting`
              )}
            </span>
          </div>
        </div>
      ),
      value: "setting"
    }
  ]
  const menuFilter = menuSettingLayout.filter((i) => i.key !== menu)

  const navigate = useNavigate()
  const changeMenu = (menu) => {
    let url = "/workspace/" + idWorkgroup
    if (menu === "approvals") {
      url = url + "/pending-posts"
    } else if (menu === "request") {
      url = url + "/request-join"
    } else if (menu === "setting") {
      url = url + "/setting"
    }
    navigate(url)
  }
  return (
    <Card>
      <CardBody className="p-50 d-flex align-items-center justify-content-center w-100 p-1">
        <ErpSelect
          className="select-option-menu-workgroup"
          formGroupClass="w-100 mb-0"
          nolabel={true}
          defaultValue={
            menuSettingLayout[
              menuSettingLayout.findIndex((i) => i.value === menu)
            ]
          }
          options={menuSettingLayout}
          isClearable={false}
          onChange={(value) => changeMenu(value.value)}
        />
      </CardBody>
    </Card>
  )
}

export default MenuSettingWorkspace
