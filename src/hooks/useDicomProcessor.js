import { useState, useCallback } from 'react';
import { parseDicom } from '../services/dicomService';

const INITIAL_STATE = { status: 'idle', progress: 0, frames: [], error: null };

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function yieldToUI() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

export function useDicomProcessor() {
  const [state, setState] = useState(INITIAL_STATE);

  const processFile = useCallback(async (file) => {
    setState({ status: 'processing', progress: 10, frames: [], error: null });

    try {
      const arrayBuffer = await readFile(file);
      setState((s) => ({ ...s, progress: 40 }));
      await yieldToUI();

      const { frames } = parseDicom(arrayBuffer);
      setState((s) => ({ ...s, progress: 90 }));
      await yieldToUI();

      setState({ status: 'done', progress: 100, frames, error: null });
    } catch (err) {
      setState({
        status: 'error',
        progress: 0,
        frames: [],
        error: err.message || 'Failed to process DICOM file',
      });
    }
  }, []);

  return { ...state, processFile };
}
