"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
};

export default function Modal({
  open,
  setOpen,
  children,
  title,
}: ModalProps) {
  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className={`fixed inset-0 overflow-y-auto`}>
            <div className="flex font-vt323 min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-slate-100 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-large text-gray-700">{children}</p>
                  </div>

                  <div className="mt-4 absolute top-0 right-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent -mt-8 px-2 py-2 text-lg text-gray-900"
                      onClick={closeModal}
                      title="Close Modal"
                    >
                      x
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
