import React, { useState, useMemo, useRef, useCallback } from 'react';
import { PlaneTakeoff, Thermometer, ChevronDown, Delete, Calculator, XCircle, ChevronUp, Sun, Moon } from 'lucide-react';

const STANDARD_ISA_TEMP_C = 15;
const ISA_LAPSE_RATE_C_PER_FT = 0.00198;
const M_TO_FT = 3.28084;

const convertAltitude = (value, fromUnit, toUnit) => {
  const num = parseFloat(String(value).trim());
  if (isNaN(num) || value.trim() === '' || value.trim() === '-') return value;
  if (fromUnit === toUnit) return value;
  return fromUnit === 'ft' && toUnit === 'm'
    ? (num / M_TO_FT).toFixed(1).toString()
    : (num * M_TO_FT).toFixed(0).toString();
};

// Keypad component is REMOVED as requested

const InputField = ({ id, label, unit, value, setValue, icon: Icon, setFocusedInput, isRequired = true, darkMode }) => {
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  React.useEffect(() => setLocalValue(value), [value]);

  const handleChange = (e) => {
    let filteredValue = e.target.value.replace(/,/g, '.');
    filteredValue = filteredValue.replace(/[^0-9\.\+\-]/g, '');
    setLocalValue(filteredValue);
  };
  
  const handleBlur = () => {
    setValue(localValue);
    setIsFocused(false);
    setFocusedInput(''); // Clear focus on blur
  };

  const handleFocus = () => {
    setFocusedInput(id);
    setIsFocused(true);
  }
  
  const handleContainerClick = () => ref.current?.focus();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minWidth: '150px',
    cursor: 'text',
  };

  const labelStyle = {
    fontSize: '0.75rem', // text-xs
    fontWeight: '600', // font-semibold
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.25rem', // mb-1
    color: darkMode ? '#9CA3AF' : '#6B7280', // text-gray-400 / text-gray-500
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '3rem', // h-12
    border: `1px solid ${darkMode ? '#4B5563' : '#D1D5DB'}`, // border-gray-600 / border-gray-300
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)', // shadow-inner
    transition: 'all 150ms ease-in-out',
    backgroundColor: darkMode ? '#374151' : '#FFFFFF', // bg-gray-700 / bg-white
    ...(isFocused && {
      borderColor: '#3B82F6', // border-blue-500
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)', // ring-2 ring-blue-500/50
    }),
  };

  const inputStyle = {
    flex: '1',
    padding: '0.5rem 0.75rem', // py-2 pl-3
    paddingRight: '2.5rem', // pr-10
    fontSize: '1rem', // text-base
    fontFamily: 'monospace', // font-mono
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    borderRadius: '0.5rem',
    color: darkMode ? '#FFFFFF' : '#111827', // text-white / text-gray-900
  };

  const unitStyle = {
    position: 'absolute',
    right: '0.75rem', // right-3
    fontSize: '0.875rem', // text-sm
    pointerEvents: 'none',
    color: darkMode ? '#9CA3AF' : '#9CA3AF', // text-gray-400
  };

  return (
    <div style={containerStyle} onClick={handleContainerClick}>
      <label htmlFor={id} style={labelStyle}>
        {Icon && <Icon style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }}/>}{label}{isRequired && <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>*</span>}
      </label>
      <div style={inputContainerStyle}>
        <input
          id={id}
          ref={ref}
          type="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={inputStyle}
          placeholder="0"
          autoComplete="off"
        />
        <span style={unitStyle}>{unit}</span>
      </div>
    </div>
  );
};

const AltInputField = ({ index, value, unitLabel, qnhAlts, setQnhAlts, setFocusedInput, darkMode }) => {
  const id = `alt${index}`;
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  React.useEffect(() => setLocalValue(value), [value]);

  const handleChange = (e) => {
    let filteredValue = e.target.value.replace(/,/g, '.');
    filteredValue = filteredValue.replace(/[^0-9\.\+\-]/g, '');
    setLocalValue(filteredValue);
  };
  
  const handleBlur = () => {
    const newAlts = [...qnhAlts];
    newAlts[index] = localValue;
    setQnhAlts(newAlts);
    setIsFocused(false);
    setFocusedInput(''); // Clear focus on blur
  };

  const handleFocus = () => {
    setFocusedInput(id);
    setIsFocused(true);
  }

  const handleContainerClick = () => ref.current?.focus();
  
  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${darkMode ? '#4B5563' : '#D1D5DB'}`, // border-gray-600 / border-gray-300
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)', // shadow-inner
    height: '3rem', // h-12
    transition: 'all 150ms ease-in-out',
    backgroundColor: darkMode ? '#374151' : '#FFFFFF', // bg-gray-700 / bg-white
    cursor: 'text',
    ...(isFocused && {
      borderColor: '#3B82F6', // border-blue-500
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)', // ring-2 ring-blue-500/50
    }),
  };

  const inputStyle = {
    flex: '1',
    padding: '0.5rem 0.75rem', // py-2 pl-3
    paddingRight: '2.5rem', // pr-10
    fontSize: '1rem', // text-base
    fontFamily: 'monospace', // font-mono
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    borderRadius: '0.5rem',
    color: darkMode ? '#FFFFFF' : '#111827', // text-white / text-gray-900
  };

  const unitStyle = {
    position: 'absolute',
    right: '0.75rem', // right-3
    fontSize: '0.875rem', // text-sm
    pointerEvents: 'none',
    color: darkMode ? '#9CA3AF' : '#9CA3AF', // text-gray-400
  };

  return (
    <div style={inputContainerStyle} onClick={handleContainerClick}>
      <input
        id={id}
        ref={ref}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={inputStyle}
        placeholder="0"
        autoComplete="off"
      />
      <span style={unitStyle}>{unitLabel}</span>
    </div>
  );
};

const AltResultRow = ({publValue,corrValue,altPrecision,darkMode})=>{
  const rowStyle = {
    display: 'flex',
    width: '100%',
    color: darkMode ? '#D1D5DB' : '#111827', // text-gray-300 / text-gray-900
    borderBottom: `1px solid ${darkMode ? '#374151' : '#F3F4F6'}`, // border-gray-700 / border-gray-100
  };
  
  const publishedStyle = {
    flex: '1',
    padding: '0.75rem', // p-3
    fontFamily: 'monospace',
  };

  const correctedStyle = {
    flex: '1',
    padding: '0.75rem',
    textAlign: 'right',
    fontFamily: 'monospace',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: darkMode ? 'rgba(30, 64, 175, 0.4)' : 'rgba(239, 246, 255, 0.7)', // bg-blue-900/40 / bg-blue-50/70
  };
  
  return(
    <div style={rowStyle}>
      <div style={publishedStyle}>
        {isFinite(publValue) ? publValue.toFixed(altPrecision) : '--'}
      </div>
      
      <div style={correctedStyle}>
        <span style={{ fontWeight: '800', fontSize: '1rem' }}> {/* font-extrabold text-base */}
          {isFinite(corrValue) ? corrValue.toFixed(altPrecision) : '--'}
        </span>
      </div>
    </div>
  );
};

const App = () => {
  const initialAlts = Array.from({length:9},()=>'');

  const [unit, setUnit] = useState('ft');
  const [thrElev, setThrElev] = useState('');
  const [oat, setOat] = useState('');
  const [fpa, setFpa] = useState('');
  const [ga, setGa] = useState('');
  const [qnhAlts, setQnhAlts] = useState(initialAlts);
  const [isCalculated, setIsCalculated] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Note: Tab handling is no longer possible without the Keypad or a defined list of focusable elements
  // The original allInputIds array is still here but only used for calculation/reset context.
  const allInputIds = useMemo(()=>['thrElev','oat','fpa','ga',...Array.from({length:9},(_,i)=>`alt${i}`)],[]);

  const handleUnitToggle = useCallback(()=>{
    setUnit(prev=>{
      const newUnit = prev==='ft'?'m':'ft';
      setThrElev(v=>convertAltitude(v,prev,newUnit));
      setQnhAlts(alts=>alts.map(v=>convertAltitude(v,prev,newUnit)));
      setIsCalculated(false);
      setError('');
      return newUnit;
    });
  },[]);

  const handleClearAll = useCallback(()=>{
    setThrElev(''); setOat(''); setFpa(''); setGa(''); setQnhAlts(initialAlts);
    setIsCalculated(false); setError('');
  },[initialAlts]);

  // Keypad-related functions removed: handleKeypadValueChange, handleEnterKeypad, handleTab

  const handleCalculate = useCallback(() => {
    // Blur any active element to ensure input values are committed via onBlur
    if (document.activeElement) {
        document.activeElement.blur(); 
    }
    setIsCalculated(true);
  }, []); // Depend on nothing if we rely on blur


  const currentUnitLabel = unit==='ft'?'ft':'m';
  const altPrecision = unit==='ft'?0:1; 

  const parsedAlts = useMemo(()=>qnhAlts.map(s=>parseFloat(s.trim())).filter(n=>!isNaN(n)&&n>0),[qnhAlts]);

  const calculationResult = useMemo(()=>{
    // Re-run calculation only if explicitly requested, otherwise use memoized result
    // This check is mainly for the initial render, the dependency array handles updates.
    if (!isCalculated) return null; 
    
    setError('');
    const safeThr = parseFloat(String(thrElev).trim());
    const safeOat = parseFloat(String(oat).trim());
    const safeFpa = parseFloat(String(fpa).trim())||0;
    const safeGa = parseFloat(String(ga).trim())||0;

    if(isNaN(safeThr)||String(thrElev).trim()===''){setError("Threshold Elevation is mandatory"); return null;}
    if(isNaN(safeOat)||String(oat).trim()===''){setError("OAT is mandatory"); return null;}

    // 1. Normalize inputs to FEET for calculation
    const thrFt = unit==='m'?safeThr*M_TO_FT:safeThr;
    const altsFt = parsedAlts.map(a=>unit==='m'?a*M_TO_FT:a);
    
    if(altsFt.some(a=>a<=thrFt)){setError("QNH Altitudes must be higher than Threshold"); return null;}

    // 2. ICAO ACCURATE METHOD CALCULATION
    
    // Step A: Calculate Temperature at Mean Sea Level (t0) based on airport OAT
    // t0 = t_aerodrome + (L0 * h_aerodrome)
    const t0 = safeOat + (ISA_LAPSE_RATE_C_PER_FT * thrFt);

    const altCorrections = altsFt.map(pubFt=>{
      // Step B: Calculate Height Above Altimeter Setting Source (Airport)
      const heightAboveAirport = pubFt - thrFt;
      
      // Step C: Apply ICAO Formula
      // Correction = (H * (15 - t0)) / (273 + t0 - 0.5 * L0 * (Published_Alt))
      // Note: The denominator term (H + H0) in the formula is equal to Published Altitude
      
      const numerator = heightAboveAirport * (15 - t0);
      const denominator = 273 + t0 - (0.5 * ISA_LAPSE_RATE_C_PER_FT * pubFt);
      
      const correctionFtRaw = denominator !== 0 ? numerator / denominator : 0;
      
      // Step D: ICAO Rounding Rule
      // "The calculated correction must be rounded up to the next 10 ft increment"
      const correctionFtRounded = Math.ceil(correctionFtRaw / 10) * 10;
      
      const finalAltFt = pubFt + correctionFtRounded;
      
      // Return values in correct unit
      if (unit === 'ft') {
        return {
          publishedAlt: pubFt,
          correctedAlt: finalAltFt
        };
      } else {
        return {
          publishedAlt: pubFt / M_TO_FT,
          correctedAlt: finalAltFt / M_TO_FT
        };
      }
    }).sort((a,b)=>b.publishedAlt-a.publishedAlt);

    // 3. FPA and Gradient Calculations
    
    // Standard ISA temp at Airport Elevation
    const isaTempAtThr = STANDARD_ISA_TEMP_C - (thrFt * ISA_LAPSE_RATE_C_PER_FT);
    
    // Temp Ratio (Kelvin)
    const tempRatio = (isaTempAtThr + 273.15) / (safeOat + 273.15);
    
    const fpaCorr = Math.atan(Math.tan(safeFpa*Math.PI/180) * tempRatio) * (180/Math.PI);
    const gaCorr = safeGa * tempRatio;

    return {isaTemp: isaTempAtThr, corrFactor: tempRatio, altCorrections, corrFpa:fpaCorr, corrGa:gaCorr};
  },[thrElev,oat,fpa,ga,parsedAlts,unit,isCalculated]); // Added isCalculated to dependency array

  // --- STYLING OBJECTS (Replaced Tailwind Classes) ---

  const appStyle = {
    minHeight: '100vh',
    padding: '1rem', // p-4
    '@media (min-width: 640px)': { padding: '2rem' }, // sm:p-8
    fontFamily: 'sans-serif',
    transition: 'background-color 300ms, color 300ms',
    backgroundColor: darkMode ? '#111827' : '#F9FAFB', // bg-gray-900 / bg-gray-50
    color: darkMode ? '#FFFFFF' : '#111827', // text-white / text-gray-900
  };

  const cardStyle = {
    maxWidth: '56rem', // max-w-4xl
    margin: '0 auto', // mx-auto
    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', // bg-gray-800 / bg-white
    boxShadow: darkMode ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-2xl / shadow-xl
    borderRadius: '1rem', // rounded-2xl
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1fr',
    '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, // lg:grid-cols-2
  };

  const inputSectionStyle = {
    padding: '1.5rem', // p-6
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem', // space-y-6
    '@media (min-width: 1024px)': {
      borderRight: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`, // lg:border-r / border-gray-700 / border-gray-200
    },
  };

  const resultSectionStyle = {
    padding: '1.5rem', // p-6
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)', // bg-gray-800/50 / bg-gray-100/50
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.5rem', // pb-2
    borderBottom: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`, // border-b / border-gray-700 / border-gray-200
    flexShrink: 0,
  };

  const h1Style = {
    fontSize: '1.25rem', // text-xl
    fontWeight: '800', // font-extrabold
    letterSpacing: '-0.025em', // tracking-tight
    color: darkMode ? '#FFFFFF' : '#1F2937', // text-white / text-gray-800
  };

  const h2Style = {
    fontSize: '1rem', // text-md
    fontWeight: '700', // font-bold
    color: darkMode ? '#E5E7EB' : '#374151', // text-gray-200 / text-gray-700
  };

  const inputGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem', // gap-4
    '@media (min-width: 1024px)': { maxWidth: '24rem' }, // lg:max-w-sm (approx)
  };
  
  const altGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem', // gap-3
  };

  const clearButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem', // space-x-1
    padding: '0.375rem 0.75rem', // px-3 py-1.5
    backgroundColor: '#DC2626', // bg-red-600
    color: '#FFFFFF', // text-white
    fontSize: '0.875rem', // text-sm
    fontWeight: '600', // font-semibold
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', // shadow-md
    cursor: 'pointer',
    border: 'none',
  };
  
  const disclaimerStyle = {
    textAlign: 'center',
    color: '#DC2626', // text-red-600
    fontWeight: '800', // font-extrabold
    marginTop: '1.5rem', // mt-6
  };
  
  const calculateButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#10B981', // bg-green-500
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    transition: 'background-color 150ms',
  };

  const DarkModeToggle = ({darkMode, setDarkMode}) => (
    <button 
      onClick={() => setDarkMode(prev => !prev)}  
      style={{
        padding: '0.375rem', // p-1.5
        borderRadius: '9999px', // rounded-full
        transition: 'all 200ms',
        backgroundColor: darkMode ? '#374151' : '#E5E7EB', // bg-gray-700 / bg-gray-200
        color: darkMode ? '#FCD34D' : '#374151', // text-yellow-300 / text-gray-700
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <Sun style={{ width: '1.25rem', height: '1.25rem' }}/> : <Moon style={{ width: '1.25rem', height: '1.25rem' }}/>}
    </button>
  );

  const UnitToggle = ({ currentUnit, onToggle, darkMode }) => {
    const activeClasses = {
      backgroundColor: '#2563EB', // bg-blue-600
      color: '#FFFFFF', // text-white
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', // shadow-md
    };
    const inactiveClasses = {
      color: darkMode ? '#9CA3AF' : '#4B5563', // text-gray-400 / text-gray-600
      backgroundColor: 'transparent',
    };
    const containerStyle = {
      display: 'flex',
      padding: '0.125rem', // p-0.5
      borderRadius: '9999px', // rounded-full
      backgroundColor: darkMode ? '#374151' : '#E5E7EB', // bg-gray-700 / bg-gray-200
      transition: 'all 200ms',
    };
    const buttonBaseStyle = {
      padding: '0.375rem 0.75rem', // px-3 py-1.5
      fontSize: '0.875rem', // text-sm
      fontWeight: '600', // font-semibold
      borderRadius: '9999px', // rounded-full
      transition: 'all 200ms',
      border: 'none',
      cursor: 'pointer',
    };

    return (
      <div style={containerStyle}>
        <button
          onClick={currentUnit === 'm' ? onToggle : undefined}
          style={{ ...buttonBaseStyle, ...(currentUnit === 'ft' ? activeClasses : inactiveClasses) }}
          aria-pressed={currentUnit === 'ft'}
        >
          ft
        </button>
        <button
          onClick={currentUnit === 'ft' ? onToggle : undefined}
          style={{ ...buttonBaseStyle, ...(currentUnit === 'm' ? activeClasses : inactiveClasses) }}
          aria-pressed={currentUnit === 'm'}
        >
          m
        </button>
      </div>
    );
  };

  const AngleSummaryBox = ({ label, input, corrected, unit, darkMode }) => {
    const summaryBoxClasses = {
      padding: '1rem', // p-4
      borderRadius: '0.75rem', // rounded-xl
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow
      border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`, // border
      backgroundColor: darkMode ? '#374151' : '#FFFFFF', // bg-gray-700 / bg-white
    };

    const labelTextStyle = {
      fontSize: '0.75rem', // text-xs
      fontWeight: '600', // font-semibold
      color: darkMode ? '#9CA3AF' : '#6B7280', // text-gray-400 / text-gray-500
      marginBottom: '0.25rem', // mb-1
    };

    const correctedValueStyle = {
      fontWeight: '800', // font-extrabold
      fontSize: '1.25rem', // text-xl
      fontFamily: 'monospace', // font-mono
      color: darkMode ? '#FFFFFF' : '#111827', // text-white / text-gray-900
    };

    const inputTextStyle = {
      fontSize: '0.75rem', // text-xs
      fontWeight: '600', // font-semibold
      color: darkMode ? '#9CA3AF' : '#6B7280', // text-gray-400 / text-gray-500
      marginTop: '0.25rem', // mt-1
    };

    return (
      <div style={summaryBoxClasses}>
        <p style={labelTextStyle}>
          {label}
        </p>
        <p style={correctedValueStyle}>
          {corrected.toFixed(1)} {unit}
        </p>
        <p style={inputTextStyle}>
          (Input: {input} {unit})
        </p>
      </div>
    );
  };
  
  // Custom element to handle style merging for dynamic dark mode
  const DivWithMergedStyle = ({ baseStyle, dynamicStyle, children }) => {
    const mergedStyle = useMemo(() => ({ ...baseStyle, ...dynamicStyle }), [baseStyle, dynamicStyle]);
    return <div style={mergedStyle}>{children}</div>;
  };
  
  // Wrapper for result content to enable scrolling
  const resultContentWrapperStyle = {
    flex: 1, // flex-1
    overflowY: 'auto', // overflow-y-auto
    paddingTop: '1.5rem', // pt-6
  };
  
  const resultInnerContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  
  const resultSummaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem', // gap-4
    fontSize: '0.875rem', // text-sm
  };
  
  const summaryBoxClasses = {
    padding: '1rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
    backgroundColor: darkMode ? '#374151' : '#FFFFFF',
  };
  
  const labelTextClasses = {
    color: darkMode ? '#9CA3AF' : '#6B7280', // text-gray-400 / text-gray-500
  };
  
  const resultValueTextColor = {
    color: darkMode ? '#FFFFFF' : '#111827', // text-white / text-gray-900
  };
  
  const errorBoxStyle = {
    padding: '1rem', // p-4
    marginBottom: '1.5rem', // mb-6
    width: '100%',
    fontSize: '0.875rem', // text-sm
    color: '#991B1B', // text-red-800
    borderRadius: '0.5rem', // rounded-lg
    backgroundColor: '#FEF2F2', // bg-red-50
  };

  const angleGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: `1px dashed ${darkMode ? '#374151' : '#E5E7EB'}`,
    margin: '1rem 0', // my-4
  };
  
  const altResultTableStyle = {
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    overflow: 'hidden',
    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
    backgroundColor: darkMode ? '#374151' : '#FFFFFF',
    width: '100%', // w-full
  };

  const altResultHeaderStyle = {
    display: 'flex',
    width: '100%',
    fontWeight: '700', // font-bold
    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#E5E7EB', // bg-gray-900/50 / bg-gray-200
    color: darkMode ? '#FFFFFF' : '#4B5563', // text-white / text-gray-700
  };
  
  const altResultHeaderCellStyle = {
    flex: 1,
    padding: '0.75rem',
  };
  
  const altResultHeaderCellRightStyle = {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'right',
  };


  return (
    <div style={appStyle}>
      <DivWithMergedStyle baseStyle={cardStyle} dynamicStyle={{}}>
        <DivWithMergedStyle baseStyle={inputSectionStyle} dynamicStyle={{}}>
          <header style={headerStyle}>
            <h1 style={h1Style}>Input Data</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode}/>
              <UnitToggle currentUnit={unit} onToggle={handleUnitToggle} darkMode={darkMode}/>
              <button onClick={handleClearAll} style={clearButtonStyle}>
                <XCircle style={{ width: '1rem', height: '1rem' }}/>
                <span>Clear All</span>
              </button>
            </div>
          </header>

          <h2 style={h2Style}>Flight Parameters</h2>
          <DivWithMergedStyle baseStyle={inputGridStyle} dynamicStyle={{}}>
            <InputField id="thrElev" label="THR / AD Elev" unit={currentUnitLabel} value={thrElev} setValue={setThrElev} icon={PlaneTakeoff} setFocusedInput={setFocusedInput} darkMode={darkMode}/>
            <InputField id="oat" label="OAT" unit="°C" value={oat} setValue={setOat} icon={Thermometer} setFocusedInput={setFocusedInput} darkMode={darkMode}/>
            <InputField id="fpa" label="FPA" unit="°" value={fpa} setValue={setFpa} icon={ChevronDown} setFocusedInput={setFocusedInput} isRequired={false} darkMode={darkMode}/>
            <InputField id="ga" label="GA" unit="%" value={ga} setValue={setGa} icon={ChevronUp} setFocusedInput={setFocusedInput} isRequired={false} darkMode={darkMode}/>
          </DivWithMergedStyle>

          <h2 style={{ ...h2Style, paddingTop: '1rem', borderTop: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}` }}>QNH Altitudes</h2>
          <div style={altGridStyle}>
            {qnhAlts.map((alt,index)=>
              <AltInputField key={index} index={index} value={alt} unitLabel={currentUnitLabel} qnhAlts={qnhAlts} setQnhAlts={setQnhAlts} setFocusedInput={setFocusedInput} darkMode={darkMode}/>
            )}
          </div>
          
          <button onClick={handleCalculate} style={calculateButtonStyle}>
             <Calculator style={{ width: '1.5rem', height: '1.5rem' }}/>
             <span>Calculate Corrections</span>
          </button>

          <p style={disclaimerStyle}>For Flight Simulation only!</p>
        </DivWithMergedStyle>

        <div style={resultSectionStyle}>
          <header style={{ ...headerStyle, textAlign: 'center' }}>
            <h1 style={h1Style}>Correction Results</h1>
          </header>
            
          <div style={resultContentWrapperStyle}> 
            <div style={resultInnerContentStyle}>
              {isCalculated && error && <div style={errorBoxStyle}>{error}</div>}
                
              {isCalculated && calculationResult && (
                <div style={{ width: '100%', gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  
                  <DivWithMergedStyle baseStyle={resultSummaryGridStyle} dynamicStyle={{}}>
                    <DivWithMergedStyle baseStyle={summaryBoxClasses} dynamicStyle={{}}>
                      <p style={{ ...labelTextClasses, marginBottom: '0.25rem' }}>THR/AD Elev:</p>
                      <p style={{ ...resultValueTextColor, fontWeight: '700', fontSize: '1.125rem', fontFamily: 'monospace' }}>{(parseFloat(String(thrElev))||0).toFixed(altPrecision)} {currentUnitLabel}</p>
                    </DivWithMergedStyle>
                    <DivWithMergedStyle baseStyle={summaryBoxClasses} dynamicStyle={{}}>
                      <p style={{ ...labelTextClasses, marginBottom: '0.25rem' }}>OAT:</p>
                      <p style={{ ...resultValueTextColor, fontWeight: '700', fontSize: '1.125rem', fontFamily: 'monospace' }}>{(parseFloat(String(oat))||0).toFixed(0)} °C</p>
                    </DivWithMergedStyle>
                  </DivWithMergedStyle>

                  <DivWithMergedStyle baseStyle={angleGridStyle} dynamicStyle={{}}>
                    <AngleSummaryBox  
                      label="Corrected FPA" 
                      input={fpa||0}  
                      corrected={calculationResult.corrFpa} 
                      unit="°"  
                      darkMode={darkMode}
                    />
                    <AngleSummaryBox  
                      label="Corrected GA"  
                      input={ga||0} 
                      corrected={calculationResult.corrGa}  
                      unit="%"  
                      darkMode={darkMode}
                    />
                  </DivWithMergedStyle>

                  <DivWithMergedStyle baseStyle={altResultTableStyle} dynamicStyle={{}}>
                    <div style={altResultHeaderStyle}>
                      <div style={altResultHeaderCellStyle}>Publ. Alt. ({currentUnitLabel})</div> 
                      <div style={altResultHeaderCellRightStyle}>Corrected Alt. ({currentUnitLabel})</div>
                    </div>
                    {calculationResult.altCorrections.length > 0 ? (
                      calculationResult.altCorrections.map((row,i)=>(
                          <AltResultRow 
                            key={i} 
                            publValue={row.publishedAlt}
                            corrValue={row.correctedAlt} 
                            altPrecision={altPrecision}
                            darkMode={darkMode}
                          />
                      ))
                    ) : (
                      <div style={{ display: 'flex', width: '100%', color: darkMode ? '#6B7280' : '#9CA3AF', borderBottom: `1px solid ${darkMode ? '#374151' : '#F3F4F6'}` }}>
                          <div style={{ flex: 1, padding: '0.75rem', fontFamily: 'monospace' }}>--</div>
                          <div style={{ flex: 1, padding: '0.75rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(243, 244, 246, 0.7)' }}>Enter Altitudes</div>  
                      </div>
                    )}
                  </DivWithMergedStyle>
                </div>
              )}
            </div>
          </div>
        </div>
      </DivWithMergedStyle>
    </div>
  );
};

export default App;