import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AnalysisTable = ({ report }) => {
    if (!report) return null;

    return (
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/40 shadow-2xl">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-slate-800/90 text-slate-200 text-xs uppercase tracking-widest font-bold">
                    <tr>
                        <th className="px-6 py-5 border-b border-r border-slate-700/50 w-[200px]">Section</th>
                        <th className="px-6 py-5 border-b border-r border-slate-700/50 w-[220px]">Category</th>
                        <th className="px-6 py-5 border-b border-slate-700/50">Details & Analysis</th>
                    </tr>
                </thead>
                <tbody className="text-slate-300 text-sm font-sans divide-y divide-slate-700/30">
                    {report.map((sec, secIdx) => (
                        <React.Fragment key={secIdx}>
                            {sec.data.map((row, rowIdx) => (
                                <tr key={`${secIdx}-${rowIdx}`} className="group hover:bg-slate-800/40 transition-all duration-200">
                                    {rowIdx === 0 && (
                                        <td
                                            rowSpan={sec.data.length}
                                            className="px-6 py-8 border-r border-slate-700/50 font-bold text-slate-100 bg-slate-800/20 align-top"
                                        >
                                            <div className="sticky top-8">
                                                {sec.section}
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-5 font-semibold text-slate-200 bg-slate-900/10 border-r border-slate-700/50 transition-colors">
                                        {row.metric}
                                    </td>
                                    <td className="px-6 py-5 leading-relaxed text-slate-300 font-sans">
                                        {row.value}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AnalysisResults = ({ results }) => {
    if (!results) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mx-auto mt-8 space-y-8"
        >
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:border-blue-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Filename</h3>
                    </div>
                    <p className="text-slate-100 font-medium truncate text-lg" title={results.filename}>
                        {results.filename}
                    </p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:border-purple-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <h3 className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Job Summary</h3>
                    </div>
                    <p className="text-slate-100 font-medium text-lg">
                        {results.summary}
                    </p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-slate-300 font-semibold uppercase tracking-wider text-xs">AI Quality Score</h3>
                    </div>
                    <p className="text-3xl font-black text-emerald-400 tracking-tighter">
                        {results.quality_score}
                    </p>
                </div>
            </div>

            {/* Main Report Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-bold font-heading text-slate-100 tracking-tight">
                        Security & Structure Report
                    </h2>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                        Detailed Audit
                    </span>
                </div>

                {results.structured_report ? (
                    <AnalysisTable report={results.structured_report} />
                ) : (
                    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 bg-slate-950/20">
                            <div className="prose prose-invert max-w-none prose-slate font-sans prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-base prose-strong:text-blue-400 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-5">
                                <ReactMarkdown>
                                    {results.full_report}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AnalysisResults;
