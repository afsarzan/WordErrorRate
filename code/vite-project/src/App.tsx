import { useState } from 'react'
import './App.css'

function App() {
  const [ref, setRef] = useState('');
  const [hyp, setHyp] = useState('');
  
  const calculateWer = () => {
    
  }
  return (
    <>
      <div className="wer-container">
        <div>
          <label htmlFor="reference">Reference</label>
          <input id="reference" type="text"  value={ref} onChange={(e) => setRef(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="hypothesis">Hypothesis</label>
          <input id="hypothesis" type="text" value={hyp} onChange={(e) => setHyp(e.target.value)} />
        </div>
        <button onClick={calculateWer}>Compute WER</button>
      </div>
    </>
  )
}

export default App
