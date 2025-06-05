export default function getFormData(dataObj, files) {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(dataObj)], { type: 'application/json' });
  formData.append('data', jsonBlob);
  // ✅ null일 경우 files를 append하지 않음
  if (files) {
    formData.append('files', files);
  }
  return formData;
}
