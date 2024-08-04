'use client';
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
// import ImageUpload from './components/ImageUpload';

export default function Home() {
  
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.from('images').select('*');
      if (error) {
        console.error('Error fetching images:', error);
      } else {
        console.log(data);
        setImages(data);
      }
    };

    fetchImages();
  }, []);

  const handleUpload = (url) => {
    setImages((prevImages) => [...prevImages, { url }]);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="main-container">
      <ImageUpload onUpload={handleUpload}/>
    </div>
    <style jsx>{`
        .main-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
      `}</style>
    </main>
  );
}

const ImageUpload=({ onUpload })=> {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadMessage('');
    console.log("hi");
    console.log(file);
    const fileName = `${file.name}_${Date.now()}`;
    console.log(fileName);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    console.log("hello");
    const fileName = `${Date.now()}_${selectedFile.name}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, selectedFile);

      if (error) {
        console.error('Error uploading image:', error);
        setIsLoading(false);
        setUploadMessage('Failed to upload image');
        return;
      }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
    console.log(url);
    const {success,failure} = await supabase.from('images').insert([{ url:url }]).select();

    if(failure) 
    {
      console.error('Error adding image:', failure);
      return;
    }
    setIsLoading(false);
    setUploadMessage('Image has been uploaded');
    setImagePreview(null);
    setSelectedFile(null);
    if (onUpload) onUpload(url);
  };

    return (
      <div className="upload-container">
        <div className="file-upload-wrapper">
      <input type="file" accept="image/*" onChange={handleImageChange} id="file-input" className="file-input"/>
      <label htmlFor="file-input" className="custom-file-input">
          <span className="file-input-button">Choose File</span>
          <span className="file-input-label">{selectedFile ? selectedFile.name : 'No file chosen'}</span>
      </label>
      </div>
      {imagePreview && (
        <div className="preview-container">
          <img src={imagePreview} alt="Image Preview" className="preview-image" />
          <button onClick={handleImageUpload} className="upload-button">Upload Image</button>
        </div>
      )}
      {isLoading && (
        <div className="loader-container">
          <Oval
            height={80}
            width={80}
            color="#0070f3"
            secondaryColor="#005bb5"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      {!isLoading && uploadMessage && (
        <div className="message-container">
          <p className="upload-message">{uploadMessage}</p>
        </div>
      )}
      <style jsx>{`
        .upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .file-upload-wrapper {
          display: flex;
          align-items: center;
        }
        .file-input {
          display: none;
        }
        .custom-file-input {
          display: flex;
          align-items: center;
          border: 2px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
        }
        .file-input-button {
          background-color: #000;
          color: #fff;
          padding: 10px 20px;
          cursor: pointer;
        }
        .file-input-label {
          background-color: #fff;
          padding: 10px 20px;
        }
        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10px;
        }
        .preview-image {
          width: 300px;
          height: 300px;
          object-fit: cover;
          border: 2px solid #ddd;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .upload-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .upload-button:hover {
          background-color: #005bb5;
        }
        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
        }
        .message-container {
          margin-top: 20px;
        }
        .upload-message {
          font-size: 16px;
          color: green;
        }
      `}</style>
    </div>
    );

  }