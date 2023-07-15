import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { timeoffApi } from "@modules/TimeOff/common/api"
import notAuthImg from "@src/assets/images/pages/not-authorized.svg"
import "@styles/base/pages/page-misc.scss"
import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Col, Row } from "reactstrap"

const RequestTimeOff = () => {
  const [state, setState] = useMergedState({
    loading: true,
    error: "",
    fail: false
  })
  const useQuery = () => new URLSearchParams(useLocation().search)
  const query = useQuery()
  const action = query.get("action")
  const token = query.get("token")

  const loadApi = () => {
    const params = {
      action: action,
      token: token,
      error: ""
    }
    timeoffApi
      .getMailRequest(params)
      .then((res) => {
        setState({
          loading: false,
          error: res.data.error,
          fail: res.data.fail
        })
      })
      .catch((err) => {
        setState({ loading: false, error: "error", fail: true })
      })
  }

  useEffect(() => {
    setState({ loading: true })
    loadApi()
  }, [])

  const renderTitle = () => {
    if (state.fail === false) {
      return (
        <>
          <h2 className="mb-1">
            {useFormatMessage(
              "modules.time_off_requests.mail.request_has_been"
            ) +
              " " +
              useFormatMessage("modules.time_off_requests.mail." + action)}
          </h2>
        </>
      )
    } else {
      if (state.error === "updated") {
        const title =
          useFormatMessage("modules.time_off_requests.mail.fail_to") +
          " " +
          useFormatMessage("modules.time_off_requests.mail." + action) +
          " " +
          useFormatMessage("modules.time_off_requests.mail.request")
        const text =
          useFormatMessage("modules.time_off_requests.mail.text_request") +
          " " +
          useFormatMessage("modules.time_off_requests.mail.text." + action)

        return (
          <>
            <h2 className="mb-1">
              <i
                className="far fa-exclamation-triangle"
                style={{
                  color: "rgb(255, 184, 67)",
                  marginRight: "8px",
                  fontSize: "18px",
                  position: "relative",
                  bottom: "2px"
                }}></i>
              {title}
            </h2>
            <p className="mb-2">{text}</p>
          </>
        )
      } else {
        const title =
          useFormatMessage("modules.time_off_requests.mail.fail_to") +
          " " +
          useFormatMessage("modules.time_off_requests.mail.action") +
          " " +
          useFormatMessage("modules.time_off_requests.mail.request")
        return (
          <>
            <h2 className="mb-1">
              <i
                className="far fa-exclamation-triangle"
                style={{
                  color: "rgb(255, 184, 67)",
                  marginRight: "8px",
                  fontSize: "18px",
                  position: "relative",
                  bottom: "2px"
                }}></i>
              {title}
            </h2>
          </>
        )
      }
    }
  }

  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <h2 className="brand-text text-primary ms-1">Life.</h2>
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          {state.loading ? (
            <Row>
              <Col size="12" className="text-center mt-1 mb-3">
                <DefaultSpinner />
              </Col>
            </Row>
          ) : (
            <>
              {renderTitle()}
              <Button
                tag={Link}
                to="/"
                color="primary"
                className="btn-sm-block mb-1">
                Back to home
              </Button>
            </>
          )}
          <img
            className="img-fluid"
            src={notAuthImg}
            alt="Not authorized page"
          />
        </div>
      </div>
    </div>
  )
}
export default RequestTimeOff
