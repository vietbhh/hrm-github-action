// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { Fragment, useEffect } from "react";
import { DocumentApi } from "../common/api";
import { useParams } from "react-router-dom";
// ** Styles
import {
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import { Download } from "react-feather";
// ** Components
import Photo from "@apps/modules/download/pages/Photo";
import DownloadFile from "@apps/modules/download/pages/DownloadFile";

const ViewFileDocument = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    fileInfo: [],
    loading: true
  });

  const { id, filename } = useParams();

  const loadData = () => {
    setState({
      loading: true
    });
    DocumentApi.getDocumentDetail(id, {
      filename: filename
    }).then((res) => {
      const [fileInfo] = res.data.files_upload_module;
      setState({
        loading: false,
        data: res.data.data,
        fileInfo: fileInfo
      });
    });
  };

  const renderImage = () => {
    if (
      state.fileInfo.type === "image/jpeg" ||
      state.fileInfo.type === "image/jpg" ||
      state.fileInfo.type === "image/png"
    ) {
      return (
        <div>
          <Photo src={state.fileInfo.url} className="photo w-100" />
        </div>
      );
    } else {
      return (
        <DownloadFile
          src={state.fileInfo.url}
          fileName={state.fileInfo.fileName}
          type="button"
          className="btn-icon"
          size="sm"
        >
          <Download size="15" /> {useFormatMessage("modules.documents.buttons.download")}
        </DownloadFile>
      );
    }
  };

  const renderFileContent = () => {
    return (
      <Card>
        <CardHeader>
          <h3>{state.fileInfo.fileName}</h3>
        </CardHeader>
        <CardBody>{renderImage()}</CardBody>
      </Card>
    );
  };

  useEffect(() => {
    loadData();
  }, [id, filename]);
  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[{ title: useFormatMessage("modules.documents.title.index") }]}
      />
    );
  };
  return (
    <Fragment>
      {renderBreadcrumb()}
      {!state.loading && renderFileContent()}
    </Fragment>
  );
};

export default ViewFileDocument;
