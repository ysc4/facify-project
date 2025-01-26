import React, { useState } from "react";
import Modal from "react-modal";
import axios from 'axios';
import './FileUploader.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';

Modal.setAppElement('#root');

export default function FileUploader({ isOpen, onRequestClose, onFileUpload }) {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No selected file");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('requirementName', requirementName);
        formData.append('bookingID', bookingID);

        try {
            const response = await axios.post('/facify/booking-info/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                onFileUpload(file);
            } else {
                console.error('File upload failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Upload File Modal"
            className="modal"
            overlayClassName="overlay"
        >
            <h1>Upload File</h1>
            <div className="file-input">
                <form action=""
                onClick={() => document.querySelector('.input-field').click()}>
                    <input type="file" accept="application/pdf" className="input-field" hidden onChange={handleFileChange} />
                    {file ?
                    <section className="uploaded-file">
                        <span>
                            <PdfIcon className="pdf-icon" />
                            {fileName}
                            <DeleteIcon className="delete-icon" onClick={() => {setFile(null); setFileName("No selected file")}} />
                        </span>
                    </section> :
                    <>
                    <CloudUploadIcon className="upload-icon" style={{ fontSize: 120 }}/> 
                    <p>Browse files to upload</p>
                    </> }
                </form>

                <div className="modal-buttons">
                    <button className="cancel-button" onClick={onRequestClose}>Cancel</button>
                    <button className="upload-button" onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </Modal>
    );
}