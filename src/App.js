import React from "react";
import FileUpload from "./FileUpload";

function App() {
  return (
    <>
      <FileUpload accept="image/*" multiple />
    </>
  );
}

export default App;
