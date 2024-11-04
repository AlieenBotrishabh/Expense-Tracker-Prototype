import { useState } from 'react';
import Expense from './pages/Expense';
import image2 from './assets/A3.png';

export default function App() {
  const [showExpense, setShowExpense] = useState(false);

  return (
    <div className="body bg-slate-50 text-black w-screen h-screen font-mono text-white flex flex-col items-center">
      {showExpense ? (
        <Expense />
      ) : (
        <>
          <div className="header w-full h-[60vh] flex flex-col">
            <div className="title h-[30vh] w-full flex justify-center items-center">
              <h1 className="text-5xl text-black">Expense Tracker</h1>
            </div>
            <div className="image h-[30vh] w-full flex justify-center items-center">
              <div className="w-[250px]">
                <img src={image2} alt="Expense Tracker" />
              </div>
            </div>
          </div>
          <div className="button w-full h-[40vh] flex flex-col justify-center items-center">
            <button
              className="bg-green-600 hover:bg-green-900 px-6 py-3 rounded text-lg mt-6"
              onClick={() => setShowExpense(true)}
            >
              → Track your expenses
            </button>
          </div>
        </>
      )}
    </div>
  );
}
