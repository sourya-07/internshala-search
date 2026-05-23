import PropTypes from 'prop-types';
import { STIPEND_SLIDER } from '../../constants/filterOptions';

function formatMark(value) {
  return value === 0 ? '0' : `${value / 1000}K`;
}

// Minimum monthly stipend slider with the labelled ticks from the design.
function StipendSlider(props) {
  const { value, onChange } = props;
  const { min, max, step, marks } = STIPEND_SLIDER;

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Desired minimum monthly stipend"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary dark:bg-slate-600"
      />
      <div className="mt-2 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        {marks.map((mark) => (
          <span key={mark} className={value === mark ? 'font-semibold text-primary' : ''}>
            {formatMark(mark)}
          </span>
        ))}
      </div>
    </div>
  );
}

StipendSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StipendSlider;
