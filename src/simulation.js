import { useEffect, useState } from 'react';

export function useSimulation(stepCount) {
  const [step, setStep] = useState(-1);
  const [state, setState] = useState('idle');

  useEffect(() => {
    if (state !== 'running') return;
    const timer = setInterval(() => setStep(s => s + 1), 760);
    return () => clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (step >= stepCount) setState('complete');
  }, [step, stepCount]);

  return {
    step,
    state,
    run: () => { setStep(0); setState('running'); },
    reset: () => { setStep(-1); setState('idle'); },
  };
}
