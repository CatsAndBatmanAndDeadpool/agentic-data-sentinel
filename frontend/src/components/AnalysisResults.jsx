import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Activity } from 'lucide-react';

const AnalysisResults = ({ results }) => {
    if (!results) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto mt-8 space-y-6"
        >
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="text-slate-200 font-medium">File</h3>
                    </div>
                    <p className="text-slate-400 text-sm truncate" title={results.filename}>
                        {results.filename}
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center space-x-3 mb-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <h3 className="text-slate-200 font-medium">Summary</h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                        {results.summary}
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center space-x-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-slate-200 font-medium">Quality Score</h3>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">
                        {results.quality_score}
                    </p>
                </div>
            </div>

            {/* Main Report */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/80">
                    <h3 className="text-lg font-semibold text-slate-100">
                        Full Analysis Report
                    </h3>
                </div>
                <div className="p-6 bg-slate-950/30">
                    <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300">
                            {results.full_report}
                        </pre>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalysisResults;
