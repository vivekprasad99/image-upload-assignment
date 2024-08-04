'use client';
import { useState } from 'react';

export default function ImageUpload() {
    const [image, setImage] = useState(null);

    const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    console.log("hi");
    console.log(file);
    const fileName = `${file.name}_${Date.now()}`;
    console.log(fileName);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
      console.log("hello");
      if (data) {
        console.error('data uploading image:', data);
        return;
      }

      const url = `${supabase.storageUrl}/images/${fileName}`;
      await supabase.from('images').insert([{ url }]);
      setImage(url);

      return (
        <div>
        <h1>Hello World!</h1>
        <input 
        type="file" 
        accept="image/*"
        className="block w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300
        cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600
        dark:placeholder-gray-400"
        id="file_input"
        onChange={handleImageUpload}
        />
        {image && <img src={image} alt="Uploaded" width="300" height="300" />}
      </div>
      );

    };
}