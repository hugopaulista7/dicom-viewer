import { useEffect, useRef } from 'react';
import { CloudDownload } from 'lucide-react';

function downloadCanvas(canvas, frameIndex) {
  const url = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `frame-${frameIndex + 1}.png`;
  anchor.click();
}

export function DicomFrame({ imageData, frameIndex }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    canvasRef.current.getContext('2d').putImageData(imageData, 0, 0);
  }, [imageData]);

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black shadow-sm">
      <canvas
        ref={canvasRef}
        width={imageData.width}
        height={imageData.height}
        className="w-full h-auto block"
      />
      <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => downloadCanvas(canvasRef.current, frameIndex)}
          className="bg-white/85 hover:bg-white text-gray-700 rounded-xl p-2 backdrop-blur-sm transition-colors duration-150 cursor-pointer"
          title={`Download frame ${frameIndex + 1} as PNG`}
        >
          <CloudDownload className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
