import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import toast from 'react-hot-toast';

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: 'user'
};

const Register = () => {
  const webcamRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [refImage, setRefImage] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setRefImage(reader.result);
    };
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const captureFromCamera = () => {
    const image = webcamRef.current.getScreenshot();
    setRefImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refImage) return toast.error('Please provide a reference image');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        ...form,
        referenceImage: refImage
      });
      toast.success(res.data.message);
      setForm({ name: '', email: '', password: '', role: 'user' });
      setRefImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">👤 Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="border p-4 rounded">
          <label className="block mb-2">Reference Image:</label>
          <div className="flex gap-4 mb-2">
            <button type="button" onClick={() => setUseCamera(true)} className="bg-blue-600 text-white px-4 py-1 rounded">Use Camera</button>
            <input type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
          </div>

          {useCamera && (
            <div className="flex flex-col items-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded shadow mb-2"
              />
              <button type="button" onClick={captureFromCamera} className="bg-green-600 text-white px-4 py-1 rounded">Capture</button>
            </div>
          )}

          {refImage && <img src={refImage} alt="Preview" className="mt-4 rounded shadow-md" />}
        </div>

        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">Register</button>
      </form>
    </div>
  );
};

export default Register;