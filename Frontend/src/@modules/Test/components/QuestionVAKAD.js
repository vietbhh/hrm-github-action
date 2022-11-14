import { Badge, Col, Row } from "reactstrap"
import { ErpRadio } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
const QuestionVAKAD = (props) => {
  const {
    number,
    questions,
    results,
    setResults,
    calculateTest,
    setErrorChoose
  } = props

  const indexOfArray = (arr, value) => {
    return arr.findIndex((item) => item.id === value)
  }

  const existValue = (arr) => {
    const valueArr = [1, 2, 3, 4]
    let check = false
    valueArr.map((e) => {
      const filterArray = arr.filter((item) => {
        return item.value === e
      })
      if (filterArray.length >= 2) check = true
    })
    return check
  }

  const checkChooseAll = (arr) => {
    const filterArray = arr.filter((item) => {
      return !item?.value
    })
    if (filterArray.length > 0) {
      return false
    }
    return true
  }
  const choseResult = (e, value) => {
    const dataQuestion = questions[number].data
    const indexOf = indexOfArray(dataQuestion, e.id)
    dataQuestion[indexOf].value = value

    const checkExist = existValue(dataQuestion)
    setErrorChoose({ errorChoose: checkExist })
    // check choose full
    const checkChoose = checkChooseAll(dataQuestion)
    if (checkChoose) questions[number]["selected"] = e.id
    setResults(dataQuestion)
    calculateTest(questions)
  }

  const renderQuests = () => {
    return (
      <>
        {questions.length ? (
          <>
            {questions[number]["data"].map((item) => {
              return (
                <Col
                  sm={12}
                  className="d-flex align-items-center mt-1 ms-auto justify-content-center "
                  key={`r_` + item.id}>
                  <ErpRadio
                    className="radio-test-custom custom-control-success custom-radios me-2"
                    inline
                    label="1"
                    name={`vakad_` + item.id}
                    defaultChecked={item.value === 1}
                    id={`1_` + item.id}
                    onClick={() => choseResult(item, 1)}
                  />
                  <ErpRadio
                    className="radio-test-custom custom-control-success custom-radios me-2"
                    inline
                    label="2"
                    name={`vakad_` + item.id}
                    defaultChecked={item.value === 2}
                    id={`2_` + item.id}
                    onClick={() => choseResult(item, 2)}
                  />
                  <ErpRadio
                    className="radio-test-custom custom-control-success custom-radios me-2"
                    inline
                    label="3"
                    name={`vakad_` + item.id}
                    defaultChecked={item.value === 3}
                    id={`3_` + item.id}
                    onClick={() => choseResult(item, 3)}
                  />
                  <ErpRadio
                    className="radio-test-custom custom-control-success custom-radios me-2"
                    inline
                    label="4"
                    name={`vakad_` + item.id}
                    defaultChecked={item.value === 4}
                    id={`4_` + item.id}
                    onClick={() => choseResult(item, 4)}
                  />
                  <span
                    className="ms-2 title-disc text-center"
                    onClick={() => choseResult(item)}>
                    {item.title}
                  </span>
                </Col>
              )
            })}
          </>
        ) : (
          <div className="no-results show">
            <h5>No Question</h5>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <Col sm={12} className="mt-2 m-1 ps-5 pe-5">
        <h3>{useFormatMessage("modules.test.text.instructions")}</h3>
        {useFormatMessage("modules.test.text.instructions_des")}
      </Col>
      <Col sm={12}>
        <div className="row">
          <div className="col-6 d-flex align-items-center mt-1 ms-auto justify-content-end ">
            <ErpRadio
              className="radio-test-custom custom-control-success custom-radios "
              inline
              disabled
              checked
              label="4"
              name="vakad_4"
            />
            <span className="ms-2 title-disc w-50">
              {useFormatMessage("modules.test.text.4")}
            </span>
          </div>
          <div className="col-6 d-flex align-items-center mt-1 ms-auto justify-content-start ">
            <ErpRadio
              className="radio-test-custom custom-control-success custom-radios "
              inline
              disabled
              checked
              label="3"
              name="vakad_3"
            />
            <span className="ms-2 title-disc w-50">
              {useFormatMessage("modules.test.text.3")}
            </span>
          </div>
          <div className="col-6 d-flex align-items-center mt-1 me-auto justify-content-end ">
            <ErpRadio
              className="radio-test-custom custom-control-success custom-radios "
              inline
              disabled
              checked
              label="2"
              name="vakad_2"
            />
            <span className="ms-2 title-disc w-50">
              {useFormatMessage("modules.test.text.2")}
            </span>
          </div>
          <div className="col-6 d-flex align-items-center mt-1 me-auto justify-content-start ">
            <ErpRadio
              className="radio-test-custom custom-control-success custom-radios "
              inline
              disabled
              checked
              label="1"
              name="vakad_1"
            />
            <span className="ms-2 title-disc w-50">
              {useFormatMessage("modules.test.text.1")}
            </span>
          </div>
        </div>
      </Col>
      <Col sm={12} className="text-center mb-2 mt-3">
        <h3>
          <i className="fa-solid fa-star text-primary me-1"></i>
          <span className="text-dark">
            {useFormatMessage("modules.test.text.i_make")}
          </span>
        </h3>
      </Col>
      {renderQuests()}
    </>
  )
}

export default QuestionVAKAD
