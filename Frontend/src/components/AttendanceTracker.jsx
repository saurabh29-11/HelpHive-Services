import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, UserCheck, XCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AttendanceTracker = ({ booking, isWorker }) => {
  const [attendanceData, setAttendanceData] = useState({ logs: [], stats: { totalDays: 0, presentDays: 0 } });
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    if (!booking?._id) return;
    try {
      const response = await api.get(`/attendance/booking/${booking._id}`);
      setAttendanceData(response.data.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [booking]);

  const handleMark = async (action) => {
    setLoading(true);
    const toastId = toast.loading(`${action === 'CHECK_IN' ? 'Checking in' : 'Checking out'}...`);
    try {
      const response = await api.post('/attendance/mark', {
        bookingId: booking._id,
        action
      });
      if (response.data.success) {
        toast.success(`Attendance marked successfully! (${action})`, { id: toastId });
        fetchAttendance();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = attendanceData.logs.find(l => l.date === todayStr);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-component)] p-6 shadow-lg mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-strong)] flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
            Daily Attendance & Work Log Tracker
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Track daily check-ins, check-outs, and monthly work calendar.</p>
        </div>

        {/* Attendance Stats Badge */}
        <div className="flex items-center gap-3 bg-[var(--color-bg-component-subtle)] px-4 py-2 rounded-lg border border-[var(--color-border)]">
          <div className="text-center">
            <span className="text-xs text-[var(--color-text-muted)] block">Total Days</span>
            <span className="font-bold text-[var(--color-text-strong)]">{attendanceData.stats.totalDays}</span>
          </div>
          <div className="h-6 w-px bg-[var(--color-border)]" />
          <div className="text-center">
            <span className="text-xs text-green-400 block">Present</span>
            <span className="font-bold text-green-400">{attendanceData.stats.presentDays}</span>
          </div>
        </div>
      </div>

      {/* Worker Action Buttons */}
      {isWorker && (
        <div className="mb-6 p-4 rounded-lg bg-[var(--color-bg-component-subtle)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-[var(--color-text-strong)] block">Today's Status ({todayStr})</span>
            <p className="text-xs text-[var(--color-text-muted)]">
              {todayLog?.checkInTime ? `Checked In: ${todayLog.checkInTime}` : 'Not checked in yet today'}
              {todayLog?.checkOutTime ? ` | Checked Out: ${todayLog.checkOutTime}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMark('CHECK_IN')}
              className="btn bg-green-600 hover:bg-green-700 text-white font-semibold text-xs flex items-center gap-1.5"
              disabled={loading || !!todayLog?.checkInTime}
            >
              <UserCheck size={16} /> {todayLog?.checkInTime ? 'Checked In' : 'Check In'}
            </button>
            <button
              onClick={() => handleMark('CHECK_OUT')}
              className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
              disabled={loading || !todayLog?.checkInTime || !!todayLog?.checkOutTime}
            >
              <Clock size={16} /> {todayLog?.checkOutTime ? 'Checked Out' : 'Check Out'}
            </button>
          </div>
        </div>
      )}

      {/* Attendance Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-component-subtle)] text-xs text-[var(--color-text-muted)] uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Check-In Time</th>
              <th className="px-4 py-3">Check-Out Time</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {attendanceData.logs.length > 0 ? (
              attendanceData.logs.map(log => (
                <tr key={log._id} className="hover:bg-[var(--color-bg-component-subtle)] transition-colors">
                  <td className="px-4 py-3 font-semibold text-[var(--color-text-strong)]">{log.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                      <CheckCircle2 size={12} /> {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">{log.checkInTime || '--'}</td>
                  <td className="px-4 py-3 text-[var(--color-text)]">{log.checkOutTime || '--'}</td>
                  <td className="px-4 py-3 text-xs italic text-[var(--color-text-muted)]">{log.notes || 'No notes'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-[var(--color-text-muted)]">
                  No attendance records logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracker;
