import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const apiEndPoint = 'http://localhost:8080/utic/brand'

const Marca = () => {

    const [brands, setBrands] = useState([]);

    const [data, setData] = useState({
        idBrand: "",
        name: "",
        description: "",
        image: "",
    })

    const handleChange = (e) => {
        const newData = { ...data }
        newData[e.target.id] = e.target.value
        setData(newData)
    }

    const handleChangeSelectedBrand = (e) => {
        const newData = { ...selectedBrand }
        newData[e.target.id] = e.target.value
        setSelectedBrand(newData)
    }

    const [selectedBrand, setSelectedBrand] = useState({
        idBrand: "",
        name: "",
        description: "",
        image: "",
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(data)

        axios.post(apiEndPoint, {
            name: data.name,
            description: data.description,
        }).then(res => {
            console.log(res.data)
        }).then(getBrands)
            .then(clearFields)
    }

    const handleDelete = (brand) => {
        axios.delete(apiEndPoint + "/" + brand.idBrand).then(getBrands).then(clearFields)
    };

    const handleUpdate = (e) => {
        console.log(e.target.value)
        e.preventDefault()
        axios.post(apiEndPoint, {
            idBrand: selectedBrand.idBrand,
            name: selectedBrand.name,
            description: selectedBrand.description,
        }).then(res => {
            console.log(res.data)
        }).then(getBrands).then(clearFields)
    }

    const clearFields = () => {
        const newData = {
            idBrand: "",
            name: "",
            description: "",
            image: "",
        }
        setData(newData)
    }

    const getBrands = async () => {
        const { data: res } = await axios.get(apiEndPoint);
        setBrands(res);
    };

    const exportAllBrands = () => {
        const rows = brands.map((brand) => Object.values(brand));
        const doc = new jsPDF()
        autoTable(doc, {
            head: [["ID Marca", "Nombre", "Descripci??n"]],
            body: rows,
        })
        doc.output('dataurlnewwindow', 'Reporte de Marcas');
    }

    const exportBrand = (brand) => {
        const doc = new jsPDF()
        autoTable(doc, {
            head: [["ID Marca", "Nombre", "Descripci??n"]],
            body: [[brand.idBrand, brand.name, brand.description]],
        })
        doc.output('dataurlnewwindow', 'Reporte de Marcas');
    }

    useEffect(() => {
        getBrands();
    }, []);

    return (
        <>
            <div className=' flex justify-between m-4'>
                <label htmlFor="modal-add" className="btn btn-outline">Agregar Marca</label>
                <button className="btn btn-outline" onClick={exportAllBrands}>Generar Reporte</button>
            </div>
            <input type="checkbox" id="modal-add" className="modal-toggle" />
            <ModalAdd data={data} handleChange={handleChange} handleSubmit={handleSubmit} />
            <div className="flex h-screen">
                <button >

                </button>
                <div className='mx-auto grid grid-cols-3 gap-8 z-10'>
                    {brands.map((brand, index) =>

                        <div key={brand.idBrand}>
                            <div className="card card-compact w-[450px] bg-base-100 hover:shadow-xl shadow-md">
                                <figure><img src={brand.image} alt="Brand Image" className='max-h-[350px] object-cover' /></figure>
                                <div className="card-body">
                                    <h2 className="card-title justify-center">{brand.name}</h2>
                                    <p>{brand.description}</p>
                                    <div className="card-actions justify-end mt-2">
                                        <ButtonReport exportBrand={exportBrand} brand={brand} />
                                        <button onClick={() => {
                                            setSelectedBrand(brand)
                                        }}>
                                            <label htmlFor="modal-update" className='cursor-pointer'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="orange" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 
                                                    4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25
                                                    2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </label>
                                        </button>
                                        <input type="checkbox" id="modal-update" className="modal-toggle" />
                                        <ModalUpdate data={selectedBrand} handleUpdate={handleUpdate} handleChange={handleChangeSelectedBrand} />
                                        <ButtonDelete handleDelete={handleDelete} brand={brand} />
                                    </div>
                                </div>
                            </div>

                        </div>

                    )}
                </div>
            </div>

        </>
    );
}

function ModalAdd(props) {
    return (
        <div className="modal">
            <div className="modal-box relative">
                <label htmlFor="modal-add" className="btn btn-circle btn-outline btn-sm absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </label>
                <form onSubmit={e => props.handleSubmit(e)}>
                    <label className="label">
                        <span className="label-text">Marca</span>
                    </label>
                    <input onChange={e => props.handleChange(e)} id='name' value={props.data.name} type="text" placeholder='Nombre de la Marca'
                        className='my-2 input input-bordered w-full max-w-xs' autoComplete='off' />
                    <label className="label">
                        <span className="label-text">Descripci??n</span>
                    </label>
                    <textarea onChange={e => props.handleChange(e)} id='description' value={props.data.description} type="text" placeholder='Datos de la marca'
                        className='my-2 input input-bordered w-full max-w-xs min-h-[200px]' autoComplete='off' />
                    <button className='btn  btn-outline btn-sm absolute right-2 bottom-2  '>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}

function ModalUpdate(props) {
    return (
        <div className="modal">
            <div className="modal-box relative">
                <label htmlFor="modal-update" className="btn btn-circle btn-outline btn-sm absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </label>
                <form onSubmit={e => props.handleUpdate(e)}>
                    <label className="label">
                        <span className="label-text">Marca</span>
                    </label>
                    <input onChange={e => props.handleChange(e)} id='name' value={props.data.name} type="text" placeholder='Nombre de la Marca'
                        className='my-2 input input-bordered w-full max-w-xs' autoComplete='off' />
                    <label className="label">
                        <span className="label-text">Descripci??n</span>
                    </label>
                    <textarea onChange={e => props.handleChange(e)} id='description' value={props.data.description} type="text" placeholder='Datos de la marca'
                        className='my-2 input input-bordered w-full max-w-xs min-h-[200px]' autoComplete='off' />
                    <button className='btn  btn-outline btn-sm absolute right-2 bottom-2  '>
                        <label htmlFor="modal-update">
                            Guardar
                        </label>
                    </button>
                </form>
            </div>
        </div>
    );
}

function ButtonDelete(props) {
    return (
        <button onClick={() => props.handleDelete(props.brand)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="red" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    );
}

function ButtonReport(props) {
    return (
        <button onClick={() => props.exportBrand(props.brand)}>
            <svg className="w-8 h-8" fill="green" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
            </svg>
        </button>
    );
}

export default Marca;