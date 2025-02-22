import BackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PdfIcon from '@mui/icons-material/Description';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Submit-Requirements.css';

const SubmitRequirements = () => {
    const { orgID, bookingID } = useParams();
    const navigate = useNavigate();
    const [requirements, setRequirements] = useState([]);
    const [eventName, setEventName] = useState(''); // Store event name
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('select');
    const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
    const [currentRequirement, setCurrentRequirement] = useState(null);

    const requirementNames = ["Activity Request Form", "Event Proposal", "Ingress Form", "Letter of Intent"];

    useEffect(() => {
        const fetchBookingInfo = async () => {
            try {
                const response = await axios.get(`/facify/booking-info/${orgID}/${bookingID}`);
                if (response.data.success) {
                    setEventName(response.data.activity_title); 
                }
            } catch (error) {
                console.error('Error fetching booking info:', error);
            }
        };

        const fetchRequirements = async () => {
            try {
                const response = await axios.get(`/facify/booking-info/${orgID}/${bookingID}/requirements`);
                if (response.data.success) {
                    setRequirements(response.data.requirements);
                }
            } catch (error) {
                console.error('Error fetching file details:', error);
            }
        };

        fetchBookingInfo(); 
        fetchRequirements(); 
    }, [orgID, bookingID]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            console.log("Selected file:", event.target.files[0]);
        }
    };

    const clearFileInput = () => {
        inputRef.current.value = '';
        setSelectedFile(null);
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

            const fileName = `${bookingID}-${currentRequirement}.pdf`
    
            formData.append('file', selectedFile, fileName);
            formData.append('file_name', fileName);
    
            const response = await axios.post(`/facify/booking-info/${bookingID}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                    console.log('Upload progress:', percentCompleted);
                },
            });
    
            console.log("Upload response:", response.data);  // 🔍 Debugging
            if (response.data.success) {
                setUploadStatus('done');
                setRequirements(prev => [
                    ...prev,
                    { file: selectedFile, file_name: fileName, date_time_submitted: new Date().toISOString() }
                ]);
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Error uploading file:', err.response ? err.response.data : err);
            alert(`Upload failed: ${err.response ? err.response.data.message : err.message}`);
            setProgress(0);
            setUploadStatus('select');
        }
    };

    const handleDeleteFile = async (requirementID) => {
        try {
            const response = await axios.post('/facify/booking-info/delete', {
                bookingID,
                requirementID
            });
    
            if (response.data.success) {
                setRequirements(requirements.filter(req => req.requirement_id !== requirementID)); // Remove from UI
            } else {
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
            alert('An error occurred while deleting the file.');
        }
    };
    const handleOpenFileUploader = (requirementName) => {
        setCurrentRequirement(requirementName);
        setIsFileUploaderOpen(true);
    };

    const handleCloseFileUploader = () => {
        setIsFileUploaderOpen(false);
        clearFileInput();
    };

    return (
        <div className="SubmitReqs">
            <Header />
            <div className="main-content">
                <div className="sidebar-placeholder">
                    <Sidebar />
                </div>
                <div className="submit-reqs">
                    <div className="submit-reqs_header">
                        <div className="booking-id">
                            <BackIcon className="back-icon" style={{ fontSize: 40 }} onClick={() => navigate(-1)} />
                            <h2>Booking Information - {bookingID} // Submit Requirements</h2>
                        </div>
                    </div>
                    <div className="submit-reqs_content">
                        <div className="reqs">
                            <div className="table-header">
                                <div className="req-title">Requirement</div>
                                <div className="date-title">Date Submitted</div>
                                <div className="file-title">File</div>
                            </div>
                            <div className="table-content">
                                {requirementNames.map((requirementName) => {
                                        const matchingRequirement = requirements.find(req =>
                                            req.file_name.toLowerCase().includes(requirementName.toLowerCase())
                                        );
                                    return (
                                        <div className="req" key={requirementName}>
                                            <div className="file-name">{requirementName}</div>
                                            <div className="date">
                                                {matchingRequirement ? new Date(matchingRequirement.date_time_submitted).toLocaleString() : '—'}
                                            </div>
                                            <div className="file">
                                                {matchingRequirement ? (
                                                    <div className="file-item">
                                                        <PdfIcon className="file-icon" />
                                                        <div className="file-info">
                                                            <h4>{matchingRequirement.file_name}</h4>
                                                            <p>{(matchingRequirement.file_size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                        <ClearIcon className="clear-icon" onClick={() => handleDeleteFile(matchingRequirement.requirement_id)} />
                                                    </div>
                                                ) : (
                                                    <button className="upload-file" onClick={() => handleOpenFileUploader(requirementName)}>
                                                        {uploadStatus === 'select' || uploadStatus === 'uploading' ? 'Upload' : 'Done'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload File Modal */}
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
                        <PdfIcon className="pdf-icon" />
                        <div className="file-info">
                                <h4>{selectedFile.name}</h4>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${progress}%` }}></div>
                                </div>
                        </div>

                        {uploadStatus === 'select' ? (
                            <button onClick={clearFileInput}>
                                <span className="delete-icon" style={{fontSize: 18}}><CloseIcon /></span>
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

                <button className="upload-btn" onClick={handleUpload}>
                    {uploadStatus === 'select' || uploadStatus === 'uploading' ? 'Upload' : 'Done'}
                </button>
                </>
             )}
            </Modal>
        </div>
    );
};

export default SubmitRequirements;