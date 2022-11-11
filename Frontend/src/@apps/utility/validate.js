import { isEmpty, map } from "lodash-es";
import { useFormatMessage } from "./common";
import notification from "./notification";

export const validateTypes = (filename, customAllowTypes = null) => {
  const fileExtensions = filename.split(".").pop();
  let allowTypes = customAllowTypes;
  if (isEmpty(customAllowTypes)) {
    const settings = JSON.parse(localStorage.getItem("settings"));
    allowTypes = settings.uploadFileTypeAllow.split(";");
  }
  if (!allowTypes.includes(fileExtensions) || isEmpty(allowTypes)) {
    return false;
  }
  return true;
};

export const validateSize = (size, customMaxSize = null) => {
  let allowSize = customMaxSize;
  if (isEmpty(customMaxSize)) {
    const settings = JSON.parse(localStorage.getItem("settings"));
    allowSize = settings.maxFileSize;
  }
  if (parseInt(size) > parseInt(allowSize)) {
    return false;
  }
  return true;
};

export const validateFile = (files) => {
  let filesArrray = files;
  if ("name" in files) {
    filesArrray = [files];
  }
  let totalSize = 0;
  let result = true;
  map(filesArrray, (file, index) => {
    const { name, size } = file;
    if (!validateTypes(name)) {
      notification.showError({
        text: useFormatMessage("notification.upload.file.error_file_type", {
          filename: name
        })
      });
      result = false;
    }
    totalSize += parseInt(size);
  });
  if (result) {
    if (!validateSize(parseInt(totalSize))) {
      const settings = JSON.parse(localStorage.getItem("settings"));
      notification.showError({
        text: useFormatMessage("notification.upload.file.error_file_size", {
          max: parseInt(settings.maxFileSize) / (1024 * 1024)
        })
      });
      result = false;
    }
  }
  return result;
};

export const validateImage = (files) => {
  const settings = JSON.parse(localStorage.getItem("settings"));
  const allowTypes = settings.imageFileTypeAllow.split(";");
  const allowSize = settings.maxImageSize;

  let filesArrray = files;
  if ("name" in files) {
    filesArrray = [files];
  }
  let totalSize = 0;
  let result = true;
  map(filesArrray, (file, index) => {
    const { name, size } = file;
    if (!validateTypes(name, allowTypes)) {
      notification.showError({
        text: useFormatMessage("notification.upload.image.error_file_type", {
          filename: name,
          allowType: settings.imageFileTypeAllow
        })
      });
      result = false;
    }
    totalSize += size;
  });
  if (result) {
    if (!validateSize(totalSize, allowSize)) {
      notification.showError({
        text: useFormatMessage("notification.upload.image.error_file_size", {
          max: parseInt(allowSize) / (1024 * 1024)
        })
      });
      result = false;
    }
  }

  return result;
};
