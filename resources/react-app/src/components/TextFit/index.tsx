import { observer } from 'mobx-react-lite';
import joinClassNames from 'tools/class-names';

const TextFit: React.FC<{ text: string }> = observer(({ text }) => {
  const length = text.length;
  const fontSize = 100 - 14 * length;
  return (
    <svg
      className={joinClassNames('fill-current text-indigo-600', {
        'text-green-500': text === 'new',
      })}
      viewBox={`0 0 100 100`}
    >
      {text === 'new' ? (
        [
          <text
            key="+"
            x="50"
            y="30"
            style={{
              fontSize: 80,
              dominantBaseline: 'central',
              textAnchor: 'middle',
            }}
          >
            +
          </text>,
          <text
            key="new"
            x="50"
            y="80"
            style={{
              fontSize: 20,
              dominantBaseline: 'central',
              textAnchor: 'middle',
            }}
          >
            Nouveau
          </text>,
        ]
      ) : (
        <text
          key={text}
          x="50"
          y="50"
          style={{
            fontSize: fontSize,
            dominantBaseline: 'central',
            textAnchor: 'middle',
          }}
        >
          {text}
        </text>
      )}
    </svg>
  );
});

export default TextFit;
