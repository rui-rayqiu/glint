function diffWords(oldText, newText) {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  const matrix = Array(oldWords.length + 1).fill(null)
    .map(() => Array(newWords.length + 1).fill(0));

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const result = [];
  let i = oldWords.length, j = newWords.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({ type: 'same', text: oldWords[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      result.unshift({ type: 'add', text: newWords[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'remove', text: oldWords[i - 1] });
      i--;
    }
  }

  return result;
}

export default function Diff({ original, polished }) {
  const parts = diffWords(original, polished);

  return (
    <div className="text-xl leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.type === 'same') {
          return <span key={i} className="text-gray-100">{part.text}</span>;
        }
        if (part.type === 'add') {
          return <span key={i} className="text-emerald-300 bg-emerald-500/15 rounded px-0.5">{part.text}</span>;
        }
        if (part.type === 'remove') {
          return <span key={i} className="text-red-400/70 bg-red-500/10 rounded px-0.5 line-through">{part.text}</span>;
        }
      })}
    </div>
  );
}
