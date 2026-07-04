import { useState } from 'react';

function Addons() {
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; text: string; onConfirm: (() => void) | null }>({
    isOpen: false,
    title: '',
    text: '',
    onConfirm: null
  });

  const showFlash = (msg: string, type: 'success' | 'error') => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 5000);
  };

  const triggerConfirm = (title: string, text: string, callback: () => void) => {
    setModal({ isOpen: true, title, text, onConfirm: callback });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const UIOverlay = () => (
    <>
      {flash && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white font-semibold z-[100] transition-all animate-fade-in ${flash.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {flash.msg}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-semibold tracking-wider animate-pulse">Processing...</p>
        </div>
      )}

      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fade-in flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{modal.title}</h3>
            <p className="text-gray-500 text-sm mb-6">{modal.text}</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modal.onConfirm) modal.onConfirm();
                  closeModal();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return { setIsLoading, showFlash, triggerConfirm, UIOverlay };
}

export default Addons;