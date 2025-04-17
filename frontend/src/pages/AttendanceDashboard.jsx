
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AttendanceDashboard = () => {
  const [records, setRecords] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      toast.error('Failed to fetch attendance');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📋 Attendance Records</h2>
      {records.length === 0 ? (
        <p className="text-center text-gray-600">No attendance records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="flex items-center gap-4 border p-4 rounded shadow-sm">
              <img src={record.image} alt="attendance" className="w-20 h-20 object-cover rounded" />
              <div>
                <p><strong>Date:</strong> {new Date(record.timestamp).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(record.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
