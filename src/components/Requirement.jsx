import PdfIcon from '@mui/icons-material/PictureAsPdf';
import React, { useState } from 'react';
import FileUploader from './FileUploader';
import './Requirement.css';


const Requirement = ({ requirement_name, date_submitted, file_name, file_size, file }) => {
  const [uploadedFile, setUploadedFile] = useState(file);

  return (
    <div className="req">
      <div className="file-name">{requirement_name}</div>
      {uploadedFile === null ? (
        <>
          <div className="date"></div>
          <div className="file">
            Upload File
            <FileUploader onFileUpload={setUploadedFile} />
          </div>
        </>
      ) : (
        <>
          <div className="date">{date_submitted}</div>
          <div className="file">
            <div className="file-icon">
              <span><PdfIcon /></span>
            </div>
            <div className="file-item">
              <h4>{file_name}</h4>
              <p>{file_size}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Requirement;