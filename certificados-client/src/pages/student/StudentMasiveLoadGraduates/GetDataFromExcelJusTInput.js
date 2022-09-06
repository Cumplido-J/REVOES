import React, { useEffect, useState } from "react";
import Alerts from "../../../shared/alerts";
import * as XLSX from 'xlsx';
import utf8 from 'utf8';
import { Descriptions} from "antd";

import { CheckCircleOutlined} from "@ant-design/icons";
import { PrimaryButton} from "../../../shared/components";
import MasiveLoadService from "../../../service/StudentMasiveLoadGraduatesService";
import DescriptionsItem from "antd/lib/descriptions/Item";

class GetDataFromExcelJusTInput extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
      hoja: "",
      hojas:[],
      file: false,
      disabled: true,
      studentData:"",
      textoResultado:"",
      textoTotalAlumnos:"",
      totalAlumnos:"",
      textoTotalProcesados:"",
      totalProcesados:"",
      textoTotalAgregados:"",
      totalAgregados:"",
      textoActualizados:"",
      totalActualizados:"",
      textoTotalError:"",
      totalError:"",
      textoAlumnosError:"",
      alumnosError:""
    };
    this.handleInputChange = this.handleInputChange.bind(this);


  }
  


  handleInputChange (event) {
    console.log(this.state);
    var errores="";
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    const this2 = this
    this.setState({
      [name]: value
    })
    let hojas = []
    if (name === 'file') {
      //contenedor para escribir los datos en la tabla
      let studentData=""//XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);

      //el  reader del archivo
      let reader = new FileReader()
      reader.readAsArrayBuffer(target.files[0])
      //validamos que sea un csv
      console.log(target.files[0]);
      //console.log(target.files[0].name.lastIndexOf('csv'));
      if(target.files[0].name.lastIndexOf('csv')>=0 || target.files[0].name.lastIndexOf('xlsx')>=0){
        reader.onloadend = (e) => {

          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, {type: 'array'});

          //obtenemos la primera hoja
          var sheetName=workbook.SheetNames[0];
          
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName],{raw: true, defval:null});
    
          //objeto para cargar la peticion al api
          var objetPost={graduadosAlumnos:[]}
          console.log(XL_row_object.length)
          if (XL_row_object.length < 1) {
            errores = "El archivo esta vacio."
          }

          //iteramos renglones
          XL_row_object.forEach((item, i) => {

            if(errores=="")
            {
              //creamos objeto que va dentro del array de cargaAlumnos
              var objJson={};
    
              
              //metemos los valores constantes
              objJson.colegio=item.colegio;
              var cct="";
              cct+=(item.cct===undefined||item.cct===''||item.cct===null)?' ':item.cct;
              var turno="";
              turno+=(item.turno===undefined||item.turno===''||item.turno===null)?' ':item.turno;
              var cve_carrera="";
              cve_carrera+=(item.cve_carrera===undefined||item.cve_carrera===''||item.cve_carrera===null)?'0':item.cve_carrera;
              var nombre_carrera="";
              nombre_carrera+=(item.nombre_carrera===undefined||item.nombre_carrera===''||item.nombre_carrera===null)?' ':item.nombre_carrera;
              var matricula="";
              matricula+=(item.matricula===undefined||item.matricula===''||item.matricula===null)?'0':item.matricula;
              var nombre="";
              nombre+=(item.nombre===undefined||item.nombre===''||item.nombre===null)?' ':item.nombre;
              var ap_paterno="";
              ap_paterno+=(item.ap_paterno===undefined||item.ap_paterno===''||item.ap_paterno===null)?' ':item.ap_paterno;
              var ap_materno="";
              ap_materno+=(item.ap_materno===undefined||item.ap_materno===''||item.ap_materno===null)?' ':item.ap_materno;
              var curp="";
              curp+=(item.curp===undefined||item.curp===''||item.curp===null)?' ':item.curp;
              var genero="";
              genero+=(item.genero===undefined||item.genero===''||item.genero===null)?' ':item.genero;
              var correo="";
              correo+=(item.correo===undefined||item.correo===''||item.correo===null)?' ':item.correo;
              var grupo="";
              grupo+=(item.grupo===undefined||item.grupo===''||item.grupo===null)?' ':item.grupo;
              try{
                nombre=utf8.decode(nombre);
                ap_paterno=utf8.decode(ap_paterno);
                ap_materno=utf8.decode(ap_materno);
                //nombre_carrera=utf8.decode(nombre_carrera);
              }
              catch(error){
                console.error(error);
              }
              //validamos que metan cct del estado correcto
              var idestado=""+this.props.idEstado;
              if(idestado.length===1)
              {
                idestado="0"+idestado; 
              }
              if(idestado===cct.substring(0,2))
              {
                objJson.cct=cct.trim();
                //console.log("el props de idEstado:"+this.props.idEstado);
              }else
              {
                //console.log("el props de idEstado:"+this.props.idEstado);
                errores=" Solo puede cargar planteles del estado seleccionado ";
              }
              
              objJson.turno=turno.trim();
              objJson.cve_carrera=cve_carrera.trim();
              objJson.nombre_carrera=nombre_carrera.trim();
              objJson.matricula=matricula;
              objJson.nombre=nombre.trim();
              objJson.ap_paterno=ap_paterno.trim();
              objJson.ap_materno=ap_materno.trim();

              //validamos curp que esta a 10 o 18 caracteres
              curp=curp.trim();
              if(curp.length===10 || curp.length===18)
              {
                objJson.curp=curp;
              }else
              {
                errores=" CURP o CURPS invalidos, solo es valido a 18 o 10 caracteres ";
              }
              
              objJson.genero=genero.trim();
              objJson.correo=correo.trim();
              objJson.grupo=grupo.trim();
              //validamos que hayan seleccionado generacion
              if(this.props.idGeneracion!=undefined && this.props.idGeneracion != null && this.props.idGeneracion != "")
              {
                objJson.generacion=this.props.idGeneracion;
              }else
              {
                //console.log("el props de idGeneracion:"+this.props.idGeneracion);
                errores+=" No selecciono la generación ";
              }
                
              //iteramos los valores dentro del objeto json
              Object.keys(item).forEach((key)=>{
                //guardamos si son valores que no conocemos
                if(key!="colegio" && key!="cct" && key!="turno" && key!="cve_carrera" && key!="nombre_carrera" && key!="matricula" && key!="ap_paterno" && key!="ap_materno" && key!="curp"&& key!="genero"&& key!="correo"&& key!="grupo" && key!="generacion")
                {
                  item[key]=(item[key]===undefined||item[key]===null)?0:item[key];
                }
              });
              //empujamos el objeto al arreglo
              objetPost.graduadosAlumnos.push(objJson);
           
            }
          });
          if(errores!="" && XL_row_object.length < 1)
          {
            Alerts.error("Ocurrio un error", errores);
          }else{
            

            Alerts.success("Operación exitosa", "Archivo .CSV o .XLSX analizado, dar clic en Enviar Excel");
            hojas.push({
              data: objetPost
            })
            
            this2.setState({
              selectedFileDocument: target.files[0],
              hojas,
              disabled:false,
              studentData,
              textoResultado:"",
              textoTotalAlumnos:"",
              totalAlumnos:"",
              textoTotalProcesados:"",
              totalProcesados:"",
              textoTotalAgregados:"",
              totalAgregados:"",
              textoActualizados:"",
              totalActualizados:"",
              textoTotalError:"",
              totalError:"",
              textoAlumnosError:"",
              alumnosError:""
            })
     
          }

        }
      }else{
        Alerts.error("Tipo de archivo incorrecto", "solo se admiten archivos .csv");
      }
    }else{
      Alerts.error("Ocurrio un error", "No se pudo cargar el archivo");
    }
    
  } 

  render() {

    const {
      handleInputChange
    } = this
    return (
      <>
        <input 
            required 
            type="file" 
            name="file" 
            id="file" 
            onChange={handleInputChange} 
            onClick={(event)=>{event.target.value=""}}
            placeholder="Archivo de excel" 
        />
        <br/>
        <PrimaryButton icon={<CheckCircleOutlined />}  
            size="large" fullWidth={false} 
            onClick={()=>{addMasiveLoad(this.state.hojas, this); this.setState({disabled:true})}} 
            disabled={this.state.disabled}
        >
          Enviar Excel 
        </PrimaryButton>
        <br/>
        <Descriptions title={this.state.textoResultado} fullWidth={true}>
          <Descriptions.Item label={this.state.textoTotalAlumnos}>{this.state.totalAlumnos}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="" fullWidth={true}>
          <Descriptions.Item label={this.state.textoTotalProcesados}>{this.state.totalProcesados}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="" fullWidth={true}>
          <Descriptions.Item label={this.state.textoTotalAgregados}>{this.state.totalAgregados}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="" fullWidth={true}>
          <Descriptions.Item label={this.state.textoActualizados}>{this.state.totalActualizados}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="" fullWidth={true}>
          <Descriptions.Item label={this.state.textoTotalError}>{this.state.totalError}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="" fullWidth={true}>
          <Descriptions.Item label={this.state.textoAlumnosError}>{this.state.alumnosError}</Descriptions.Item>
        </Descriptions>
        </>
    );
  }
}




async function  addMasiveLoad (form, this2){  
  //validamos que venga lleno el procesado del archivo
  if(form.size!=0){
    form=form[0].data;
    //form =JSON.stringify(form[0].data);
    console.log("en if"+JSON.stringify(form));
    const response = await MasiveLoadService.masiveLoad(form);
    console.log(response);

    if (response.success)
    {
      this2.setState({
        hoja: "",
        hojas:[],
        file: false,
        disabled: true,
        studentData:"",
        textoResultado:"Resultado de la Carga",
        textoTotalAlumnos:"Total alumnos",
        totalAlumnos:response.data.total_alumnos,
        textoTotalProcesados:"Total procesados",
        totalProcesados:response.data.total_procesados,
        textoTotalAgregados:"Total agregados",
        totalAgregados:response.data.total_de_agergados,
        textoActualizados:"Total actualizados",
        totalActualizados:response.data.total_de_actualizados,
        textoTotalError:"Total error",
        totalError:response.data.total_con_error,
        textoAlumnosError:"Alumnos con Error",
        alumnosError:response.data.alumnos_con_error
      })
    }else{
      console.log(response);
    } 
  }else{
    Alerts.error("Ocurrio un error", "No no hay datos en el archivo");
  }

};


export default GetDataFromExcelJusTInput
