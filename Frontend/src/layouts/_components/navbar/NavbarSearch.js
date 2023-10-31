// ** React Imports
import { Fragment, useContext, useEffect, useState } from "react"

// ** Third Party Components
import classnames from "classnames"
import * as Icon from "react-feather"

// ** Reactstrap Imports
import { Modal, ModalBody, NavItem, NavLink } from "reactstrap"

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
      console.log(1)
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
        console.log(2)
        setNavbarSearch(false)
        handleClearQueryInStore()
      }, 1)
    }
  }

  // ** Function to handle search suggestion Click
  const handleSuggestionItemClick = () => {
    console.log(3)
    setNavbarSearch(false)
    handleClearQueryInStore()
  }

  // ** Function to handle search list Click
  const handleListItemClick = (func, link, e) => {
    func(link, e)
    setTimeout(() => {
      console.log(4)
      setNavbarSearch(false)
    }, 1)
    handleClearQueryInStore()
  }

  return (
    <Fragment>
      <NavItem
        className={classnames("nav-search", {
          "d-xl-none": removeSearch === true
        })}
        onClick={() => {
          console.log(5)
          setNavbarSearch(true)
        }}>
        <NavLink className="nav-link-search">
          {icon ? (
            icon
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none">
              <path
                d="M11.5 21.5C16.7467 21.5 21 17.2467 21 12C21 6.75329 16.7467 2.5 11.5 2.5C6.25329 2.5 2 6.75329 2 12C2 17.2467 6.25329 21.5 11.5 21.5Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 22.5L20 20.5"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {iconRight && <span className="ms-auto">{iconRight}</span>}
        </NavLink>
      </NavItem>
      <Modal
        isOpen={navbarSearch}
        toggle={() => {
          console.log(6)
          setNavbarSearch(!navbarSearch)
        }}
        className="modal-search-input">
        <ModalBody>
          <div className="search-input open">
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
                              <small className="text-muted">
                                @{item.username}
                              </small>
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
                  console.log(7)
                  e.stopPropagation()
                  setNavbarSearch(false)
                  handleClearQueryInStore()
                }}
              />
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default NavbarSearch
