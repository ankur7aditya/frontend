import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(URL.createObjectURL(droppedFile));
      sendFileToBackend(droppedFile);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      sendFileToBackend(selectedFile);
    }
  };

  // Send file to backend
  const sendFileToBackend = async (selectedFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);  // Use 'file' as the key to match Postman
  
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Backend response:', result);  // Log the result
  
      if (result.class && result.confidence !== undefined) {
        setPrediction(result.class);
        setConfidence(result.confidence);
      } else {
        throw new Error('Response does not contain prediction or confidence');
      }
    } catch (error) {
      console.error('Error sending file to backend:', error.message);
      alert(`Error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="App">
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>{file ? 'File Uploaded' : 'Drag and Drop your image here or click to select'}</p>
        {file && <img src={file} alt="Uploaded" />}
        
        {loading && <p>Loading...</p>}
        
        {prediction && (
          <div>
            <p><strong>Prediction:</strong> {prediction}</p>
            <p><strong>Confidence:</strong> {confidence*100}%</p>
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
          id="fileInput"
        />
        <label htmlFor="fileInput" className="file-label">
          Click to select a file
        </label>
      </div>
    </div>
  );
};

export default App;
