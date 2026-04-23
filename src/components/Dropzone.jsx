import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export function Dropzone({ onFile }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles[0]) onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dicom': ['.dcm'],
      'application/octet-stream': ['.dcm'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 scale-[1.01]'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud
        className={`w-12 h-12 transition-colors ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
      />
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? 'Release to upload' : 'Drop a DICOM file here'}
        </p>
        <p className="text-sm text-gray-400 mt-1">or click to browse — .dcm files supported</p>
      </div>
    </div>
  );
}
