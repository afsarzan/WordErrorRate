import { useState } from "react";
import "./App.css";

function App() {
  const [ref, setRef] = useState<string>("");
  const [hyp, setHyp] = useState<string>("");
  const [refWords,setRefWords] = useState<string[]>([]);
  const [hypWords,setHypWords] = useState<string[]>([]);
  const [result, setResult] = useState<float | null>(null);

  const calculateWer = () => {
    setRefWords(ref.trim().split(" ").map( word => word.toLowerCase()));

    setHypWords(hyp.trim().split(" ").map( word => word.toLowerCase()));

    let substitution = 0;
    let deletion = 0;
    let insertion = 0;
    const totalWords = refWords.length;
    const result = [];
    deletion = findOperation("deletion", refWords, hypWords);
    // console.log({deletion}    );
    if(deletion) result.push(deletion);
    insertion = findOperation("insertion", refWords, hypWords);
    // console.log({insertion});
    if(insertion) result.push(insertion);
    substitution = findOperation("substitution", refWords, hypWords);
    // console.log({substitution} );
    if(substitution) result.push(substitution);
    

    // console.log('%c [ Math.min(substitution , deletion , insertion)  ]-39', 'font-size:13px; background:pink; color:#bf2c9f;', Math.min(...result) )
    const werResult = (Math.min(...result)/ totalWords).toFixed(2);
    // console.log(      {werResult} );
    setResult(werResult);
  };

  const findOperation = (
    operationType: string,
    refWords: string[],
    hypWords: string[],
  ) => {
    let count = 0;

    switch (operationType) {
      case "deletion": {
        let deleteWords = 0;
        refWords.forEach((word) => {
          if (!hypWords.includes(word)) deleteWords++;
        });
        count = deleteWords;
        break;
      }
      case "insertion": {
        const newWords = hypWords.length - refWords.length;
        count = newWords > 0 ? 0 : Math.abs(newWords);
        break;
      }
      case "substitution": {
        count = 0;        
        let substitutions = 0;        

        for (let i = 0; i < refWords.length; i++) {
          if (!(refWords[i] === hypWords[i])){
            substitutions++;            
          }
        }
        count = substitutions;
        break;
      }
      default:
        break;
    }

    return count;
  };

  const checkWordStatus = (word : string,type: string) => {
    if(type == 'ref'){
      if(!hypWords.includes(word)) {
        return (
        <>
          {word} <span className="icon red">D</span>
        </>
      );
      }
    }
    return word;
  }
  return (
    <>
      <div className="wer-container">
        <h1>Word Error Rate Calculator</h1>
        <div>
          <label htmlFor="reference">Reference</label>
          <input
            id="reference"
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="hypothesis">Hypothesis</label>
          <input
            id="hypothesis"
            type="text"
            value={hyp}
            onChange={(e) => setHyp(e.target.value)}
          />
        </div>
        <button onClick={calculateWer}>Compute WER</button>

        

        <div className="results-values">
          <div className="given-words">
            <div><strong>Reference words:</strong> </div>
             {refWords.map((word, index) => {
              const width = 75/ref.split(' ').length +'%';;
              return (
                    <div key={index} style={{ flexBasis: width }}>{checkWordStatus(word,'ref')} </div>
                  )                      
              })}
          </div>
           <div className="given-words">
            <div><strong>Hypothesis words:</strong> </div>
            {hypWords.map((word, index) => {
              const width = 75/ref.split(' ').length +'%';
              return (
                    <div key={index} style={{ flexBasis: width }}>{checkWordStatus(word,'hyp')} </div>
                  )                      
              })}
          </div>
        </div>
        <div className="result">
          <strong>Result: WER: {result}</strong>
        </div>
      </div>
    </>
  );
}

export default App;
