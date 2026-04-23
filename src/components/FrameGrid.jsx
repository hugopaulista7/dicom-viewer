import { DicomFrame } from './DicomFrame';

export function FrameGrid({ frames }) {
  return (
    <section>
      <p className="text-sm text-gray-500 mb-3">{frames.length} frame{frames.length !== 1 ? 's' : ''} found</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {frames.map((imageData, i) => (
          <DicomFrame key={i} imageData={imageData} frameIndex={i} />
        ))}
      </div>
    </section>
  );
}
