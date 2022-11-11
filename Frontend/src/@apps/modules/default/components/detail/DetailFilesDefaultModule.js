import DownloadFile from "@apps/modules/download/pages/DownloadFile";
import Photo from "@apps/modules/download/pages/Photo";
import { addComma, useFormatMessage } from "@apps/utility/common";
import { Fragment } from "react";
import { Download, Trash } from "react-feather";
import { Alert, Button, Col, Row, Table } from "reactstrap";

const DetailFilesDefaultModule = (props) => {
  const { files } = props;
  const fileType = {
    "application/msword": (
      <i className="far fa-file-word ms-1" style={{ fontSize: "25px" }} />
    ),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <i className="far fa-file-word ms-1" style={{ fontSize: "25px" }} />
    ),
    "application/vnd.ms-excel": (
      <i className="far fa-file-excel ms-1" style={{ fontSize: "25px" }} />
    ),
    "application/vnd.ms-powerpoint": (
      <i className="far fa-file-powerpoint ms-1" style={{ fontSize: "25px" }} />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
      <i className="far fa-file-excel ms-1" style={{ fontSize: "25px" }} />
    ),
    "application/pdf": (
      <i className="far fa-file-pdf ms-1" style={{ fontSize: "25px" }} />
    ),
    "application/application/x-zip-compressed": (
      <i className="far fa-file-archive ms-1" style={{ fontSize: "25px" }} />
    ),
    "video/mp4": (
      <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
    ),
    "video/avi": (
      <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
    ),
    "video/3gp": (
      <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
    ),
    "video/flv": (
      <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
    ),
    "video/mov": (
      <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
    ),
    "video/wmv": (
      <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
    ),
    "audio/mpeg": (
      <i className="far fa-file-music ms-1" style={{ fontSize: "25px" }} />
    ),
    "audio/mp4": (
      <i className="far fa-file-audio ms-1" style={{ fontSize: "25px" }} />
    ),
    "audio/wav": (
      <i className="far fa-file-audio ms-1" style={{ fontSize: "25px" }} />
    ),
    "audio/mid": (
      <i className="far fa-file-audio ms-1" style={{ fontSize: "25px" }} />
    )
  };
  return (
    <Fragment>
      <Row>
        <Col sm="12">
          {files.length ? (
            <Table striped responsive>
              <tbody>
                {files.map((file, index) => {
                  const fType = fileType[file.type] ? (
                    fileType[file.type]
                  ) : (
                    <i
                      className="far fa-file-alt ms-1"
                      style={{ fontSize: "25px" }}
                    />
                  );
                  return (
                    <tr key={index}>
                      <th scope="row" width="10">
                        #{index + 1}
                      </th>
                      <td className="text-center" style={{ width: "100px" }}>
                        {!file.type.includes("image") && fType}
                        {file.type.includes("image") && file.new && (
                          <img
                            src={file.preview}
                            alt={file.fileName}
                            className="ms-1"
                            style={{ width: "40px", height: "40px" }}
                          />
                        )}
                        {file.type.includes("image") && !file.new && (
                          <Photo
                            src={file.url}
                            alt={file.fileName}
                            className="ms-1"
                            style={{ maxWidth: "100px" }}
                          />
                        )}
                      </td>
                      <td className="text-start">
                        {file.fileName} ({addComma(file.size)} kb)
                        <DownloadFile
                          src={file.url}
                          fileName={file.fileName}
                          type="button"
                          className="ms-1 float-end"
                          size="sm"
                          color="primary"
                        >
                          <Download size={14} /> &nbsp;{" "}
                          {useFormatMessage("button.download")}
                        </DownloadFile>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Alert color="warning">
              <div className="alert-body">
                <span className="fw-bold">
                  {useFormatMessage("notification.no_files")}
                </span>
              </div>
            </Alert>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default DetailFilesDefaultModule;
