import { useState } from "react";

const Modal = ({ visible, setVisible, brand, handleChange }) => {

    return (
        <>
            {visible &&
                <div id="Overlay" className="flex h-screen w-screen items-center justify-center fixed top-0 left-0 bg-[#00000096] z-50 p-[40px]">
                    <div id="Container" className="w-[500px] min-h-[100px] bg-[#fff] relative border-[5px] shadow-xl shadow-gray-800 p-[20px]">
                        <div id="Header" className="flex items-center justify-between  border-b-[1px] border-b-gray-300 ">
                            <div className="text-black font-medium text-lg">
                                Editar
                            </div>
                        </div>
                        <button id="CloseButton" className=" absolute top-5 right-5 cursor-pointer hover:bg-slate-100" onClick={() => { setVisible(!visible) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div>
                            <label className="label">
                                <span className="label-text">Marca</span>
                            </label>
                            <input
                                value={brand.name}
                                onChange={e => handleChange(e)}
                                className='my-2 input input-bordered w-full max-w-xs' autoComplete='off' />
                            <button className='btn  btn-outline btn-sm absolute right-2 bottom-2  '>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default Modal;