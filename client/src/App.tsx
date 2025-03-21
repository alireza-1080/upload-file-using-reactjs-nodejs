import './App.css'
import React from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'

const App = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<number>(0)
  const [isUploading, setIsUploading] = React.useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setUploadProgress(0)
    }
  }

  const handleUploadFile = async () => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const uploadResponse = await axios.post('http://localhost:4000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total ? (progressEvent.loaded / progressEvent.total) * 100 : 0
          setUploadProgress(Math.round(progress))
        },
      })
  
      if (uploadResponse.status >= 200 && uploadResponse.status <= 300) {
        toast.success("File uploaded successfully!")
        console.log(uploadResponse.data)
        setFile(null)
        setUploadProgress(0)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An error occurred during upload")
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="uploader-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'toast-container',
          duration: 3000,
        }}
      />
      
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} />
        <div className="file-icon">📁</div>
        <div className="file-input-text">Click or drag file to upload</div>
      </div>
      
      {file && (
        <div className="file-details">
          <p>File name: <span>{file.name.split('.')[0]}</span></p>
          <p>File size: <span>{(file.size / 1024).toFixed(2)} kb</span></p>
          <p>File type: <span>{file.type.split('/')[0]}</span></p>
          <p>File extension: <span>{file.type.split('/')[1]}</span></p>
          
          {uploadProgress > 0 && (
            <>
              <p>Upload progress: <span>{uploadProgress}%</span></p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      )}
      
      <button 
        className={`upload-button ${isUploading ? 'pulse-animation' : ''}`}
        onClick={handleUploadFile}
        disabled={!file || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  )
}

export default App