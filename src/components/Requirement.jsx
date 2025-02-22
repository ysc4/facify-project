import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Requirement.css';

Modal.setAppElement('#root');

const Requirement = ({ org_id, booking_id, requirement_name }) => {
  const inputRef = React.useRef();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('select');
  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [fileName, setFileName] = useState("No selected file");

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedDate} ${formattedHours}:${minutes} ${ampm}`;
};

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get(`/facify/booking-info/${org_id}/${booking_id}/${requirement_name}`);
        console.log(response.data);
        if (response.data.success) {
          setUploadedFile(response.data.file);
        }
      } catch (error) {
        console.error('Error fetching file details:', error);
      }
    };

    fetchFileDetails();
  }, [org_id, booking_id, requirement_name]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const clearFileInput = () => {
    inputRef.current.value = '';
    setSelectedFile(null);
    setFileName("No selected file");
    setProgress(0);
    setUploadStatus('select');
  };

  const handleUpload = async () => {
    if (uploadStatus === 'done') {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus('uploading');

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('/facify/booking-info/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }, 
      });
      setUploadStatus('done');
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadStatus('select');
    }
  };

  const handleOpenFileUploader = () => {
    setIsFileUploaderOpen(true);
  };

  const handleCloseFileUploader = () => {
    setIsFileUploaderOpen(false);
  };

  return (
    <div className="req">
      <div className="file-name">{requirement_name}</div>
          <div className="date"></div>
          <div className="file" onClick={handleOpenFileUploader}>
            Upload File
          </div>


      <Modal
        isOpen={isFileUploaderOpen}
        onRequestClose={handleCloseFileUploader}
        contentLabel="Upload File Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!selectedFile && (
          <button className="file-btn" onClick={() => inputRef.current.click()}>
            <CloudUploadIcon style={{ fontSize: 40 }}/>
            Browse files to upload
          </button>
        )}

        {selectedFile && (
          <>
          <div className="file-card">
            <div className="file-info">
              <div style={{flex: 1}}>
                <h4>{selectedFile.name}</h4>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

            {uploadStatus === 'select' ? (
              <button onClick={clearFileInput}>
                <span className="close-icon" style={{fontSize: 18}}><CloseIcon /></span>
              </button>
            ) : (
              <div className="check-circle">
                {uploadStatus === "uploading" ? (
                  `${progress}%`
                ) : uploadStatus === "done" ? (
                  <span style={{fontSize: 20}}><CheckIcon /></span>
                ) : null }
              </div>
            )}
            </div>
          </div>

          <button className="upload-btn" onClick={handleUpload}>
            {uploadStatus === 'select' || uploadStatus === 'uploading' ? 'Upload' : 'Done'}
          </button>
        </>
        )}
      </Modal>
    </div>
  );
};

export default Requirement;