import { useState, useEffect, useRef } from 'react';
import image from '../assets/A.png';
import ExpenseChart from './ExpenseChart';
import ExpenseChart2 from './ExpenseChart2';
import ExpenseChart3 from './ExpenseChart3';
import App from '../App';

export default function Expense() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );
  const [showApp, setShowApp] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('INR');
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [status, setStatus] = useState('');

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currentCurrency,
    signDisplay: 'always',
  });

  const formRef = useRef(null);

  useEffect(() => {
    updateTotal();
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderList();
  }, [transactions, currentCurrency]);

  const updateTotal = () => {
    const incomeTotal = transactions
      .filter((trx) => trx.type === "income")
      .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
      .filter((trx) => trx.type === "expense")
      .reduce((total, trx) => total + trx.amount, 0);

    setIncome(formatter.format(incomeTotal));
    setExpense(formatter.format(-expenseTotal));
    setBalance(formatter.format(incomeTotal - expenseTotal));
  };

  const renderList = () => {
    setStatus(transactions.length === 0 ? "No transactions." : '');
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const amount = parseFloat(formData.get("amount"));
    const date = new Date(formData.get("date")) || new Date();
    const type = formData.get("type");

    if (!name || !amount || !type) return;

    const newTransaction = {
      id: transactions.length + 1,
      name,
      amount,
      date,
      type,
    };

    setTransactions([...transactions, newTransaction]);
    formRef.current.reset();
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((trx) => trx.id !== id);
    setTransactions(updatedTransactions);
  };

  return (
    <div className="body w-screen h-fit bg-slate-50 text-black font-mono flex flex-col">
      {showApp ? (
      <App /> ) : (
      <>
      <div className="navbar bg-slate-50 text-black flex justify-around items-center p-4">
        <div className="image h-[60px] w-[60px]">
<button
  class="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
  type="button" onClick={() => { setShowApp(true)}}
>
  <div
    class="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      height="25px"
      width="25px"
    >
      <path
        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
        fill="#000000"
      ></path>
      <path
        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
        fill="#000000"
      ></path>
    </svg>
  </div>
  <p class="translate-x-2">Go Back</p>
</button>

        </div>
        <div className="title text-black text-xl">
          <h1>Expense Tracker</h1>
        </div>
      </div>
      
      <main className="container flex flex-col items-center flex-grow p-14">
        
        <section className="transactions bg-white text-black w-[90vw] max-w-4xl border-2 p-4 m-4 rounded-xl shadow-md">
          <h1>Transactions</h1>
          <ul>
            {transactions.map(({ id, name, amount, date, type }) => (
              <li key={id} className="transaction-item flex justify-between items-center p-2">
                <div>
                  <h4>{name}</h4>
                  <p>{new Date(date).toLocaleDateString()}</p>
                </div>
                <div className="amount">
                  <span>{formatter.format(amount * (type === 'income' ? 1 : -1))}</span>
                </div>
                <button
                  className="remove-history-btn text-red-500"
                  onClick={() => deleteTransaction(id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div>{status}</div>
        </section>
        
        <div className="flex justify-evenly items-start w-full max-w-6xl gap-8">
          
          <section className="addtransactions w-full max-w-lg bg-white text-black p-6 rounded-2xl shadow-lg mt-8">
            <h1 className="text-xl font-bold mb-4">Add Transactions</h1>
            <form ref={formRef} onSubmit={addTransaction} className="flex flex-col">
              <input 
                name="name" 
                placeholder="Name of transaction" 
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2 mb-4" 
                type="text" 
              />
              <select name="type" className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2 mb-4">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input 
                name="amount" 
                placeholder="Amount" 
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2 mb-4" 
                type="number" 
                step="0.01"
              />
              <input 
                name="date" 
                placeholder="Date" 
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2 mb-4" 
                type="date"
              />
              <button 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-4" 
                type="submit"
              >
                Submit
              </button>
            </form>
          </section>

          <section className="chart-section bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg mt-8">
            <h1 className="text-xl font-bold text-black mb-4">Pie Chart</h1>
            <div className="chart bg-gray-100 text-black rounded-lg h-[300px] flex items-center justify-center">
              <ExpenseChart3 transactions={transactions} />
            </div>
          </section>
        </div>

        <div className="barchart flex justify-evenly items-center w-full max-w-6xl gap-12 p-14">
          <section className="chart-section bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg mt-8">
            <h1 className="text-xl font-bold text-black mb-4">Bar Chart</h1>
            <div className="chart bg-gray-100 text-black rounded-lg h-[300px] flex items-center justify-center">
              <ExpenseChart transactions={transactions} />
            </div>
          </section>

          <section className="chart-section bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg mt-8">
            <h1 className="text-xl font-bold text-black mb-4">Line Chart</h1>
            <div className="chart bg-gray-100 text-black rounded-lg h-[300px] flex items-center justify-center">
              <ExpenseChart2 transactions={transactions} />
            </div>
          </section>
        </div>

        <section className="balance flex justify-evenly w-full max-w-6xl m-8 gap-12">
    <div className="balancecard bg-white text-purple-600 w-[250px] h-[350px] rounded-2xl p-4 shadow-lg">
        <svg className="balance-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="Accounting" width="100" height="100">
            <g fill="#000000" className="color000000 svgShape">
                <path fill="#dbdcff" d="M49,18.45V55a5,5,0,0,1-5,5H10a5,5,0,0,1-5-5V9a5,5,0,0,1,5-5H36.13a5.051,5.051,0,0,1,3.84,1.8l7.87,9.45A4.993,4.993,0,0,1,48.98,18C48.99,18.15,49,18.3,49,18.45Z" className="colordbedff svgShape"></path>
                <path fill="#595bd4" d="M48.98,18H40a3.009,3.009,0,0,1-3-3V4.08A5.029,5.029,0,0,1,39.97,5.8l7.87,9.45A4.993,4.993,0,0,1,48.98,18Z" className="color8479c2 svgShape"></path>
                <path fill="#167ffc" d="M31 15H23a1 1 0 010-2h8a1 1 0 010 2zM35 20H23a1 1 0 010-2H35a1 1 0 010 2zM35 25H23a1 1 0 010-2H35a1 1 0 010 2z" className="color60b9fe svgShape"></path>
                <path fill="#595bd4" d="M16,19a3.5,3.5,0,1,1,3.5-3.5,1,1,0,0,1-2,0A1.5,1.5,0,1,0,16,17a1,1,0,0,1,0,2Z" className="color8479c2 svgShape"></path>
                <path fill="#595bd4" d="M16 24a3.5 3.5 0 01-3.5-3.5 1 1 0 012 0A1.5 1.5 0 1016 19a1 1 0 010-2 3.5 3.5 0 010 7zM16 14a1 1 0 01-1-1V11a1 1 0 012 0v2A1 1 0 0116 14z" className="color8479c2 svgShape"></path>
                <path fill="#595bd4" d="M16,26a1,1,0,0,1-1-1V23a1,1,0,0,1,2,0v2A1,1,0,0,1,16,26Z" className="color8479c2 svgShape"></path>
                <path fill="#8b8dff" d="M41 32H21a1 1 0 010-2H41a1 1 0 010 2zM17 32H13a1 1 0 010-2h4a1 1 0 010 2zM26 38H13a1 1 0 010-2H26a1 1 0 010 2zM41 38H30a1 1 0 010-2H41a1 1 0 010 2zM28 44H13a1 1 0 010-2H28a1 1 0 010 2z" className="color8bcaff svgShape"></path>
                <path fill="#b5b6ff" d="M41,44H32a1,1,0,0,1,0-2h9a1,1,0,0,1,0,2Z" className="colorb5dcff svgShape"></path>
                <path fill="#8b8dff" d="M24 50H13a1 1 0 010-2H24a1 1 0 010 2zM41 50H28a1 1 0 010-2H41a1 1 0 010 2z" className="color8bcaff svgShape"></path>
                <circle cx="45" cy="46" r="14" fill="#f2b371" className="colorf27182 svgShape"></circle>
                <circle cx="45" cy="46" r="10" fill="#fe9526" className="colorffe02f svgShape"></circle>
                <path fill="#53d86a" d="M41.465,50.535a1,1,0,0,1-.707-1.707l7.07-7.07a1,1,0,0,1,1.414,1.414l-7.07,7.07A.993.993,0,0,1,41.465,50.535Z" className="colorffffff svgShape"></path>
                <circle cx="42" cy="43" r="2" fill="#53d86a" className="colorffffff svgShape"></circle>
                <circle cx="47.932" cy="49.018" r="2.018" fill="#53d86a" className="colorffffff svgShape"></circle>
                <path fill="#232323" d="M44,60H10a5.006,5.006,0,0,1-5-5V9a5.006,5.006,0,0,1,5-5H36.13a4.989,4.989,0,0,1,3.838,1.8l7.871,9.45A5.013,5.013,0,0,1,49,18.45v10.9a1,1,0,0,1-2,0V18.45a3.013,3.013,0,0,0-.7-1.921L38.432,7.08A3,3,0,0,0,36.13,6H10A3,3,0,0,0,7,9V55a3,3,0,0,0,3,3H44a1.02,1.02,0,0,0,.156,0,1.015,1.015,0,0,1,.174-.016.736.736,0,0,0,.146-.02,1,1,0,0,1,.488,1.939,3.138,3.138,0,0,1-.5.078l-.046,0A3.181,3.181,0,0,1,44,60Z" className="color232323 svgShape"></path>
                <path fill="#232323" d="M47.72 18H40a3 3 0 01-3-3V5.47a1 1 0 112 0V15a1 1 0 001 1h7.72a1 1 0 010 2zM45 60A14 14 0 1159 46 14.015 14.015 0 0145 60zm0-26A12 12 0 1057 46 12.013 12.013 0 0045 34z" className="color232323 svgShape"></path>
                <path fill="#232323" d="M45,56.5a10.5,10.5,0,1,1,5.835-1.769,1,1,0,1,1-1.113-1.662A8.5,8.5,0,1,0,45,54.5a1,1,0,0,1,0,2Z" className="color232323 svgShape"></path>
            </g>
        </svg>
            <h3>Total Balance</h3>
            <span>{balance}</span>
          </div>
          <div className="balancecard bg-white text-green-600 w-[250px] h-[350px] rounded-2xl p-4 shadow-lg">
  <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Planning" width="80" height="80" enable-background="new 0 0 64 64" version="1.1" viewBox="0 0 64 64">
    <path d="M54.43,61.13h-5.47V33.37c0-0.79-0.64-1.43-1.44-1.43h-8.6v-8.7c0-0.8-0.64-1.44-1.43-1.44H27.45
	c-0.79,0-1.43,0.64-1.43,1.44v20.37h-8.61c-0.79,0-1.43,0.64-1.43,1.43v16.09h-4.97V18.36c0-0.79-0.65-1.44-1.44-1.44
	s-1.43,0.65-1.43,1.44v44.21c0,0.79,0.64,1.43,1.43,1.43h44.86c0.79,0,1.43-0.64,1.43-1.43S55.22,61.13,54.43,61.13z M26.02,60.94
	h-7.18V46.47h7.18V60.94z M36.05,60.94h-7.17V24.67h7.17V60.94z M46.09,60.94h-7.17V34.81h7.17V60.94z" fill="#595bd4" className="color000000 svgShape"></path>
    <rect width="7.18" height="14.47" x="18.84" y="46.47" fill="#167ffc" className="color42c3fc svgShape"></rect>
    <rect width="7.17" height="26.13" x="38.92" y="34.81" fill="#fe9526" className="colorffc064 svgShape"></rect>
    <rect width="7.17" height="36.27" x="28.88" y="24.67" fill="#eaa052" className="colorea526c svgShape"></rect>
    <path d="M51.7,0H10.63C9.84,0,9.2,0.64,9.2,1.43v6.06c0,0.8,0.64,1.44,1.43,1.44H51.7c0.79,0,1.43-0.64,1.43-1.44V1.43
	c0-0.79-0.64-1.43-1.43-1.43z M50.27,6.06h-38.2V2.87h38.2V6.06z" fill="#595bd4" className="color000000 svgShape"></path>
    <rect width="38.2" height="3.19" x="12.07" y="2.87" fill="#53d86a" className="color85d69e svgShape"></rect>
    <path d="M10.63,14.17H51.7c0.79,0,1.43-0.64,1.43-1.43c0-0.79-0.64-1.43-1.43-1.43H10.63c-0.79,0-1.43,0.64-1.43,1.43
	C9.2,13.53,9.84,14.17,10.63,14.17z" fill="#595bd4" className="color000000 svgShape"></path>
  </svg>
  <h3>Total Income</h3>
  <span>{income}</span>
</div>

<div className="balancecard bg-white text-red-600 w-[250px] h-[350px] rounded-2xl p-4 shadow-lg">
  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64" id="EuroCoin" width="80" height="80">
    <circle cx="32" cy="32" r="28" fill="#53d86a" className="colorffe603 svgShape"></circle>
    <circle cx="32" cy="32" r="22" fill="#fe9526" className="colorfcd206 svgShape"></circle>
    <g fill="#595bd4" className="color000000 svgShape">
      <path d="M32,61C16,61,3,48,3,32S16,3,32,3s29,13,29,29S48,61,32,61z M32,5C17.1,5,5,17.1,5,32s12.1,27,27,27s27-12.1,27-27
			S46.9,5,32,5z" fill="#595bd4" className="color000000 svgShape"></path>
      <path d="M32,55C19.3,55,9,44.7,9,32S19.3,9,32,9s23,10.3,23,23S44.7,55,32,55z M32,11c-11.6,0-21,9.4-21,21s9.4,21,21,21
			s21-9.4,21-21S43.6,11,32,11z" fill="#595bd4" className="color000000 svgShape"></path>
      <path d="M57.2 32c.4 3.3 0 6.7-1.2 9.9-1.2 3.2-3.1 6.1-5.5 8.6-2.4 2.4-5.4 4.3-8.6 5.5-3.2 1.2-6.6 1.6-9.9 1.2 3.3-.4 6.4-1.3 9.3-2.6 2.9-1.4 5.5-3.2 7.8-5.4 2.3-2.2 4.1-4.9 5.4-7.8C55.9 38.4 56.7 35.3 57.2 32zM6.8 32c-.4-3.3 0-6.7 1.2-9.9 1.2-3.2 3.1-6.1 5.5-8.6 2.4-2.4 5.4-4.3 8.6-5.5 3.2-1.2 6.6-1.6 9.9-1.2-3.3.4-6.4 1.3-9.3 2.6-2.9 1.4-5.5 3.2-7.8 5.4-2.3 2.2-4.1 4.9-5.4 7.8C8.1 25.6 7.3 28.7 6.8 32zM32 43.8h-5.4c-.6 0-1-.4-1-1s.4-1 1-1H32c2.4 0 4.4-2 4.4-4.4 0-2.4-2-4.4-4.4-4.4-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4h5.4c.6 0 1 .4 1 1s-.4 1-1 1H32c-2.4 0-4.4 2-4.4 4.4 0 2.4 2 4.4 4.4 4.4 3.5 0 6.4 2.9 6.4 6.4S35.5 43.8 32 43.8z" fill="#595bd4" className="color000000 svgShape"></path>
      <path d="M32,46.3c-0.6,0-1-0.4-1-1V18.8c0-0.6,0.4-1,1-1s1,0.4,1,1v26.5C33,45.8,32.6,46.3,32,46.3z" fill="#595bd4" className="color000000 svgShape"></path>
    </g>
  </svg>
            <h3>Your Expenses</h3>
            <span>{expense}</span>
          </div>
        </section>
      </main>
      </>
      )}
    </div>
  );
}
