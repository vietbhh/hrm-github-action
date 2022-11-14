export const base64toBlob = (data) => {
  const base64WithoutPrefix = data.substr(
    "data:application/pdf;base64,".length
  );

  const bytes = atob(base64WithoutPrefix);
  let length = bytes.length;
  const out = new Uint8Array(length);

  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }

  return new Blob([out], { type: "application/pdf" });
};
