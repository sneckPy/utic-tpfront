import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useState } from "react";
import axios from "axios";





const Movies = () => {
    const doc = new jsPDF()
    const apiEndPointModel = 'http://localhost:8080/utic/model'
    const apiEndPointBrand = 'http://localhost:8080/utic/brand'
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);


    const getModels = async () => {
        const { data: res } = await axios.get(apiEndPointModel);
        setModels(res);
        console.log(res)
    };
    const getBrands = async () => {
        const { data: res } = await axios.get(apiEndPointBrand);
        setBrands(res);
        console.log(res)
    };


    const exportBrands = () => {
        doc.autoTable();
        const columns = ["Name", "Sold"];
        const rows = [];
        brands.map(item => rows.push(Object.values(item)))
        doc.autoTable(columns, rows);
        doc.output('dataurlnewwindow', 'Reporte de Marcas');
    }
    const exportModels = () => {
        doc.autoTable();
        const columns = ["ID Modelo", "Nombre", "ID Marca", "Descripción"];
        const rows = [];
        models.map(item => rows.push(Object.values(item)))
        doc.autoTable(columns, rows);
        doc.output('dataurlnewwindow', 'Reporte de Modelos');
    }

    return (
        <>
            <div className="flex h-screen justify-center items-center">
                <button className="btn btn-primary mx-4" onClick={exportBrands}>
                    Imprimir Marcas
                </button>
                <button className="btn btn-primary mx-4" onClick={exportModels}>
                    Imprimir Modelos
                </button>
                <button className="btn btn-primary" onClick={getBrands}>
                    Marcas
                </button>
                <button className="btn btn-primary" onClick={getModels}>
                    Modelos
                </button>
            </div>

        </>
    )
}

export default Movies