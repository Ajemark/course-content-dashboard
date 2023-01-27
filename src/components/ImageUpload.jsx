import React, { useCallback, useContext } from "react";
import { Button, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import uploadSvg from "./../assets/images/uploader.svg";

import { ImageContext } from "../screens/ProductUpload";


let binaryStr;
let filess

function ImageUpload({ open }) {
  const {files, setFiles} = useContext(ImageContext)
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      filess = acceptedFiles.map((file) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        binaryStr = reader.result;
        setFiles([binaryStr]);

      };
      reader.readAsArrayBuffer(file);
    });
  }, [setFiles]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  console.log(files);

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Image src={uploadSvg} />
      </div>
      <aside>
        <ul className="mt-5">{filess}</ul>
      </aside>
    </div>
  );
}

export default ImageUpload;