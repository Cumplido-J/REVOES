import React, { useEffect, useState } from "react";
import { Button, Upload } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

const InputPhoto = ({ name, photo, onChange }) => {
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const customRequest = ({ file, onSuccess }) => {
    setLoading(true);
    onChange(file);
    onSuccess("ok");
    onChange(file);
    setImageUrl(URL.createObjectURL(file));
    setLoading(false);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Subir imagen</div>
    </div>
  );
  const handleClear = () => {
    onChange(undefined);
    setFiles([]);
    setImageUrl(null);
  };
  useEffect(() => {
    if (photo) {
      setFiles([
        {
          lastModified: photo.lastModified,
          lastModifiedDate: photo.lastModifiedDate,
          name: photo.name,
          originFileObj: photo,
          /*percent: 0,*/
          response: "ok",
          size: photo.size,
          status: "done",
          type: photo.type,
          uid: "rc-upload-1634793688253-2",
          xhr: undefined,
        },
      ]);
      setImageUrl(URL.createObjectURL(photo));
    }
  }, [photo]);
  return (
    <div>
      <Upload
        name={name}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        fileList={files}
        action={undefined}
        onChange={(a, b) => console.log(a, b)}
        customRequest={customRequest}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Foto credencial"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      {imageUrl && (
        <Button style={{ width: "102px" }} onClick={handleClear}>
          Limpiar
        </Button>
      )}
    </div>
  );
};

export default InputPhoto;
