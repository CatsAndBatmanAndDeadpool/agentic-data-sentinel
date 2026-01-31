import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const FileUpload = ({ onAnalysisComplete }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleFileInput = (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        setUploadStatus('uploading');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // In production, use env var for URL
            const response = await axios.post('http://localhost:8000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadStatus('success');
            onAnalysisComplete(response.data);

            // Reset status after a moment to allow another upload
            setTimeout(() => setUploadStatus('idle'), 3000);

        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus('error');
            setErrorMessage(error.response?.data?.detail || 'Failed to upload and analyze file.');
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-1">
            <motion.div
                layout
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
                    "backdrop-blur-md bg-white/5",
                    isDragOver
                        ? "border-blue-400 bg-blue-500/10 scale-[1.02]"
                        : "border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".csv,.json,.txt"
                />

                <AnimatePresence mode="wait">
                    {uploadStatus === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="p-4 rounded-full bg-slate-800/50 ring-1 ring-slate-700 shadow-xl">
                                <Upload className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-200">
                                    Upload dataset
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    Supports CSV, JSON, TXT
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {uploadStatus === 'uploading' && (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center space-y-4"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader className="w-10 h-10 text-blue-500" />
                            </motion.div>
                            <p className="text-slate-300 font-medium animate-pulse">
                                Agents are analyzing your data...
                            </p>
                        </motion.div>
                    )}

                    {uploadStatus === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center space-y-4"
                        >
                            <div className="p-4 rounded-full bg-green-500/20 ring-1 ring-green-500/50">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <p className="text-green-300 font-medium">
                                Analysis Complete!
                            </p>
                        </motion.div>
                    )}

                    {uploadStatus === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center space-y-4"
                        >
                            <div className="p-4 rounded-full bg-red-500/20 ring-1 ring-red-500/50">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-red-300 font-medium">Analysis Failed</p>
                                <p className="text-xs text-red-400/80 mt-1 max-w-xs">{errorMessage}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FileUpload;
