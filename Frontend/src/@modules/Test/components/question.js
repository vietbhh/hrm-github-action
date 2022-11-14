import { Col } from "reactstrap"
import { ErpRadio } from "@apps/components/common/ErpField"
const Question = (props) => {
  const { number, questions, results, setResults, calculateTest } = props

  const choseResult = (e) => {
    const test = questions[number]
    questions[number]["selected"] = e.id
    questions[number]["type"] = e.point
    setResults(...results, test)
    // setQuest({ ...questions, test })
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
                    className="custom-control-success custom-radios"
                    inline
                    name="radiodisc"
                    id={item.id}
                    value={item.point}
                    checked={questions[number]["selected"] === item.id}
                    onClick={() => choseResult(item)}
                  />
                  <span
                    className="ms-2 title-disc"
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

  return renderQuests()
}

export default Question
