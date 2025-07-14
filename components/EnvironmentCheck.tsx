
import React, { useState, useEffect } from 'react';

const EnvironmentCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInvalidEnvironment, setIsInvalidEnvironment] = useState(false);

  useEffect(() => {
    if (window.location.protocol === 'file:') {
      setIsInvalidEnvironment(true);
    }
  }, []);

  if (isInvalidEnvironment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 p-8 flex flex-col items-center justify-center text-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold mb-4">PARDON?! Environment Error</h1>
          <p className="text-xl mb-6">
            This application cannot run directly from a local file (`file://`).
            This is due to modern browser security policies (CORS) that block requests for audio and APIs.
          </p>
          <p className="text-xl mb-8 font-bold">Please run this app from a local web server.</p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/20 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-3">Option 1: VS Code (Easiest)</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Install the <strong className="text-yellow-300">Live Server</strong> extension.</li>
                <li>Open your project folder in VS Code.</li>
                <li>Right-click on the `index.html` file in the explorer.</li>
                <li>Select "Open with Live Server".</li>
              </ol>
            </div>
            <div className="bg-white/20 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-3">Option 2: Terminal</h2>
               <ol className="list-decimal list-inside space-y-2">
                 <li>Open a terminal in your project's root folder.</li>
                 <li>If you have Python 3, run this command:</li>
                 <li className="list-none ml-4">
                    <code className="bg-black/50 p-2 rounded-md text-yellow-300">python3 -m http.server</code>
                 </li>
                 <li>Open your browser and go to `http://localhost:8000`.</li>
               </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnvironmentCheck;
