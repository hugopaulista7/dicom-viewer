import { Dropzone } from './components/Dropzone';
import { ProgressBar } from './components/ProgressBar';
import { FrameGrid } from './components/FrameGrid';
import { useDicomProcessor } from './hooks/useDicomProcessor';

export default function App() {
  const { status, progress, frames, error, processFile } = useDicomProcessor();

  return (
    <div className="min-h-screen bg-gray-100">
      <ProgressBar visible={status === 'processing'} progress={progress} />
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">DICOM Viewer</h1>
          <p className="text-gray-500 mt-1">Upload a DICOM file to view its frames</p>
        </header>

        <Dropzone onFile={processFile} />

        {status === 'error' && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {status === 'done' && frames.length > 0 && <FrameGrid frames={frames} />}
      </div>
    </div>
  );
}
