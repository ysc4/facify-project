import BackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PdfIcon from '@mui/icons-material/Description';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/SubmitRequirements.css';

const SubmitRequirements = () => {
    const { orgID, bookingID } = useParams();
    const navigate = useNavigate();
    const [requirements, setRequirements] = useState([]);
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('select');
    const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
    const [currentRequirement, setCurrentRequirement] = useState(null);

    const location = useLocation();
    const status = location.state?.status || "";
    console.log("Current Status:", status);

    const requirementNames = ["Activity Request Form", "Event Proposal", "Ingress Form", "Letter of Intent"];

    useEffect(() => {
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

        fetchRequirements(); 
    }, [orgID, bookingID]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            console.log("Selected file:", event.target.files[0]);
        }
    };

    const fetchFile = async (bookingID, requirementID) => {
        if (!bookingID || !requirementID) return;
    
        try {
            const response = await axios.get(`/facify/get-file/${bookingID}/${requirementID}`, {
                responseType: 'blob', 
            });
    
            if (!response.data || response.data.size === 0) {
                console.error("Received empty file");
                return;
            }
    
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(blob);
    
            window.open(fileURL, "_blank");
    
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    const handleViewFile = (requirement) => {
        if (requirement.tempFileURL) {
            window.open(requirement.tempFileURL, "_blank");
        } else {
            fetchFile(bookingID, requirement.requirement_id);
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
            handleCloseFileUploader();
            clearFileInput();
            return;
        }
    
        try {
            setUploadStatus('uploading');
            const formData = new FormData();
    
            const fileName = `${bookingID}-${currentRequirement}.pdf`;
    
            formData.append('file', selectedFile, fileName);
            formData.append('file_name', fileName);
    
            const response = await axios.post(`/facify/booking-info/${bookingID}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });
    
            if (response.data.success) {
                setUploadStatus('done');
    
                const blob = new Blob([selectedFile], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(blob);
    
                setRequirements(prev => [
                    ...prev,
                    {
                        file_name: fileName,
                        date_time_submitted: new Date().toISOString(),
                        file_size: selectedFile.size,
                        requirement_id: response.data.requirement_id,
                        tempFileURL: fileURL
                    }
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
                            <h2>Booking Information - FACI{String(bookingID).padStart(3, '0')} // Submit Requirements</h2>
                        </div>
                    </div>
                    <div className="submit-reqs_table">
                            <table className="reqs-table">
                            <thead>
                                <tr className="reqs-table-header">
                                    <th className="req-title">Requirement</th>
                                    <th className="date-title">Date Submitted</th>
                                    <th className="file-title">File</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requirementNames.map((requirementName) => {
                                    const matchingRequirement = requirements.find(req =>
                                        req.file_name?.toLowerCase().includes(requirementName.toLowerCase())
                                    );
                                    return (
                                        <tr className="req" key={requirementName}>
                                            <td className="file-name">{requirementName}</td>
                                            <td className="date">
                                                {matchingRequirement
                                                    ? new Date(matchingRequirement.date_time_submitted).toLocaleString()
                                                    : '—'}
                                            </td>
                                            <td className="file">
                                            {matchingRequirement ? (
                                                    <div className="file-item" onClick={() => handleViewFile(matchingRequirement)}>
                                                        <PdfIcon className="file-icon" />
                                                        <div className="file-info">
                                                            <h4>{matchingRequirement.file_name}</h4>
                                                            <p>{(matchingRequirement.file_size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button className="upload-file" onClick={() => handleOpenFileUploader(requirementName)} disabled={requirementName === "Ingress Form" && (status === "Approved" || status === "Denied")}>
                                                        {uploadStatus === 'select' || uploadStatus === 'uploading' ? 'Upload' : 'Done'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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
                        <div className="file-upload-info">
                                <h4>{selectedFile.name}</h4>
                                <div className="progress-bar">
                                    <div className="file-progress" style={{ width: `${progress}%` }}></div>
                                </div>
                        </div>

                        {uploadStatus === 'select' ? (
                            <button className="cancel-upload" onClick={clearFileInput}>
                                <span className="cancel-icon" style={{fontSize: 20}}><ClearIcon /></span>
                            </button>
                            ) : (
                            <div className="check-circle">
                                {uploadStatus === "uploading" ? (
                                `${progress}%`
                                ) : uploadStatus === "done" ? (
                                <span className="check-icon" style={{fontSize: 20}}><CheckIcon /></span>
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