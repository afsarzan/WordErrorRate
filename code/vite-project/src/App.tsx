import { useState, useEffect } from "react";


interface AlignmentStep {
  ref: string;
  hyp: string;
  op: "M" | "S" | "D" | "I";
}

const StatusLegend = () => {
  return (
    <div className="legend-container">
      <h3>Status Key</h3>
      <div className="legend-grid">
        <div className="legend-item">
          <div className="status-box match">M</div>
          <div>
            <strong>Match</strong>
            <p>Words are identical. (Cost: 0)</p>
          </div>
        </div>
        
        <div className="legend-item">
          <div className="status-box sub">S</div>
          <div>
            <strong>Substitution</strong>
            <p>Word replaced by another. (Cost: 1)</p>
          </div>
        </div>

        <div className="legend-item">
          <div className="status-box del">D</div>
          <div>
            <strong>Deletion</strong>
            <p>Word removed from Reference. (Cost: 1)</p>
          </div>
        </div>

        <div className="legend-item">
          <div className="status-box ins">I</div>
          <div>
            <strong>Insertion</strong>
            <p>Extra word added to Hypothesis. (Cost: 1)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  
  const [ref, setRef] = useState<string>("I like green eggs");
  const [hyp, setHyp] = useState<string>("I like eggs");
  
  
  const [alignments, setAlignments] = useState<AlignmentStep[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  

  const [activeMatrix, setActiveMatrix] = useState<number[][]>([]);
  const [currentCoord, setCurrentCoord] = useState<{ i: number; j: number } | null>(null);

  
  const startCalculation = () => {
    const referenceWords = ref.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hWords = hyp.trim().toLowerCase().split(/\s+/).filter(Boolean);

    if (referenceWords.length === 0) {
      alert("Please enter a reference sentence.");
      return;
    }

    const rows = referenceWords.length + 1;
    const cols = hWords.length + 1;
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

    
    for (let i = 0; i <= referenceWords.length; i++) dp[i][0] = i;
    for (let j = 0; j <= hWords.length; j++) dp[0][j] = j;
    
    for (let i = 1; i <= referenceWords.length; i++) {
      for (let j = 1; j <= hWords.length; j++) {
        if (referenceWords[i - 1] === hWords[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1, // Substitution
            dp[i - 1][j] + 1,     // Deletion
            dp[i][j - 1] + 1      // Insertion
          );
        }
      }
    }

    // Prepare for Animation
    setAlignments([]);
    setActiveMatrix(dp);
    setCurrentCoord({ i: referenceWords.length, j: hWords.length });
    setIsPaused(false);
    setIsAnimating(true); 
    setResult(null);
    // Final WER Score
    const editDistance = dp[referenceWords.length][hWords.length];
    setResult((editDistance / referenceWords.length).toFixed(2));
  };


  useEffect(() => {
    if (isPaused || !currentCoord || activeMatrix.length === 0) return;

    const timer = setTimeout(() => {
      const { i, j } = currentCoord;

     if (i === 0 && j === 0) {
      // --- ANIMATION FINISHED ---
      const referenceWords = ref.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const editDistance = activeMatrix[referenceWords.length][activeMatrix[0].length - 1];
      
      setResult((editDistance / referenceWords.length).toFixed(2));
      setIsAnimating(false);
      setCurrentCoord(null);
      return;
    }

      const referenceWords = ref.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const hWords = hyp.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let nextI = i;
      let nextJ = j;
      let step: AlignmentStep | null = null;

      // Check Diagonal (Match or Substitution)
      if (i > 0 && j > 0) {
        const cost = referenceWords[i - 1] === hWords[j - 1] ? 0 : 1;
        if (activeMatrix[i][j] === activeMatrix[i - 1][j - 1] + cost) {
          step = { ref: referenceWords[i - 1], hyp: hWords[j - 1], op: cost === 0 ? "M" : "S" };
          nextI = i - 1; nextJ = j - 1;
        }
      }

      // Check Up (Deletion)
      if (!step && i > 0 && activeMatrix[i][j] === activeMatrix[i - 1][j] + 1) {
        step = { ref: referenceWords[i - 1], hyp: "—", op: "D" };
        nextI = i - 1;
      }

      // Check Left (Insertion)
      if (!step && j > 0 && activeMatrix[i][j] === activeMatrix[i][j - 1] + 1) {
        step = { ref: "—", hyp: hWords[j - 1], op: "I" };
        nextJ = j - 1;
      }

      if (step) {
        setAlignments((prev) => [step!, ...prev]);
        setCurrentCoord({ i: nextI, j: nextJ });
      }
    }, 800); // Speed of animation

    return () => clearTimeout(timer);
  }, [currentCoord, isPaused, activeMatrix, ref, hyp]);



  return (
    <div className="wer-container">
      <h1>Word Error Rate Animator</h1>

      <div className="wer-layout">
        <section className="info-card" aria-labelledby="wer-info-title">
          <div className="info-header">
            <h2 id="wer-info-title">Word Error Rate (WER)</h2>
            <div className="info-source">Rev +4</div>
          </div>
          <p>
            Word Error Rate (WER) is the standard metric for evaluating the accuracy
            of speech-to-text (STT) and automatic speech recognition (ASR) systems,
            measuring the percentage of incorrect words compared to a reference
            transcript. It calculates the sum of substitutions, deletions, and
            insertions divided by the total number of words, with lower scores
            indicating higher accuracy.
          </p>
          <div className="info-grid">
            <div className="info-block">
              <h3>Key Aspects of Word Error Rate (WER)</h3>
              <div className="info-formula">
                Formula: <code>WER = (S + D + I) / N</code>
              </div>
              <dl className="info-list">
                <dt>S (Substitutions)</dt>
                <dd>Wrong words.</dd>
                <dt>D (Deletions)</dt>
                <dd>Missing words.</dd>
                <dt>I (Insertions)</dt>
                <dd>Extra words.</dd>
                <dt>N</dt>
                <dd>Total number of words in the reference (correct) text.</dd>
              </dl>
            </div>
            <div className="info-block">
              <h3>Interpretation</h3>
              <p>
                A 0% WER indicates perfect transcription, while a 10% WER means
                90% of words are correct.
              </p>
              <h3>Performance Benchmarks</h3>
              <p>
                Generally, a WER below 10% is considered excellent, while 10-20%
                is considered good.
              </p>
              <h3>Limitations</h3>
              <p>
                WER can exceed 100% if the number of errors exceeds the total
                number of words in the original text. It does not account for the
                semantic importance of words, meaning a high WER might not always
                render a transcript unusable.
              </p>
              <h3>Influencing Factors</h3>
              <p>
                High acoustic variability, such as background noise or low-quality
                microphones, increases WER.
              </p>
            </div>
          </div>
        </section>

        <div className="wer-workspace">
          <div className="input-section">
            <div className="input-group">
              <label>Reference (Truth)</label>
              <input value={ref} onChange={(e) => setRef(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Hypothesis (Output)</label>
              <input value={hyp} onChange={(e) => setHyp(e.target.value)} />
            </div>
          </div>

          <div className="button-group">
            <button className="btn-primary" onClick={startCalculation}>Compute & Animate</button>
            <button className="btn-secondary" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button className="btn-outline" onClick={() => window.location.reload()}>Reset</button>
          </div>

          <div className="alignment-grid">
            {alignments.map((item, idx) => (
              <div key={idx} className="alignment-column slide-in">
                <div className={`word ${item.op === 'D' ? 'red badge-box' : item.op === 'S' ? 'orange badge-box' : 'match badge-box'}`}>
                  {item.ref} {item.op === 'D' && <span className="badge">D</span>}
                  {item.op === 'S' && <span className="badge">S</span>}
                </div>
                <div className="divider"></div>
                <div className={`word ${item.op === 'I' ? 'add badge-box' : item.op === 'S' ? 'orange badge-box' : 'match badge-box'}`}>
                  {item.hyp} {item.op === 'I' && <span className="badge">I</span>}
                </div>
              </div>
            ))}
          </div>

          {result && !isAnimating && (
            <>
            <div className="result-card slide-in">
              <p><strong>Final WER:</strong> {result}</p>         
            </div>
            <StatusLegend />
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default App;