import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import "./Editor.css";

const StrukturOrganisasi = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishStatus, setPublishStatus] = useState("draft");

  const handleFileUpload = (e) => {
    console.log(e.files);
  };

  const handlePublish = () => {
    console.log("Publish status:", publishStatus);
  };

  return (
    <div className="tentang-container">
      <div className="left-column scrollable-column">
        <Card title="Create New Post">
          <div className="p-field">
            <label htmlFor="file">Upload File</label>
            <FileUpload
              name="file"
              customUpload
              uploadHandler={handleFileUpload}
              className="p-fileupload"
            />
          </div>

          <div className="p-field custom-editor">
            <label htmlFor="title">Title</label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-editor"
            />
          </div>

          <div className="p-field custom-editor">
            <label htmlFor="content">Content</label>
            <Editor
              id="content"
              value={content}
              onTextChange={(e) => setContent(e.htmlValue)}
              style={{ height: "200px" }}
              className="p-editor"
            />
          </div>
        </Card>
      </div>

      <div className="right-column fixed-column">
        <Card title="Publish Options">
          <div className="radio-button-container">
            <RadioButton
              inputId="draft"
              name="status"
              value="draft"
              onChange={(e) => setPublishStatus(e.value)}
              checked={publishStatus === "draft"}
            />
            <label htmlFor="draft">Draft</label>
          </div>
          <div className="radio-button-container">
            <RadioButton
              inputId="publish"
              name="status"
              value="publish"
              onChange={(e) => setPublishStatus(e.value)}
              checked={publishStatus === "publish"}
            />
            <label htmlFor="publish">Publish</label>
          </div>
          <div className="button-save">
            <Button
              label="Save"
              raised
              icon="pi pi-check"
              onClick={handlePublish}
              className="mt-2"
            />
            <Button
              label="Discard"
              raised
              icon="pi pi-times"
              className="mt-2"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StrukturOrganisasi;
