import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, fetchUsers } from './store';
import InputMask from 'react-input-mask';
import 'xp.css/dist/XP.css';
import './App.css';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  const handleSubmit = (event: React.FormEvent) => {  
    event.preventDefault();
    dispatch(fetchUsers({ email, number }));
  };

  return (
    <div className="App">
      <div className="window" style={{ height: 200, width: 600, margin: '0 auto', padding: 20 }}>
        <div className="title-bar">
          <div className="title-bar-text">User Search</div>
        </div>
        <div className="window-body">
          <form onSubmit={handleSubmit}>
            <div className="field-row-stacked">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field-row-stacked">
              <label htmlFor="number">Number (optional):</label>
              <InputMask
                id="number"
                mask="99-99-99"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              >
              </InputMask>
            </div>
            <div className="field-row">
              <button type="submit" className="button">
                Submit
              </button>
            </div>
          </form>
          {loading ? (
            <>
              {error && <p className="form-error">{error}</p>}
              <div className="loader">Loading...</div>
            </>
          ) : (
            users.length > 0 && (
              <ul className="tree-view">
                {users.map((user, index) => (
                  <li key={index}>
                    {user.email} - {user.number}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
