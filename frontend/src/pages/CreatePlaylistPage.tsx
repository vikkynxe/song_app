import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Plus, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface CreatePlaylistPageProps {
  onPlaylistCreated?: () => void;
}

export const CreatePlaylistPage: React.FC<CreatePlaylistPageProps> = ({ onPlaylistCreated }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a valid CSV file (.csv format required).');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!playlistName.trim()) {
      setError('Please enter a name for your playlist.');
      return;
    }

    if (!file) {
      setError('Please select or upload a CSV file containing your songs data.');
      return;
    }

    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('No user authentication token found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // Required backend fields: playlistname, file, hash_id
      formData.append('playlistname', playlistName.trim());
      formData.append('file', file);
      formData.append('hash_id', token);

      const response = await fetch(API_ENDPOINTS.createPlaylist, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setSuccess(`Playlist "${playlistName}" created successfully!`);
        setPlaylistName('');
        setFile(null);
        if (onPlaylistCreated) {
          setTimeout(() => {
            onPlaylistCreated();
          }, 1200);
        }
      } else {
        const msg =
          (data && (data.message || data.error || data.detail)) ||
          'Failed to upload playlist. Please verify CSV format and try again.';
        setError(msg);
      }
    } catch (err: any) {
      console.error('Create playlist error:', err);
      setError(
        'Unable to connect to backend at http://localhost:8000. Please verify your backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white">
          Create New Playlist
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload a track metadata CSV file to generate your custom playlist on the backend
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Playlist Name Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="playlist-name-input">
              Playlist Title *
            </label>
            <input
              id="playlist-name-input"
              type="text"
              required
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="e.g. Midnight Chill, Deep Focus Vol. 1"
              className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-sm rounded-xl py-3 px-4"
            />
          </div>

          {/* CSV File Upload Area */}
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Track Dataset (CSV Format) *
            </span>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : file
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                      {(file.size / 1024).toFixed(1)} KB · CSV document
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-rose-400 hover:text-rose-300 underline mt-1"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Drag and drop your CSV file here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Must contain track titles, artists, and audio track hashes
                    </p>
                  </div>

                  <label
                    htmlFor="csv-file-input"
                    className="mt-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 cursor-pointer transition-colors"
                  >
                    Select File
                    <input
                      id="csv-file-input"
                      type="file"
                      accept=".csv,text/csv"
                      onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 glass-btn-primary text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading and Parsing Playlist...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Playlist</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
