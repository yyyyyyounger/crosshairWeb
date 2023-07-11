import React, { useRef, useState, useEffect } from "react";
import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel
} from "./FileUpload.styles";

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const FileUpload = ({
  label,
  updateFilesCb,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});

  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
  const mouseMoveHandler = (event) => {
    setMouseCoordinates({
      x: event.pageX,
      y: event.pageY
    });
  };

  const [clickPoints, setClickPoints] = useState([]);
  const handleClick = (event) => {
    console.log(event.target);
    console.log("Image clicked");
  };

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size < maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    // updateFilesCb(filesAsArray);
    // console.log("callUpdateFilesCb", filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };

  return (
    <>
      {/* Mouse Coordinates: x = {mouseCoordinates.x}, y={mouseCoordinates.y} */}
      <div
        style={{
          borderLeft: "1px green",
          borderStyle: "dotted",
          height: "100rem",
          marginLeft: "-1px",
          position: "absolute",
          left: mouseCoordinates.x
        }}
      />
      <div
        style={{
          borderTop: "1px green",
          borderStyle: "dotted",
          width: "50rem",
          marginTop: "-1px",
          position: "absolute",
          top: mouseCoordinates.y
        }}
      />

      {JSON.stringify(files) === "{}" && (
        <FileUploadContainer>
          <InputLabel>{label}</InputLabel>
          <DragDropText>拖拽上传或</DragDropText>
          <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
            {/* <i className="fas fa-file-upload" /> */}
            <span>点击上传{otherProps.multiple ? "文件" : "一个文件"}</span>
          </UploadFileBtn>

          <FormField
            type="file"
            ref={fileInputField}
            onChange={handleNewFileUpload}
            title=""
            value=""
            {...otherProps}
          />
        </FileUploadContainer>
      )}
      <FilePreviewContainer>
        {/* <span>文件预览</span> */}
        {/* <PreviewList>
        </PreviewList> */}
        {Object.keys(files).map((fileName, index) => {
          let file = files[fileName];
          let isImageFile = file.type.split("/")[0] === "image";
          return (
            <div>
              {/* <PreviewContainer key={fileName}>
              </PreviewContainer> */}
              {isImageFile && (
                <ImagePreview
                  src={URL.createObjectURL(file)}
                  alt={`file preview ${index}`}
                  onClick={handleClick}
                />
              )}
              {/* 圖片資料及刪除按鈕 */}
              {/* <FileMetaData isImageFile={isImageFile}>
                    <span>{file.name}</span>
                    <aside>
                      <span>{convertBytesToKB(file.size)} kb</span>
                      <button onClick={() => removeFile(fileName)}>
                        Remove
                      </button>
                    </aside>
                  </FileMetaData> */}
            </div>
          );
        })}
      </FilePreviewContainer>
    </>
  );
};

export default FileUpload;
