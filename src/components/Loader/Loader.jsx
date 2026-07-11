import React from 'react';
import './Loader.css';
import { MdRocketLaunch } from 'react-icons/md';

export default function Loader({ fullScreen = true, message = "Loading..." }) {
  return (
    <div className={`global-loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
      <div className="loader-content">
        <div className="loader-ring">
          <div className="loader-icon-wrapper">
            <MdRocketLaunch className="loader-icon" size={32} />
          </div>
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}
