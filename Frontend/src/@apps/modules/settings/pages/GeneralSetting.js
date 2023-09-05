import SquareLoader from "@apps/components/spinner/SquareLoader"
import { useFormatMessage } from "@apps/utility/common"
import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import { generalApi } from "../common/api"
import GeneralForm from "../components/general/GeneralForm"
import SettingLayout from "../components/SettingLayout"
const GeneralSetting = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generalApi
      .get()
      .then((data) => {
        setData(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Card className="setting-wrapper">
      <CardHeader className="">
        <CardTitle>
          <h2>
            <Button.Ripple
              tag="span"
              className="btn-icon rounded-circle "
              color="primary"
              style={{
                padding: "0.5rem"
              }}>
              <i className="icpega Briefcase-Portfolio"></i>
            </Button.Ripple>{" "}
            <span
              style={{
                marginLeft: "15px",
                fontSize: "1.2rem",
                color: "black"
              }}>
              {useFormatMessage("common.comInfo")}
            </span>
          </h2>
        </CardTitle>
      </CardHeader>
      <CardBody>
        {loading ? (
          <SquareLoader className="mt-3" />
        ) : (
          <GeneralForm data={data} />
        )}
      </CardBody>
    </Card>
  )
}

export default GeneralSetting
