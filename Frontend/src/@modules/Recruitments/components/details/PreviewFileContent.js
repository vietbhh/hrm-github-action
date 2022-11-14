// ** React Imports
// ** Styles
// ** Components

const PreviewFileContent = (props) => {
  const {
    // ** props
    filePath
    // ** methods
  } = props;

  // ** render
  return (
    <div>
      <iframe
        id="msdoc-iframe"
        title="msdoc-iframe"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          filePath
        )}`}
        frameBorder="1"
        style={{ width: "28vw", height: "85vh", margin: "1vw" }}
      ></iframe>
    </div>
  );
};

export default PreviewFileContent;
