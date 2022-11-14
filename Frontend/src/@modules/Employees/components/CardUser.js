import { Card, CardBody, CardImg, Badge } from "reactstrap";
import Avatar from "@apps/modules/download/pages/Avatar";
import { Mail, Phone } from "react-feather";
import EmptyText from "@apps/components/common/EmptyText";
import { Tooltip } from "antd";
import { useFormatMessage } from "@apps/utility/common";
import { useContext } from "react";
import { AbilityContext } from "utility/context/Can";
const CardUser = (props) => {
  const ability = useContext(AbilityContext);

  return (
    <Card className="card-profile life-card-user mt-5">
      <CardBody>
        <div className="profile-image-wrapper">
          <div className="profile-image">
            <Avatar className="m-0" size="sm" src={props.data.avatar} />
          </div>
        </div>
        <h3>{props.data.full_name}</h3>
        <h6 className="text-muted">@{props.data.username}</h6>
        <div className="d-flex justify-content-around align-items-center">
          <Tooltip
            title={useFormatMessage("modules.employees.fields.job_title_id")}
          >
            <Badge className="profile-badge" color="light-primary">
              {props.data.job_title_id
                ? props.data.job_title_id?.label
                : "Unknown"}
            </Badge>
          </Tooltip>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-50">
          <div>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.department_id")}
            >
              <small>
                <i className="fal fa-boxes"></i>{" "}
                {props.data.department_id?.label ?? <EmptyText />}
              </small>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.group_id")}
            >
              <small>
                {props.data.group_id?.label ?? <EmptyText />}{" "}
                <i className="fal fa-users"></i>
              </small>
            </Tooltip>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Phone size={11} />{" "}
            <small>
              <a href={`callto:${props.data.phone}`} className="text-dark">
                {props.data.phone}
              </a>
            </small>
          </div>
          <div>
            <small>
              <a href={`mailto:${props.data.email}`} className="text-dark">
                {props.data.email}
              </a>
            </small>{" "}
            <Mail size={11} />
          </div>
        </div>
        <hr className="mb-2" />
        <div className="d-flex justify-content-around align-items-center">
          <a
            href={props.data.social_facebook}
            className="text-dark"
            target="_blank"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href={props.data.social_twitter}
            className="text-dark"
            target="_blank"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href={props.data.social_instagram}
            className="text-dark"
            target="_blank"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href={props.data.social_youtube}
            className="text-dark"
            target="_blank"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            href={props.data.social_telegram}
            className="text-dark"
            target="_blank"
          >
            <i className="fab fa-telegram"></i>
          </a>
          <a
            href={props.data.social_website}
            className="text-dark"
            target="_blank"
          >
            <i className="fas fa-globe-asia"></i>
          </a>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardUser;
