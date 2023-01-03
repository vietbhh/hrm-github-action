import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useEffect } from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/inventories.scss"
import AddInventoriesModal from "../components/modals/AddInventoriesModal"
import { Pagination } from "antd"
import { assetInventoryApi } from "../common/api"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { Link, useParams } from "react-router-dom"

const InventoriesDetail = () => {
  const [state, setState] = useMergedState({
    loadPage: true
  })

  const id = useParams().id

  const loadData = () => {
    assetInventoryApi
      .getInventory(id)
      .then((res) => {})
      .catch((err) => {})
  }

  useEffect(() => {
    console.log(id)
  }, [id])

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
            title: useFormatMessage("modules.asset.inventories.title"),
            link: "/asset/inventories"
          },
          {
            title: ""
          }
        ]}
      />
    </Fragment>
  )
}

export default InventoriesDetail
