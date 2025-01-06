import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Expense from './pages/Expense';
import image2 from './assets/A3.png'; // Add the image path

export default function App() {
  return (
    <Router>
      <div className="body bg-slate-50 text-black w-screen h-screen font-mono text-white flex flex-col items-center">
        <Routes>
          {/* Route for Home Page */}
          <Route
            path="/"
            element={
              <>
                <div className="header w-full h-[50vh] flex flex-col mb-6"> {/* Reduced height here */}
                  <div className="title h-[20vh] w-full flex justify-center items-center">
                    <h1 className="text-4xl text-black">Expense Tracker</h1> {/* Reduced font size */}
                  </div>
                </div>

                {/* Image Section */}
                <div className="image w-full h-[30vh] flex justify-center items-center mb-6"> {/* Reduced height here */}
                  <div className="w-[220px]"> {/* Reduced image width */}
                    <img src={image2} alt="Expense Tracker" className="rounded-lg shadow-lg" />
                  </div>
                </div>

                {/* Track your expenses Button */}
                <div className="button w-full flex justify-center mb-6"> {/* Reduced margin */}
                  <Link to="/expense">
                    <button className="bg-green-600 hover:bg-green-900 px-5 py-2 rounded text-lg mt-4"> {/* Adjusted padding */}
                      → Track your expenses
                    </button>
                  </Link>
                </div>
              </>
            }
          />

          {/* Route for Expense Page */}
          <Route path="/expense" element={<Expense />} />
        </Routes>

        {/* Footer Section */}
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800 w-full">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2025 <a href="https://flowbite.com/" className="hover:underline"></a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">About</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </Router>
  );
}
