
## Word Error Rate

Word error rate (WER) is a common metric of the performance of a speech recognition or machine translation system. The WER metric typically ranges from 0 to 1, where 0 indicates that the compared pieces of text are exactly identical, and 1 (or larger) indicates that they are completely different with no similarity. This way, a WER of 0.8 means that there is an 80% error rate for compared sentences.

The general difficulty of measuring performance lies in the fact that the recognized word sequence can have a different length from the reference word sequence (supposedly the correct one). The WER is derived from the Levenshtein distance, working at the word level instead of the phoneme level. The WER is a valuable tool for comparing different systems as well as for evaluating improvements within one system. This kind of measurement, however, provides no details on the nature of translation errors and further work is therefore required to identify the main source(s) of error and to focus any research effort.

This problem is solved by first aligning the recognized word sequence with the reference (spoken) word sequence using dynamic string alignment. Examination of this issue is seen through a theory called the power law that states the correlation between perplexity and word error rate.[1]

Word error rate can then be computed as:

{\displaystyle {\mathit {WER}}={\frac {S+D+I}{N}}={\frac {S+D+I}{S+D+C}}}
where

S is the number of substitutions,
D is the number of deletions,
I is the number of insertions,
C is the number of correct words,
N is the number of words in the reference (N=S+D+C)


Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

Ensure you have the following installed:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (comes with Node.js)
