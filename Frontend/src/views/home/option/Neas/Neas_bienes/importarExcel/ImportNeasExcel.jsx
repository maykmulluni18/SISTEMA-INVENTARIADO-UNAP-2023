import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";
import "./exceldatanea.scss"

const URI = 'http://localhost:8000/excelneasimport/upload/'

const ImportNeasExcel = () => {
  const navigate = useNavigate()
  const [msg, setMsg] = useState()
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [archivo, setArchivo] = useState(null)
  const subirArchivos = e => {
    setArchivo(e)
  }
  const getArchivo = async () => {
    try {
      const ar = new FormData()
      for (let i = 0; i < archivo?.length; i++) {
        ar.append('file', archivo[i])
      }
      const MIN_FILE_SIZE = 1024 // 1MB
      const MAX_FILE_SIZE = 5120 // 5MB
  
      if (!archivo) {
        //setErrorMsg("Por favor elige un archivo");
        setIsSuccess(false)
        Swal.fire(
          {
            title: 'Eliga un archivo por favor !',
            icon: 'question',
            timer: 5500
          }
        )
        return
      }
  
      const fileSizeKiloBytes = archivo.size / 1024
  
      if(fileSizeKiloBytes > MAX_FILE_SIZE){
        setErrorMsg("El tamaño del archivo es mayor que el límite máximo");
        setIsSuccess(false)
        return
      }
  
      setErrorMsg("")
      setIsSuccess(true)
      const respon = await axios.post(URI, ar)

      if (respon.status === 400) {
        Swal.fire(
          {
            title: 'No hay archivo',
            // text: 'Presione Clik para cerrar!',
            icon: 'question',
            timer: 5500
          }
        )
      } else if (respon.status === 200) {
        Swal.fire(
          {
            title: 'Creado con Exito..',
            // text: 'Presione Clik para cerrar!',
            icon: 'success',
            timer: 5500
          }
        )
        navigate('/reportes-neas')

      } else if (respon.status === 500) {
        Swal.fire(
          {
            title: 'Error!',
            icon: 'question',
            timer: 5500
          }
        )
      }
    } catch (error) {
      if (error.respon) {
        setMsg(error.respon.data.msg)
      }
    }
  }
  return (
    <>
    <p>{msg}</p>
      <div className="contend_ex_nea">
      {isSuccess ? <p className="success-message">Error al subir el Archivos</p> : null}
          <p className="error-message">{errorMsg}</p>
        <input
          type='file'
          name="file"
          onChange={(e) => subirArchivos(e.target.files)}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
          required
        />
        
        <button className="buttonE" onClick={() => getArchivo()}>Insertar datos por Excel</button>
      </div>
    </>
  )
}

export default ImportNeasExcel