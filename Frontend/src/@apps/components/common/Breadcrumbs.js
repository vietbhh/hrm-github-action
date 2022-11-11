import { Fragment, useContext } from "react";
import { Breadcrumb, BreadcrumbItem, Card, CardBody } from "reactstrap";
import PropTypes from "prop-types";
import { map } from "lodash-es";
import { Link } from "react-router-dom";
import GoBack from "./GoBack";
import classNames from "classnames";
const Breadcrumbs = (props) => {
  const { list, withBack, custom, className, style } = props;
  return (
    <Fragment>
      <Card
        className={classNames("no-box-shadow card-breadcums", className)}
        style={style}
      >
        <CardBody>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center">
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/">
                    <i className="icpega Filled-Home" /> Home{" "}
                  </Link>
                </BreadcrumbItem>
                {map(list, (item, index) => {
                  return (
                    <BreadcrumbItem key={index}>
                      {item.link && <Link to={item.link}> {item.title} </Link>}
                      {!item.link && item.title}
                    </BreadcrumbItem>
                  );
                })}
              </Breadcrumb>
            </div>
            <div className="d-flex ms-auto align-items-center">
              {withBack && (
                <span>
                  <GoBack className="float-end" />
                </span>
              )}
              {custom}
            </div>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};
Breadcrumbs.defaultProps = {
  list: [],
  withBack: false,
  custom: false,
  className: "",
  style: {}
};

Breadcrumbs.propTypes = {
  list: PropTypes.array,
  withBack: PropTypes.bool,
  custom: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Breadcrumbs;
