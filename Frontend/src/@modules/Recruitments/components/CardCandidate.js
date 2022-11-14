import Avatar from "@apps/modules/download/pages/Avatar"
import ReactStars from "react-rating-stars-component"
import { Card } from "reactstrap"
const CardCandidate = (props) => {
  const { item, handleDetail, review } = props

  let averageStar = 0
  if (review?.rating)
    averageStar = Math.round((review.rating / review.count) * 2) / 2

  return (
    <Card className="bg-transparent card-candidate">
      <div className="info-card-candidate">
        <div className="info-row align-items-center">
          <div className="info-icon">
            <Avatar src={item?.candidate_avatar?.url} height="32" width="32" />
          </div>
          <div
            className="d-flex font-weight-bold text-long name-candidate"
            onClick={() => handleDetail(item)}>
            {item?.candidate_name}
          </div>
        </div>
        <div className="info-row">
          <div className="info-icon">
            <i className="fal fa-bullhorn"></i>
          </div>
          <div>{item?.recruitment_proposal?.label}</div>
        </div>
        <div className="info-row">
          <div className="info-icon">
            <i className="fal fa-phone-alt"></i>
          </div>
          <div>{item?.candidate_phone}</div>
        </div>
        <div className="info-row">
          <div className="info-icon">
            <i className="fal fa-envelope"></i>
          </div>
          <div alt={item?.candidate_email}>{item?.candidate_email}</div>
        </div>
        <div className="info-row">
          <div className="info-icon">
            <i className="fal fa-clipboard-user"></i>
          </div>
          <div className="text-long">
            {item?.candidate_dob ? item?.candidate_dob : "-"}
          </div>
        </div>

        <div className="info-row align-items-center">
          <div className="info-icon">
            <i className="fal fa-star"></i>
          </div>
          <div>
            <ReactStars
              className="ms-2"
              isHalf={true}
              value={averageStar}
              key={Math.random()}
              edit={false}
              size={12}
              emptyIcon={<i className="far fa-star" />}
              halfIcon={<i className="fa fa-star-half-alt" />}
              filledIcon={<i className="fa fa-star" />}
              color="#f9d324"
              activeColor="#f9d324"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CardCandidate
