import { useState } from 'react'
import './App.css'

function App() {
  const [ref, setRef] = useState<string>('');
  const [hyp, setHyp] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  
  const calculateWer = () => {
    const refWords = ref.trim().split(' ')
    
    const hypWords = hyp.trim().split(' ')
    
    
    let substitution  = 0;
    let deletion = 0;
    let insertion = 0;
    const totalWords = refWords.length;

    deletion = findOperation('deletion',refWords, hypWords);    
    console.log('%c [ deletion ]-21', 'font-size:13px; background:pink; color:#bf2c9f;', deletion)
    insertion = findOperation('insertion',refWords, hypWords);    
    console.log('%c [ insertion ]-23', 'font-size:13px; background:pink; color:#bf2c9f;', insertion)
    substitution = findOperation('substitution',refWords, hypWords);
    console.log('%c [ substitution ]-25', 'font-size:13px; background:pink; color:#bf2c9f;', substitution)
    
    const werResult = (substitution + deletion + insertion)/ totalWords
   setResult(werResult);
  }

  const findOperation = (operationType: string, refWords: string[], hypWords: string[]) => {
    let count = 0;
    
    switch(operationType) {
      case 'deletion': {
        const newWords = hypWords.length - refWords.length;
        count = newWords > 0 ? 0 : Math.abs(newWords);
        break;
        }
      case 'insertion':
        hypWords.forEach((word) => {
          if (!refWords.includes(word)) {
            count++;
          }
        });
        break;
      case 'substitution':
        count = 0;
        break;
      default:
        break;
    } 

    return count
  };
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
