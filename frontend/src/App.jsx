import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';

function App() {
    const [results, setResults] = useState(null);

    const handleAnalysisComplete = (data) => {
        setResults(data);
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-datamundi-dark text-white selection:bg-datamundi-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-datamundi-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-datamundi-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">

                {/* Header */}
                <header className="mb-16 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-slate-800/50 rounded-2xl ring-1 ring-slate-700/50 shadow-2xl backdrop-blur-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-datamundi-primary to-datamundi-accent rounded-xl flex items-center justify-center font-heading font-bold text-xl shadow-[0_0_15px_rgba(109,40,217,0.5)] mr-3">
                            S
                        </div>
                        <span className="text-xl font-heading font-bold tracking-tight text-slate-100">
                            Sentinel <span className="text-transparent bg-clip-text bg-gradient-to-r from-datamundi-secondary to-blue-400">Security</span>
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                        Secure AI Data Evaluator
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Upload your datasets for automated structure analysis and quality auditing powered by CrewAI agents.
                    </p>
                </header>

                {/* Main Content */}
                <main className="w-full space-y-12">
                    <FileUpload onAnalysisComplete={handleAnalysisComplete} />
                    <AnalysisResults results={results} />
                </main>

                {/* Footer */}
                <footer className="mt-20 text-center text-sm text-slate-500 font-medium">
                    <p>Powered by FastAPI, CrewAI, and React</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
