import React, { useState } from 'react';
import './App.css';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [fullExpression, setFullExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [storedValue, setStoredValue] = useState(null);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setFullExpression(prev => prev + digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
      setFullExpression(prev => prev === '' ? String(digit) : prev + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setFullExpression(prev => prev + '0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
      setFullExpression(prev => prev + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFullExpression('');
  };

  const clearAll = () => {
    setDisplay('0');
    setFullExpression('');
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const newDisplay = display.charAt(0) === '-' ? display.substr(1) : '-' + display;
    setDisplay(newDisplay);
    setFullExpression(newDisplay);
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
      setFullExpression('');
    } else {
      setDisplay(display.slice(0, -1));
      setFullExpression(prev => prev.slice(0, -1));
    }
  };

  const handleRefresh = () => {
    clearAll();
    setMemory(0);
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      const result = Math.sqrt(value);
      setDisplay(String(result));
      setFullExpression(`√(${value}) = ${result}`);
    } else {
      setDisplay('Error');
      setFullExpression('Error');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (nextOperation === 'x²') {
      const squared = inputValue * inputValue;
      setDisplay(String(squared));
      setFullExpression(`${inputValue}² = ${squared}`);
      return;
    }

    if (nextOperation === '1/x') {
      if (inputValue === 0) {
        setDisplay('Error');
        setFullExpression('1/0 = Error');
        return;
      }
      const reciprocal = 1 / inputValue;
      setDisplay(String(reciprocal));
      setFullExpression(`1/${inputValue} = ${reciprocal}`);
      return;
    }

    if (nextOperation === '√') {
      handleSquareRoot();
      return;
    }

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operation) {
      const currentValue = storedValue || 0;
      let newValue;

      switch (operation) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '*': newValue = currentValue * inputValue; break;
        case '/': 
          if (inputValue === 0) {
            setDisplay('Error');
            setFullExpression('Division by zero');
            setStoredValue(null);
            setOperation(null);
            return;
          }
          newValue = currentValue / inputValue; 
          break;
        default: newValue = inputValue;
      }

      setStoredValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    if (nextOperation !== '=') {
      setFullExpression(prev => prev + nextOperation);
    }
  };

  const handleEquals = () => {
    if (!operation || storedValue === null) return;
    
    const inputValue = parseFloat(display);
    const currentValue = storedValue || 0;
    let result;

    switch (operation) {
      case '+': result = currentValue + inputValue; break;
      case '-': result = currentValue - inputValue; break;
      case '*': result = currentValue * inputValue; break;
      case '/': 
        if (inputValue === 0) {
          setDisplay('Error');
          setFullExpression('Division by zero');
          setStoredValue(null);
          setOperation(null);
          return;
        }
        result = currentValue / inputValue; 
        break;
      default: result = inputValue;
    }

    setDisplay(String(result));
    setFullExpression(`${currentValue} ${operation} ${inputValue} = ${result}`);
    setStoredValue(null);
    setOperation(null);
  };

  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    setDisplay(String(memory));
    setFullExpression(String(memory));
  };
  const memoryAdd = () => setMemory(memory + parseFloat(display));
  const memorySubtract = () => setMemory(memory - parseFloat(display));

  return (
    <div className="calculator">
      <div className="display">{fullExpression || display}</div>
      
      <div className="button-row">
        <button onClick={handleRefresh} className="purple">↺</button>
        <button onClick={handleBackspace} className="purple">←</button>
        <button onClick={clearDisplay} className="purple">C</button>
        <button onClick={clearAll} className="purple">AC</button>
      </div>
      
      <div className="button-row">
        <button onClick={memoryClear} className="green">mc</button>
        <button onClick={memoryAdd} className="green">m+</button>
        <button onClick={memorySubtract} className="green">m-</button>
        <button onClick={memoryRecall} className="green">mr</button>
      </div>
      
      <div className="button-row">
        <button onClick={() => inputDigit(7)} className="blue">7</button>
        <button onClick={() => inputDigit(8)} className="blue">8</button>
        <button onClick={() => inputDigit(9)} className="blue">9</button>
        <button onClick={() => performOperation('/')} className="gray">/</button>
        <button onClick={handleSquareRoot} className="gray">√</button>
      </div>
      
      <div className="button-row">
        <button onClick={() => inputDigit(4)} className="blue">4</button>
        <button onClick={() => inputDigit(5)} className="blue">5</button>
        <button onClick={() => inputDigit(6)} className="blue">6</button>
        <button onClick={() => performOperation('*')} className="gray">*</button>
        <button onClick={() => performOperation('x²')} className="gray">x²</button>
      </div>
      
      <div className="button-row">
        <button onClick={() => inputDigit(1)} className="blue">1</button>
        <button onClick={() => inputDigit(2)} className="blue">2</button>
        <button onClick={() => inputDigit(3)} className="blue">3</button>
        <button onClick={() => performOperation('-')} className="gray">-</button>
        <button onClick={() => performOperation('1/x')} className="gray">1/x</button>
      </div>
      
      <div className="button-row">
        <button onClick={() => inputDigit(0)} className="blue">0</button>
        <button onClick={inputDecimal} className="gray">.</button>
        <button onClick={toggleSign} className="gray">+-</button>
        <button onClick={() => performOperation('+')} className="gray">+</button>
        <button onClick={handleEquals} className="red">=</button>
      </div>
    </div>
  );
}

export default Calculator;