import React from "react";

type PropType = {
  title: string;
  content?: string;
  setOpenModal: (e: any) => any;
  onSubmit?: () => any;
  isLoading?: boolean;
  showConfirmButton: boolean;
  showFormData?: boolean;
  data?: string | number;
  setData?: any;
};

function index({
  title,
  content,
  setOpenModal,
  onSubmit,
  isLoading,
  showConfirmButton,
  showFormData = false,
  data,
  setData,
}: PropType) {
  return (
    <div>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed z-10  top-[4rem] bottom-0 right-0 left-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <div className="relative dark:bg-[#323f4b] bg-white rounded-lg  text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="dark:bg-[#323f4b] bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex  md:items-center">
                    <div className="flex mt-3 flex-col justify-center items-center space-y-2 sm:mt-0">
                      <h1
                        className="text-2xl font-bold dark:text-white/80 text-primary"
                        id="modal-title"
                      >
                        {title}
                      </h1>
                      <h3
                        className="text-lg leading-6 font-normal dark:text-white/70 text-[#141414]"
                        id="modal-title"
                      >
                        {content}
                      </h3>
                      {showFormData && (
                        <input
                          type="number"
                          value={data}
                          onChange={(e: any) => setData(e.target.value)}
                          className="text-md dark:bg-[#506375] dark:text-white/80 py-4 px-5 my-10 text-red.500 rounded-md border-inherit border-2 placeholder:text-xl placeholder:font-bold placeholder:text-[#141414A6] w-[80%]"
                          placeholder="write here"
                        />
                      )}

                      {showConfirmButton ? (
                        <div className="flex items-center justify-center gap-4">
                          {isLoading ? (
                            ""
                          ) : (
                            <button
                              className="flex justify-center py-2 px-4 dark:bg-[#506375] dark:text-white bg-blue-200 text-black"
                              onClick={() => setOpenModal(false)}
                            >
                              Back
                            </button>
                          )}
                          {isLoading ? (
                            "loading"
                          ) : (
                            <button
                              className="flex justify-center py-2 px-4  dark:bg-[#506375] bg-green-600 text-white"
                              onClick={() => onSubmit()}
                            >
                              Proceed
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          className="flex justify-center py-2 px-2 w-full dark:bg-[#506375] dark:text-white/90 bg-[#08172E] text-white"
                          onClick={() => setOpenModal(false)}
                        >
                          Take me Back
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
