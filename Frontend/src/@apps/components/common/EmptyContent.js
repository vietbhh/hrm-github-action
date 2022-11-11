import { useFormatMessage } from "@apps/utility/common";
import { Fragment } from "react";
import classnames from "classnames";
export const EmptyContent = ({ title, text, icon, className }) => {
  return (
    <Fragment>
      <div className={classnames("text-center empty-content", className)}>
        <span>{icon}</span>
        <p className="mt-1 empty-title">{title}</p>
        <p className="empty-text">{text}</p>
      </div>
    </Fragment>
  );
};

EmptyContent.defaultProps = {
  title: useFormatMessage("notification.empty_content.title"),
  text: useFormatMessage("notification.empty_content.text"),
  icon: <i className="fad fa-file-search font-large-2"></i>,
  className: ""
};
