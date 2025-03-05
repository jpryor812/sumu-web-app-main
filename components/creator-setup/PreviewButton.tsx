interface PreviewButtonProps {
  onClick: () => void;
}

export default function PreviewButton({ onClick }: PreviewButtonProps) {
  return (
    <div className="flex justify-center mb-8">
      <button
        type="button"
        onClick={onClick}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
      >
        Preview Your Page
      </button>
    </div>
  );
} 