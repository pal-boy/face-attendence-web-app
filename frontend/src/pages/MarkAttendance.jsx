import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import toast from 'react-hot-toast';

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: 'user'
};

const MarkAttendance = () => {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(false);
  const [preview, setPreview] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    setCaptured(true);
  };

  const submitAttendance = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId || !preview) return toast.error('Missing data');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/attendance/mark',
        { userId, image: preview },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Attendance marked successfully:", res.data);
      toast.success(res.data.message);
      setCaptured(false);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">📷 Mark Attendance</h1>

      {!captured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded border shadow-md mb-4"
          />
          <button
            onClick={capture}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Capture Photo
          </button>
        </>
      ) : (
        <>
          <img src={preview} alt="Captured" className="rounded border shadow-md mb-4" />
          <div className="flex justify-center gap-4">
            <button
              onClick={submitAttendance}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Submit Attendance
            </button>
            <button
              onClick={() => {
                setCaptured(false);
                setPreview(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Retake
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;