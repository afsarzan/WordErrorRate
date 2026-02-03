import { useState } from 'react'
import './App.css'

function App() {
  const [ref, setRef] = useState<string>('');
  const [hyp, setHyp] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  
  const calculateWer = () => {
    const refWords = ref.trim().split(' ')
    console.log('%c [ refWords ]-11', 'font-size:13px; background:pink; color:#bf2c9f;', refWords)
    const hypWords = hyp.trim().split(' ')
    console.log('%c [ hypWords ]-12', 'font-size:13px; background:pink; color:#bf2c9f;', hypWords)
    
    let substitution  = 0;
    let deletion = 0;
    let insertion = 0;
    const totalWords = refWords.length;

    deletion = findOperation('deletion',refWords, hypWords);
    insertion = findOperation('insertion',refWords, hypWords);
    substitution = findOperation('substitution',refWords, hypWords);

    const werResult = (substitution + deletion + insertion)/ totalWords
   setResult(werResult);
  }

  const findOperation = (operationType: string, refWords: string[], hypWords: string[]) => {
    let count = 0;
    
    switch(operationType) {
      case 'deletion':
        // check if all words of hypothesis are in reference
        hypWords.forEach((word) => {
          if (!refWords.includes(word)) {
            count++;
          }
        });        
        break;
      case 'insertion':
        count = 0
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
