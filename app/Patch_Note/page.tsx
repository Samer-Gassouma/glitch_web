"use client"
import React, { useState, useEffect } from 'react'

export default function DownloadApp() {
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [patchNotes, setPatchNotes] = useState('Initial release');

  /* useEffect(() => {
    // Fetch the latest app version and patch notes from your API
    // This is just a placeholder, replace it with your actual API call
    fetch('/api/app-info')
      .then(response => response.json())
      .then(data => {
        setAppVersion(data.version);
        setPatchNotes(data.patchNotes);
      });
  }, []); */

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-2">
      <div className="p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Download App</h1>
        <p className="mb-2"><span className="font-bold">Version:</span> {appVersion}</p>
        <p className="mb-4"><span className="font-bold">Patch Notes:</span> {patchNotes}</p>
        <a href="https://expo.dev/artifacts/eas/qmVmNZAe7g7cScL5vxWhL6.apk" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200 ease-in-out">
          Download
        </a>
      </div>
    </div>
  )
}