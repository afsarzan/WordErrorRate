import { useState } from 'react'
import './App.css'

function App() {
  const [ref, setRef] = useState<string>('');
  const [hyp, setHyp] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  
  const calculateWer = () => {
   setResult(100);
  }
  return (
    <>
      <div className="wer-container">
        <h1>Word Error Rate Calculator</h1>
        <div>
          <label htmlFor="reference">Reference</label>
          <input id="reference" type="text"  value={ref} onChange={(e) => setRef(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="hypothesis">Hypothesis</label>
          <input id="hypothesis" type="text" value={hyp} onChange={(e) => setHyp(e.target.value)} />
        </div>
        <button onClick={calculateWer}>Compute WER</button>

        <div className="result">
          <strong>Result: WER: {result}</strong>
        </div>    
      </div>
    </>
  )
}

export default App
