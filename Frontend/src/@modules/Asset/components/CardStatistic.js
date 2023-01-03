import { addComma } from "@apps/utility/common"
import { Card, CardBody } from "reactstrap"

const CardStatistic = (props) => {
  const { title, number, subTitle } = props
  return (
    <Card className="card-statistic-ytb">
      <CardBody className="pt-1">
        <div className="title">{title}</div>
        <div className="d-flex align-items-baseline mt-1">
          <div className="result">{addComma(number)}</div>
          <div className="percent ms-50"></div>
        </div>
        <div className="note mt-50">{subTitle}</div>
      </CardBody>
    </Card>
  )
}

export default CardStatistic
