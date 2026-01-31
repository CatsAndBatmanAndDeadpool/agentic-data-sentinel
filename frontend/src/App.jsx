import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');

        const formData = new FormData();
        formData.append('dataset', file);
        formData.append('analysis_type', 'quality'); // Default for now

        try {
            // In dev, Vite proxies /api to localhost:3000
            const response = await axios.post('/api/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
            setStatus('complete');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-datamundi-dark text-white p-8">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-datamundi-primary to-datamundi-accent rounded-lg flex items-center justify-center font-heading font-bold text-xl shadow-[0_0_15px_rgba(109,40,217,0.5)]">
                        A
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        AIDA <span className="text-datamundi-secondary">Security Evaluator</span>
                    </h1>
                </div>
                <div className="text-sm text-gray-400 font-sans">
                    Powered by CrewAI & Bandit
                </div>
            </header>

            <main className="max-w-4xl mx-auto">

                {/* Upload Section */}
                <section className="bg-datamundi-surface border border-gray-800 rounded-2xl p-10 text-center mb-8 relative overflow-hidden group hover:border-datamundi-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-datamundi-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-2 shadow-inner">
                            <Upload className="text-datamundi-secondary w-8 h-8" />
                        </div>

                        <h2 className="text-2xl font-bold">Upload Data for Evaluation</h2>
                        <p className="text-gray-400 max-w-md">
                            Drag and drop your CSV/JSON file here to trigger the automated security and quality analysis agents.
                        </p>

                        <label className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-datamundi-primary hover:bg-datamundi-accent text-white rounded-xl font-medium cursor-pointer transition-all shadow-lg hover:shadow-datamundi-primary/50">
                            <input type="file" className="hidden" onChange={handleFileChange} accept=".csv,.json" />
                            <span>{file ? file.name : "Select Dataset"}</span>
                        </label>

                        {file && (
                            <button
                                onClick={handleUpload}
                                disabled={status === 'uploading'}
                                className="mt-4 text-datamundi-secondary hover:text-white underline underline-offset-4 disabled:opacity-50"
                            >
                                {status === 'uploading' ? 'Analyzing...' : 'Run Analysis'}
                            </button>
                        )}
                    </div>
                </section>

                {/* Results Section */}
                {status === 'complete' && result && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                                <CheckCircle className="text-green-400" /> Analysis Complete
                            </h3>
                            <span className="text-sm text-gray-500">ID: {Date.now()}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: Summary */}
                            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                                <h4 className="text-datamundi-secondary font-bold mb-2">Agent Summary</h4>
                                <p className="text-gray-300 leading-relaxed">
                                    {result.result?.summary || "No summary provided."}
                                </p>
                            </div>

                            {/* Card 2: Metrics */}
                            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                                <h4 className="text-datamundi-secondary font-bold mb-2">Data Metrics</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-gray-800 py-2">
                                        <span className="text-gray-400">File Type</span>
                                        <span className="font-mono">{result.file?.split('.').pop()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-800 py-2">
                                        <span className="text-gray-400">Size</span>
                                        <span className="font-mono">{result.result?.data_length || 0} bytes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-6 h-6" />
                        <p>Analysis failed. Please check the backend connection.</p>
                    </div>
                )}

            </main>
        </div>
    )
}

export default App
