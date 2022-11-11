import { Fragment } from "react";
import ContentLoader from "react-content-loader";

const TableLoader = (props) => {
  const rows = props.rows || 10;
  let yFrist = 30;
  return (
    <div className="table-loading scaling-svg-container">
      {" "}
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="scaling-svg"
      >
        {[...Array(parseInt(rows))].map((item, index) => {
          if (index > 0) {
            yFrist += 50;
          }
          return (
            <Fragment key={index}>
              <rect x="16" y={yFrist} rx="4" ry="4" width="20" height="20" />
              <rect x="66" y={yFrist} rx="10" ry="10" width="85" height="19" />
              <rect
                x="187"
                y={yFrist}
                rx="10"
                ry="10"
                width="169"
                height="19"
              />
              <rect x="401" y={yFrist} rx="10" ry="10" width="85" height="19" />
              <rect
                x="522"
                y={yFrist}
                rx="10"
                ry="10"
                width="169"
                height="19"
              />
              <rect x="730" y={yFrist} rx="10" ry="10" width="85" height="19" />
              <rect x="851" y={yFrist} rx="10" ry="10" width="85" height="19" />
              <rect
                x="978"
                y={yFrist}
                rx="10"
                ry="10"
                width="169"
                height="19"
              />
              <rect
                x="1183"
                y={yFrist}
                rx="10"
                ry="10"
                width="85"
                height="19"
              />
              <rect
                x="1305"
                y={yFrist}
                rx="10"
                ry="10"
                width="85"
                height="19"
              />
              <rect
                x="1424"
                y={yFrist}
                rx="10"
                ry="10"
                width="68"
                height="19"
              />
            </Fragment>
          );
        })}
      </ContentLoader>
    </div>
  );
};

export default TableLoader;
