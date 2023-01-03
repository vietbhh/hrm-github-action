import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useEffect } from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/inventories.scss"
import AddInventoriesModal from "../components/modals/AddInventoriesModal"
import { Pagination } from "antd"
import { assetInventoryApi } from "../common/api"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { Link } from "react-router-dom"

const Inventories = () => {
  const [state, setState] = useMergedState({
    modalAdd: false,
    currentPage: 1,
    pageSize: 15,
    total: 0,
    data: [],
    loading: true
  })

  const toggleModalAdd = () => {
    setState({ modalAdd: !state.modalAdd })
  }

  const loadData = () => {
    setState({ loading: true })
    const data = {
      currentPage: state.currentPage,
      pageSize: state.pageSize
    }

    assetInventoryApi
      .getListInventory(data)
      .then((res) => {
        setState({
          data: res.data.data,
          total: res.data.recordsTotal,
          loading: false
        })
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }

  const changePage = (page, pageSize) => {
    setState({ currentPage: page })
  }

  useEffect(() => {
    loadData()
  }, [state.currentPage])

  return (
    <Fragment>
      <Breadcrumbs
        className="team-attendance-breadcrumbs"
        list={[
          {
            title: useFormatMessage("modules.asset.title"),
            link: "/asset"
          },
          {
            title: useFormatMessage("modules.asset.inventories.title")
          }
        ]}
      />

      <Card className="inventories">
        <CardHeader>
          <span className="title">
            {useFormatMessage("modules.asset.title")}{" "}
            {useFormatMessage("modules.asset.inventories.title")}
          </span>
        </CardHeader>
        <CardBody>
          {state.loading && (
            <Row>
              <Col xs="12">
                <DefaultSpinner />
              </Col>
            </Row>
          )}
          {!state.loading && (
            <Row>
              <Col xs="12" sm="4" md="3">
                <div
                  className="base d-flex align-items-center cursor-pointer"
                  onClick={() => {
                    toggleModalAdd()
                  }}>
                  <div
                    className="icon me-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "#EFEEEE" }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 10.75H17C14.58 10.75 13.25 9.42 13.25 7V5C13.25 2.58 14.58 1.25 17 1.25H19C21.42 1.25 22.75 2.58 22.75 5V7C22.75 9.42 21.42 10.75 19 10.75ZM17 2.75C15.42 2.75 14.75 3.42 14.75 5V7C14.75 8.58 15.42 9.25 17 9.25H19C20.58 9.25 21.25 8.58 21.25 7V5C21.25 3.42 20.58 2.75 19 2.75H17Z"
                        fill="#292D32"
                      />
                      <path
                        d="M7 22.75H5C2.58 22.75 1.25 21.42 1.25 19V17C1.25 14.58 2.58 13.25 5 13.25H7C9.42 13.25 10.75 14.58 10.75 17V19C10.75 21.42 9.42 22.75 7 22.75ZM5 14.75C3.42 14.75 2.75 15.42 2.75 17V19C2.75 20.58 3.42 21.25 5 21.25H7C8.58 21.25 9.25 20.58 9.25 19V17C9.25 15.42 8.58 14.75 7 14.75H5Z"
                        fill="#292D32"
                      />
                      <path
                        d="M6 10.75C3.38 10.75 1.25 8.62 1.25 6C1.25 3.38 3.38 1.25 6 1.25C8.62 1.25 10.75 3.38 10.75 6C10.75 8.62 8.62 10.75 6 10.75ZM6 2.75C4.21 2.75 2.75 4.21 2.75 6C2.75 7.79 4.21 9.25 6 9.25C7.79 9.25 9.25 7.79 9.25 6C9.25 4.21 7.79 2.75 6 2.75Z"
                        fill="#292D32"
                      />
                      <path
                        d="M18 22.75C15.38 22.75 13.25 20.62 13.25 18C13.25 15.38 15.38 13.25 18 13.25C20.62 13.25 22.75 15.38 22.75 18C22.75 20.62 20.62 22.75 18 22.75ZM18 14.75C16.21 14.75 14.75 16.21 14.75 18C14.75 19.79 16.21 21.25 18 21.25C19.79 21.25 21.25 19.79 21.25 18C21.25 16.21 19.79 14.75 18 14.75Z"
                        fill="#292D32"
                      />
                    </svg>
                  </div>
                  <div className="name">
                    {useFormatMessage(
                      "modules.asset.inventories.text.add_more_asset_inventory"
                    )}
                  </div>
                </div>
              </Col>
              {_.map(state.data, (value, index) => {
                return (
                  <Col key={index} xs="12" sm="4" md="3">
                    <Link to={`/asset/inventories/${value.id}`}>
                      <div
                        className={`base d-flex align-items-center cursor-pointer`}>
                        <div className="icon me-2 d-flex align-items-center justify-content-center">
                          <i className="fa-regular fa-box-circle-check"></i>
                        </div>
                        <div className="name">{value.inventory_name}</div>
                      </div>
                    </Link>
                  </Col>
                )
              })}
            </Row>
          )}

          {state.total > 0 && (
            <Row>
              <Col xs="12" className="d-flex mt-2">
                <Pagination
                  className="ms-auto"
                  defaultCurrent={state.currentPage}
                  defaultPageSize={state.pageSize}
                  total={state.total}
                  showSizeChanger={false}
                  onChange={changePage}
                />
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      <AddInventoriesModal
        modal={state.modalAdd}
        toggleModal={toggleModalAdd}
      />
    </Fragment>
  )
}

export default Inventories
