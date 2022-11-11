import { useFormatMessage } from "@apps/utility/common";
import { Fragment } from "react";
export const UnderConstruction = (props) => {
  const classProps = props.className || "";
  const title =
    props.title || useFormatMessage("notification.under_contruction.title");
  const text =
    props.text || useFormatMessage("notification.under_contruction.text");
  return (
    <Fragment>
      <div className={"text-center empty-content" + classProps}>
        <span>
          <i className="fad fa-construction font-large-2"></i>
        </span>
        <p className="mt-1 empty-title">{title}</p>
        <p className="empty-text">{text}</p>
      </div>
    </Fragment>
  );
};
