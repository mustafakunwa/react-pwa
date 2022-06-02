import React, { useState, useEffect, useRef } from "react";
import { getBank } from "./bank";
import "./App.css";

const App = () => {
  const [banks, setBanks] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffectOnce(() => {
    getBank()
      .then(({ data }) => {
        if (data?.length > 0) setBanks(data);
      })
      .catch((error) => {
        if (!navigator.onLine) {
          setIsOnline(false);
        }
      });
  }, []);

  return (
    <div className="main">
      <div className="main__table">
        <table>
          <thead>
            <tr>
              <th>Bank</th>
              <th>Bank code</th>
              <th>Address</th>
              <th>Country</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank) => (
              <tr key={bank.id}>
                <td>{bank.bank_name}</td>
                <td>{bank.bank_code}</td>
                <td>{bank.address}</td>
                <td>{bank.country}</td>
                <td>{bank.phone}</td>
              </tr>
            ))}
            {!isOnline && (
              <tr>
                <td colSpan="5">
                  <div className="main__table__error">
                    <p>
                      You are offline. Please check your internet connection.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;

export const useEffectOnce = (effect) => {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [, setVal] = useState(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};
