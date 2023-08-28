// ** React Imports
import { useContext, useEffect, useState } from "react"

// ** Third Party Components
import classnames from "classnames"
import * as Icon from "react-feather"

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap"

// ** Store & Actions
import { handleSearchQuery } from "@store/navbar"
import { useDispatch } from "react-redux"

// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { axiosApi } from "@apps/utility/api"
import { useFormatMessage } from "@apps/utility/common"
import Autocomplete from "@components/autocomplete"
import { AbilityContext } from "utility/context/Can"

// ** Menu Items Array
import dataSearchConfig from "@src/configs/dataSearchConfig"
import menuConfig from "layouts/commonMenu"
import { getUserData } from "../../../utility/Utils"

const NavbarSearch = ({
  checkLayout,
  saveQuickAccess,
  icon,
  iconRight,
  dataSearch,
  removeSearch
}) => {
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch()

  // ** States
  const [suggestions, setSuggestions] = useState([])
  const [navbarSearch, setNavbarSearch] = useState(false)

  // ** render dataSearch
  const renderDataSearch = async () => {
    if (_.isArray(dataSearch)) {
      setSuggestions(dataSearch)
    } else {
      const dataPage_menu = []
      _.forEach(menuConfig, (item) => {
        if (item.navLink) {
          if (
            item.action &&
            item.resource &&
            ability.can(item.action, item.resource)
          ) {
            dataPage_menu.push({
              title: useFormatMessage(item.title),
              link: item.navLink,
              icon: item.icon,
              type: "module"
            })
          }
        } else {
          if (!_.isEmpty(item.children)) {
            _.forEach(item.children, (value) => {
              if (
                value.action &&
                value.resource &&
                ability.can(value.action, value.resource)
              ) {
                dataPage_menu.push({
                  title: useFormatMessage(value.title),
                  link: value.navLink,
                  icon: value.icon,
                  type: "module"
                })
              }
            })
          }
        }
      })

      const dataPage_custom = []
      _.forEach(dataSearchConfig, (value) => {
        if (
          value.action &&
          value.resource &&
          ability.can(value.action, value.resource)
        ) {
          dataPage_custom.push({
            title: useFormatMessage(value.title),
            link: value.navLink,
            icon: value.icon,
            type: "module"
          })
        }
      })

      const dataPage = {
        groupTitle: useFormatMessage("search.pages"),
        searchLimit: 100,
        data: [...dataPage_menu, ...dataPage_custom]
      }
      let _dataSearch = [dataPage]
      const user = getUserData()
      if (user) {
        await axiosApi.get("/search/get_data_user").then((res) => {
          _dataSearch = [
            dataPage,
            {
              groupTitle: useFormatMessage("search.users"),
              searchLimit: 100,
              data: res.data
            }
          ]
        })
      }
      setSuggestions(_dataSearch)
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    renderDataSearch()
  }, [dataSearch])

  // ** Removes query in store
  const handleClearQueryInStore = () => dispatch(handleSearchQuery(""))

  // ** Function to handle external Input click
  const handleExternalClick = () => {
    if (navbarSearch === true) {
      setNavbarSearch(false)
      handleClearQueryInStore()
    }
  }

  // ** Function to clear input value
  const handleClearInput = (setUserInput) => {
    if (!navbarSearch) {
      setUserInput("")
      handleClearQueryInStore()
    }
  }

  // ** Function to close search on ESC & ENTER Click
  const onKeyDown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      setTimeout(() => {
        setNavbarSearch(false)
        handleClearQueryInStore()
      }, 1)
    }
  }

  // ** Function to handle search suggestion Click
  const handleSuggestionItemClick = () => {
    setNavbarSearch(false)
    handleClearQueryInStore()
  }

  // ** Function to handle search list Click
  const handleListItemClick = (func, link, e) => {
    func(link, e)
    setTimeout(() => {
      setNavbarSearch(false)
    }, 1)
    handleClearQueryInStore()
  }

  return (
    <NavItem
      className={classnames("nav-search", {
        "d-xl-none": removeSearch === true
      })}
      onClick={() => setNavbarSearch(true)}>
      <NavLink className="nav-link-search">
        {icon ? (
          icon
        ) : (
          <svg
            className="ficon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              opacity="0.9"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.6115 2C6.30323 2 2 6.20819 2 11.3993C2 16.5903 6.30323 20.7985 11.6115 20.7985C13.8819 20.7985 15.9684 20.0287 17.613 18.7415L20.7371 21.7886L20.8202 21.8586C21.1102 22.0685 21.5214 22.0446 21.7839 21.7873C22.0726 21.5043 22.072 21.0459 21.7825 20.7636L18.6952 17.7523C20.2649 16.0794 21.2231 13.8487 21.2231 11.3993C21.2231 6.20819 16.9198 2 11.6115 2ZM11.6115 3.44774C16.1022 3.44774 19.7426 7.00776 19.7426 11.3993C19.7426 15.7908 16.1022 19.3508 11.6115 19.3508C7.12086 19.3508 3.48044 15.7908 3.48044 11.3993C3.48044 7.00776 7.12086 3.44774 11.6115 3.44774Z"
              fill="#00003B"
            />
          </svg>
        )}


        {iconRight && <span className="ms-auto">{iconRight}</span>}
      </NavLink>
      <div
        className={classnames("search-input", {
          open: navbarSearch === true
        })}>
        <div className="search-input-icon">
          <Icon.Search />
        </div>
        {navbarSearch ? (
          <Autocomplete
            className="form-control"
            suggestions={suggestions}
            filterKey="title"
            filterHeaderKey="groupTitle"
            grouped={true}
            placeholder="Explore..."
            autoFocus={true}
            onSuggestionItemClick={handleSuggestionItemClick}
            externalClick={handleExternalClick}
            clearInput={(userInput, setUserInput) =>
              handleClearInput(setUserInput)
            }
            onKeyDown={onKeyDown}
            onChange={(e) => dispatch(handleSearchQuery(e.target.value))}
            customRender={(
              item,
              i,
              filteredData,
              activeSuggestion,
              onSuggestionItemClick,
              onSuggestionItemHover
            ) => {
              return (
                <li
                  className={classnames("suggestion-item", {
                    active: filteredData.indexOf(item) === activeSuggestion
                  })}
                  key={i}
                  onClick={(e) => {
                    handleListItemClick(onSuggestionItemClick, item.link, e)
                    if (
                      item.type &&
                      item.type === "module" &&
                      _.isFunction(saveQuickAccess)
                    ) {
                      saveQuickAccess(item.link)
                    }
                  }}
                  onMouseEnter={() => {
                    onSuggestionItemHover(filteredData.indexOf(item))
                  }}>
                  <div
                    className={classnames({
                      "d-flex justify-content-between align-items-center":
                        item.file || item.img
                    })}>
                    <div className="item-container d-flex align-items-center">
                      {item.icon ? (
                        item.icon
                      ) : (
                        <Avatar userId={item.id} src={item.avatar} />
                      )}
                      <div className="item-info ms-1">
                        <p className="align-middle mb-0">
                          {item.full_name
                            ? item.full_name
                            : item.title
                            ? item.title
                            : ""}
                        </p>
                        {item.username ? (
                          <small className="text-muted">@{item.username}</small>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              )
            }}
          />
        ) : null}
        <div className="search-input-close">
          <Icon.X
            className="ficon"
            onClick={(e) => {
              e.stopPropagation()
              setNavbarSearch(false)
              handleClearQueryInStore()
            }}
          />
        </div>
      </div>
    </NavItem>
  )
}

export default NavbarSearch
