import classnames from "classnames";
const EmptyText = ({ className, content }) => {
  return (
    <small className={classnames("empty-text font-italic text-muted", className)}>
      {content ?? "(Empty)"}
    </small>
  );
};
export default EmptyText;
