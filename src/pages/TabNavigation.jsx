// TabNavigation.js
import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
    <li className="me-2">
      <button
        onClick={() => setActiveTab('home')}
        className={`inline-block p-4 rounded-t-lg ${
          activeTab === 'home' 
            ? 'text-blue-600 bg-gray-100' 
            : 'hover:text-gray-600 hover:bg-gray-50'
        }`}
      >
        Home
      </button>
    </li>
    <li className="me-2">
      <button
        onClick={() => setActiveTab('add')}
        className={`inline-block p-4 rounded-t-lg ${
          activeTab === 'add' 
            ? 'text-blue-600 bg-gray-100' 
            : 'hover:text-gray-600 hover:bg-gray-50'
        }`}
      >
        Add Transaction
      </button>
    </li>
    <li className="me-2">
      <button
        onClick={() => setActiveTab('history')}
        className={`inline-block p-4 rounded-t-lg ${
          activeTab === 'history' 
            ? 'text-blue-600 bg-gray-100' 
            : 'hover:text-gray-600 hover:bg-gray-50'
        }`}
      >
        History
      </button>
    </li>
    <li className="me-2">
      <button
        onClick={() => setActiveTab('charts')}
        className={`inline-block p-4 rounded-t-lg ${
          activeTab === 'charts' 
            ? 'text-blue-600 bg-gray-100' 
            : 'hover:text-gray-600 hover:bg-gray-50'
        }`}
      >
        Charts
      </button>
    </li>
  </ul>
);

export default TabNavigation; // Make sure you're using default export
