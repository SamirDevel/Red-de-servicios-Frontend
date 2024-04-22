import React from 'react'
function Modal({isOpen, component}) {
  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className=" rounded-lg p-8 max-w-md w-full z-50 text-center">
                {component}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal