'use client';
import { supabase } from "../../utils/supabase";
import {useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';

export default function Home() {

  const [images, setImages] = useState([])

  useEffect(() => { 
    async function fetchImages() {

      const { data, error } = await supabase
    .storage
    .from('images') // replace with your bucket name
    .list()

    if (error) {
      console.log({ error: error.message });
    }

    const imageUrls = data.map(file => {
      return supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl
    })

    console.log(imageUrls)

    setImages(imageUrls)
     }

     fetchImages()
    
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      <div className="main-container">
      <h1>Images</h1>
      <div>
        {images.map((url, index) => (
          <img className="preview-image" key={index} src={url} alt={`Image ${index}`} />
        ))}
      </div>
      <ImageUpload/>
    </div>
    </main>
  );
}

const ImageUpload=()=> {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadMessage('');
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    const fileName = `${Date.now()}_${selectedFile.name}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, selectedFile);

      if (error) {
        setIsLoading(false);
        setUploadMessage('Failed to upload image');
        return;
      }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
    const {success,failure} = await supabase.from('images').insert([{ url:url }]);

    if(failure) 
    {
      return;
    }
    setIsLoading(false);
    setUploadMessage('Image has been uploaded');
    setImagePreview(null);
    setSelectedFile(null);
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
    </div>
    );

  }