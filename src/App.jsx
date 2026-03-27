import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
// Import reset from the slice
import { increment, decrement, incrementByAmount, reset } from "./features/auth/auth.slice";
import "./App.css";

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(1);
  return (
    <div className="app-container">
      <div className="counter-card">
        <h1 className="title">Redux Counter</h1>
        
        <div className="count-display">
          {count}
        </div>

        <div className="button-group">
          <button className="btn increment" onClick={() => dispatch(increment())}>
            + INCREASE
          </button>
          <button className="btn decrement" onClick={() => dispatch(decrement())}>
            - DECREASE
          </button>
        </div>

        <div className="action_group">
          <input type="number" 
          className="amount-input"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="action-group" style={{ marginTop: '15px' }}>
          <button className="btn secondary" onClick={() => dispatch(incrementByAmount(amount))}>
            Add {amount}
          </button>
 
          <button 
             className="btn clear" 
             style={{ backgroundColor: '#9ca3af', marginLeft: '10px', color: 'white' }} 
             onClick={() => dispatch(reset())}
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

