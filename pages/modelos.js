import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const apiEndPointModel = 'http://localhost:8080/utic/model'
const apiEndPointBrand = 'http://localhost:8080/utic/brand'

const Modelos = () => {
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        getModels();
        getBrands();
    }, []);

    const getModels = async () => {
        const { data: res } = await axios.get(apiEndPointModel);
        setModels(res);
    };
    const getBrands = async () => {
        const { data: res } = await axios.get(apiEndPointBrand);
        setBrands(res);
    };

    const [data, setData] = useState({
        idModel: "",
        name: "",
        description: "",
        idBrand: "",
        image: "",
    })

    const [selectedModel, setSelectedModel] = useState({
        idModel: "",
        name: "",
        description: "",
        idBrand: "",
        image: "",
    })
    const [selectedBrand, setSelectedBrand] = useState({
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

    const handleChangeSelectedModel = (e) => {
        const newData = { ...selectedModel }
        newData[e.target.id] = e.target.value
        setSelectedModel(newData)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(apiEndPointModel, {
            name: data.name,
            description: data.description,
            idBrand: data.idBrand,
        }).then(res => {
            console.log(res.data)
        }).then(getModels)
            .then(clearFields)
    }

    const handleDelete = (model) => {
        axios.delete(apiEndPointModel + "/" + model.idModel).then(getModels).then(clearFields)
    };

    const handleUpdate = (e) => {
        e.preventDefault()
        axios.post(apiEndPointModel, {
            idModel: selectedModel.idModel,
            name: selectedModel.name,
            description: selectedModel.description,
            idBrand: selectedModel.idBrand,
        }).then(res => {
            console.log(res.data)
        }).then(getModels).then(clearFields)
    }

    const clearFields = () => {
        const newData = {
            idModel: "",
            name: "",
            description: "",
            idBrand: "",
            image: "",
        }
        setData(newData)
    }

    const exportAllModels = () => {
        let rows = models.map((model) => Object.values(model))
        rows.map((row) =>
            brands.map((brand) =>
                row[2] === brand.idBrand
                    ? row[2] = brand.name
                    : null
            )
        )
        const doc = new jsPDF()
        autoTable(doc, {
            head: [["ID Modelo", "Nombre", "Marca", "Descripci??n"]],
            body: rows,
        })
        doc.output('dataurlnewwindow', 'Reporte de Modelos');
    }

    const exportModel = (model) => {
        let brandName = ''
        brands.map((brand) =>
            brand.idBrand === model.idBrand
                ?
                brandName = brand.name
                : null
        )
        const doc = new jsPDF()
        autoTable(doc, {
            head: [["ID Modelo", "Nombre", "Marca", "Descripci??n"]],
            body: [[model.idModel, model.name, brandName, model.description]],
        })
        doc.output('dataurlnewwindow', 'Reporte de Modelos');
    }

    return (
        <>
            <div className=' flex justify-between m-4'>
                <label htmlFor="modal-add" className="btn btn-outline ">Agregar Modelo</label>
                <button className="btn btn-outline" onClick={exportAllModels}>Generar Reporte</button>
            </div>
            <input type="checkbox" id="modal-add" className="modal-toggle" />
            <ModalAdd data={data} handleChange={handleChange} handleSubmit={handleSubmit} brands={brands} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
            <div className="flex h-screen">
                <div className='mx-auto grid grid-cols-3 gap-8 z-10'>
                    {models.map((model) =>

                        <div key={model.idModel}>
                            <div className="card card-compact w-[450px] bg-base-100 hover:shadow-xl shadow-md">
                                <figure><img src={model.image} alt="Model Image" className='max-h-[350px] object-cover' /></figure>
                                <div className="card-body">
                                    <h2 className="card-title justify-center">{model.name}</h2>
                                    <BrandName brands={brands} model={model} />
                                    <p>{model.description}</p>
                                    <div className="card-actions justify-end mt-2">
                                        <ButtonReport exportModel={exportModel} model={model} />
                                        <button onClick={() => {
                                            setSelectedModel(model)
                                        }}>
                                            <label htmlFor="modal-update" className='cursor-pointer'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="orange" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 
                                                    4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25
                                                    2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </label>
                                        </button>
                                        <ButtonDelete handleDelete={handleDelete} model={model} />

                                        <input type="checkbox" id="modal-update" className="modal-toggle" />
                                        <ModalUpdate data={selectedModel} handleChange={handleChangeSelectedModel} handleUpdate={handleUpdate} brands={brands} />
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

function ModalUpdate(props) {
    const [modelo, setModelo] = useState("Seleccione Modelo")
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
                    <div className="dropdown dropdown-hover">
                        <label tabIndex={0} className="btn m-1 w-[190px]">{modelo}</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            {props.brands.map((brand) =>
                                <div key={brand.idBrand}>
                                    <li className='cursor-pointer my-4' onClick={() => {
                                        props.data.idBrand = brand.idBrand
                                        setModelo(brand.name)
                                    }}>{brand.name}</li>
                                </div>
                            )}
                        </ul>
                    </div>
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

function ModalAdd(props) {
    const [modelo, setModelo] = useState("Seleccione Modelo")
    return (
        <div className="modal min-w-[400px]">
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

                    <div className="dropdown dropdown-hover">
                        <label tabIndex={0} className="btn m-1 w-[190px]">{modelo}</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            {props.brands.map((brand) =>
                                <div key={brand.idBrand}>
                                    <li className='cursor-pointer my-4' onClick={() => {
                                        props.data.idBrand = brand.idBrand
                                        setModelo(brand.name)
                                    }}>{brand.name}</li>
                                </div>
                            )}
                        </ul>
                    </div>

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
            </div >
        </div >
    );
}

const BrandName = (props) => {
    return (
        <>
            {props.brands.map((brand) =>
                brand.idBrand === props.model.idBrand
                    ?
                    <h2 key={brand.idBrand} className="card-title justify-start">{brand.name}</h2>
                    : null

            )}
        </>
    )

}

function ButtonDelete(props) {
    return (
        <button onClick={() => {
            props.handleDelete(props.model)
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="red" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    );
}

function ButtonReport(props) {
    return (
        <button onClick={() => props.exportModel(props.model)}>
            <svg className="w-8 h-8" fill="green" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
            </svg>
        </button>
    );
}

export default Modelos;