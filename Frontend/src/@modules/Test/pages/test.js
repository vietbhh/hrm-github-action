import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { isEmpty } from "lodash"
import { Fragment, useEffect, useRef, useState } from "react"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import Countdown, { zeroPad } from "react-countdown"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner
} from "reactstrap"
import { testApi } from "../common/api"
import Question from "../components/question"
import QuestionVAKAD from "../components/QuestionVAKAD"
import ResultTestModal from "../modals/ResultTestModal"
const Test = (props) => {
  const modules = useSelector((state) => state.app.modules.test)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const params = useParams()
  const typeUserTest = params.typetest
  const idTest = params.idtest
  const idCandidate = params.id
  const timeTest = useSelector((state) => state.auth.settings["timeTestDisc"])

  const history = useNavigate()
  const [results, setResults] = useState([])
  const [state, setState] = useMergedState({
    percentage: 100,
    loading: true,
    candidateData: {},
    start: false,
    finish: false,
    modal: false,
    number: 0,
    questions: [],
    resultsTest: [],
    typeTest: "",
    typeTestText: "",
    idTest: 0,
    errorChoose: false
  })

  useEffect(() => {
    loadData()
    getQuest()
  }, [])

  const loadData = () => {
    // "candidates"
    defaultModuleApi.getDetail(typeUserTest, idCandidate).then((res) => {
      setState({ candidateData: res.data.data })
    })
  }

  const getQuest = () => {
    testApi.getQuestion(idTest).then((result) => {
      const dataDisc = result.data.questions
      const arrQuest = []
      if (!isEmpty(dataDisc)) {
        Object.keys(dataDisc).map((item, key) => {
          const a = []
          a["data"] = dataDisc[item]["answers"]
          a["selected"] = null
          a["type"] = null
          a["id"] = dataDisc[item]["id"]
          arrQuest.push(a)
        })
      }
      setState({
        questions: arrQuest,
        loading: false,
        typeTest: result.data?.type * 1,
        typeTestText: result.data?.title,
        idTest: result.data?.test_id
      })
    })
  }

  const back = (n) => {
    setState({ number: n })
  }

  const next = (n) => {
    setState({ number: n })
  }

  const handleModal = () => {
    setState({ modal: !state.modal })
  }

  const rendererTimeLeft = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return useFormatMessage("modules.test.text.timeout")
    } else {
      // Render a countdown
      return (
        <>
          {zeroPad(minutes)} : {zeroPad(seconds)}
        </>
      )
    }
  }
  const renderStartButton = () => {
    if (state.start && !state.finish) {
      return (
        <>
          <button type="button" className="btn bg-green cl-green w-100">
            {useFormatMessage("button.started")}
          </button>
        </>
      )
    } else if (state.finish) {
      return (
        <>
          <button
            type="button"
            className="btn bg-green cl-green w-100"
            onClick={finishTest}>
            {useFormatMessage("button.view")}
          </button>
        </>
      )
    } else {
      return (
        <button
          type="button"
          className="btn bg-green cl-green w-100"
          onClick={startTest}>
          {useFormatMessage("button.start")}
        </button>
      )
    }
  }
  const timeLeft = useRef()
  const timeSecond = useRef(timeTest)
  let intervalTimeLeft = useRef()
  const startTest = () => {
    setState({ start: true })
    timeLeft.current.start()
    intervalTimeLeft = setInterval(() => {
      timeSecond.current = timeSecond.current - 1
      if (timeSecond.current <= 0) {
        clearInterval(intervalTimeLeft)
      }
    }, 1000)
  }
  const filterItems = (arr) => {
    return arr.filter((item) => item.selected === null).length
  }

  const calculateTest = (arr) => {
    if (state.typeTest === getOptionValue(options, "type", "disc")) {
      const resultNew = {
        D: arr.filter((item) => item.type === "D").length,
        I: arr.filter((item) => item.type === "I").length,
        S: arr.filter((item) => item.type === "S").length,
        C: arr.filter((item) => item.type === "C").length
      }
      const sortable = Object.entries(resultNew)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

      setState({ resultsTest: sortable })
    }
    if (state.typeTest === getOptionValue(options, "type", "vakad")) {
      const arrT = []
      arr.map((item) => {
        item.data.map((i) => {
          arrT.push(i)
        })
      })

      const holder = {}
      arrT.forEach(function (d) {
        const existValue = d.hasOwnProperty("value")
        let value = d.value
        if (!existValue) value = 0
        if (holder.hasOwnProperty(d.point)) {
          holder[d.point] = holder[d.point] + value
        } else {
          holder[d.point] = value
        }
      })

      const sortable = Object.entries(holder)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

      setState({ resultsTest: sortable })
    }
  }

  const finishTest = () => {
    const notChosse = filterItems(state.questions)
    if (notChosse > 0) {
      notification.showError({
        text: useFormatMessage("modules.test.notification.notchosse")
      })
    } else {
      if (!state.finish) {
        if (state.typeTest === getOptionValue(options, "type", "disc")) {
          const dataTest = []
          state.questions.map((item, key) => {
            const a = { id: item.id, selected: item.selected, type: item.type }
            dataTest.push(a)
          })
          testApi.saveTest(
            dataTest,
            idCandidate,
            state.idTest,
            state.resultsTest,
            typeUserTest,
            state.typeTest
          )
        }
        if (state.typeTest === getOptionValue(options, "type", "vakad")) {
          const dataTest = []
          state.questions.map((item, key) => {
            const a = {
              id: item.id,
              selected: item.selected,
              type: JSON.stringify(item.data)
            }
            dataTest.push(a)
          })
          testApi.saveTest(
            dataTest,
            idCandidate,
            state.idTest,
            state.resultsTest,
            typeUserTest,
            state.typeTest
          )
        }
        setState({ start: false, finish: true, modal: true })
        clearInterval(intervalTimeLeft)
        timeLeft.current.pause()
        calculateTest(state.questions)
      } else {
        setState({ modal: true })
      }
    }
  }

  const endTime = () => {
    //   setPercentage(0)
    setState({ percentage: 0 })
  }

  useEffect(() => {}, [])

  const hanldeOnTick = (e) => {
    //setPercentage(100 - ((timeTestDisc - (e.total / 1000)) / timeTestDisc * 100))
    setState({
      percentage: 100 - ((timeTest - e.total / 1000) / timeTest) * 100
    })
  }
  return (
    <Fragment>
      <Breadcrumbs
        list={[{ title: typeUserTest }, { title: state.typeTestText }]}
        custom={
          <Button.Ripple color="flat-secondary" onClick={() => history(-1)}>
            <i className="fa-regular fa-arrow-left-long me-1"></i>
            <span className="align-self-center">
              {useFormatMessage("app.back")}
            </span>
          </Button.Ripple>
        }
      />
      <Card>
        <CardHeader className="pb-1"></CardHeader>
        <CardBody className="disc">
          {state.loading && (
            <div className="mt-3">
              <AppSpinner />
            </div>
          )}
          {!state.loading && (
            <Row>
              <Col sm="9">
                <div className="text-name">
                  {useFormatMessage("modules.test.text.hi")}{" "}
                  {state.candidateData?.candidate_name &&
                    state.candidateData?.candidate_name}
                  {state.candidateData?.full_name &&
                    state.candidateData?.full_name}
                </div>
                <div className="d-flex mt-1">
                  <Avatar
                    className="avatar-disc"
                    src={
                      !isEmpty(state.candidateData.candidate_avatar) &&
                      state.candidateData.candidate_avatar.url
                    }
                    size="xl"
                  />
                  <div className="mt-auto ">
                    <p className="ms-2 text-name text-let">
                      {useFormatMessage("modules.test.text.let")}
                      <br /> {useFormatMessage("modules.test.text._let")}
                    </p>
                  </div>
                </div>
              </Col>
              <Col sm="2">
                {state.questions.length > 0 && (
                  <>
                    <div className="time-left">
                      <CircularProgressbar
                        styles={buildStyles({
                          // Rotation of path and trail, in number of turns (0-1)
                          rotation: 1,
                          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                          strokeLinecap: "round",
                          // Text size
                          textSize: "16px",
                          // How long animation takes to go from one percentage to another, in seconds
                          pathTransitionDuration: 0.5,
                          // Colors
                          // pathColor: `rgb(42, 210, 95, ${percentage / 100})`,
                          pathColor: `#f9d324`,
                          textColor: "#000000",
                          trailColor: "#f9dd5e6e",
                          backgroundColor: "red"
                        })}
                        value={state.percentage}
                        text={
                          <Countdown
                            onTick={(e) => hanldeOnTick(e)}
                            autoStart={state.start}
                            ref={timeLeft}
                            onComplete={endTime}
                            date={Date.now() + 1000 * timeSecond.current}
                            renderer={rendererTimeLeft}>
                            {useFormatMessage("modules.test.text.end")}
                          </Countdown>
                        }
                      />
                    </div>
                    <div className="start-finish mt-2">
                      {renderStartButton()}
                    </div>
                  </>
                )}
                {state.questions.length <= 0 && (
                  <Alert color="danger">
                    <h4 className="alert-heading text-center ">
                      {useFormatMessage("modules.test.text.not_question")}
                    </h4>
                    <div
                      className="alert-body text-center"
                      style={{ fontSize: "10rem" }}>
                      <i className="fa-light fa-hexagon-exclamation"></i>
                    </div>
                  </Alert>
                )}
              </Col>
              <Col sm="12">
                <hr />
              </Col>
            </Row>
          )}
          {state.start && !state.finish && (
            <>
              <Row className="mt-3">
                <Col sm="12">
                  <div className="question-num">
                    <i className="fas fa-question-circle"></i>{" "}
                    <span>
                      {useFormatMessage("modules.test.fields.question")}{" "}
                      {state.number + 1}
                    </span>
                  </div>
                </Col>
                {state.typeTest === getOptionValue(options, "type", "disc") &&
                  !state.loading && (
                    <Question
                      calculateTest={calculateTest}
                      questions={state.questions}
                      number={state.number}
                      results={results}
                      setResults={setResults}
                    />
                  )}
                {state.typeTest === getOptionValue(options, "type", "vakad") &&
                  !state.loading && (
                    <QuestionVAKAD
                      calculateTest={calculateTest}
                      questions={state.questions}
                      number={state.number}
                      results={results}
                      setResults={setResults}
                      setErrorChoose={setState}
                    />
                  )}
              </Row>
              <Row className="mt-3">
                <Col sm="6" className="text-end">
                  <Button.Ripple
                    type="button"
                    className="btn-cancel"
                    onClick={() => back(state.number - 1)}
                    disabled={state.number === 0}>
                    <span className="align-middle d-sm-inline-block d-none">
                      {useFormatMessage("button.back")}
                    </span>
                  </Button.Ripple>
                </Col>
                <Col sm="6" className="text-start">
                  {!(state.number === state.questions.length - 1) && (
                    <Button
                      type="submit"
                      color="primary"
                      className="btn-next me-1"
                      disabled={
                        state.errorChoose ||
                        state.number === state.questions.length - 1
                      }
                      onClick={() => next(state.number + 1)}>
                      <span className="align-middle d-sm-inline-block d-none">
                        {state.saving && (
                          <Spinner size="sm" className="me-50" />
                        )}
                        {useFormatMessage("button.next")}
                      </span>
                    </Button>
                  )}

                  {state.number === state.questions.length - 1 && (
                    <Button
                      type="submit"
                      color="primary"
                      className="btn-next me-1"
                      onClick={finishTest}>
                      <span className="align-middle d-sm-inline-block d-none">
                        {state.saving && (
                          <Spinner size="sm" className="me-50" />
                        )}
                        {useFormatMessage("button.finish")}
                      </span>
                    </Button>
                  )}
                </Col>
              </Row>
            </>
          )}
          {state.finish && (
            <ResultTestModal
              handleModal={handleModal}
              modal={state.modal}
              resultsTest={state.resultsTest}
            />
          )}

          <Col sm="12" className="text-center mt-2">
            {/* <button onClick={() => done()}>Done and Check</button> */}
          </Col>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Test
