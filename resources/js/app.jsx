/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './components/Timer';

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// This is your main App component
function App() {
    return (
        <div className="container">
            <h1 className="text-center mt-5">Work/Break Timer</h1>
            <Timer /> {/* Using the Timer component */}
            {/* You can add more components or content here as needed */}
        </div>
    );
}

// This code checks if there's an element with id 'app' in your blade template and then renders the React app within it.
if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
