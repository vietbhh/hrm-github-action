import { EmptyContent } from "@apps/components/common/EmptyContent";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

const CardNewMember = () => {
  return (
    <Card className="card-user-timeline">
      <CardHeader>
        <div className="d-flex align-items-center">
          <h1 className="card-title">
            <span className="title-icon">
              <i className="fal fa-users"></i>
            </span>
            <CardTitle tag="span">New member this month</CardTitle>
          </h1>
        </div>
      </CardHeader>
      <CardBody>
        <EmptyContent
          icon={<i className="fal fa-users"></i>}
          title="No new member this month"
          text=""
        />
      </CardBody>
    </Card>
  );
};

export default CardNewMember;
