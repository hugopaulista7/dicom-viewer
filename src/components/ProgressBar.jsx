export function ProgressBar({ visible, progress }) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
