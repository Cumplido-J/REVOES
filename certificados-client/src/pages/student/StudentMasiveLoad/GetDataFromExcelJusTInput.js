import React, { useEffect, useState } from "react";
import Alerts from "../../../shared/alerts";
import * as XLSX from 'xlsx';
import utf8 from 'utf8';
import MasiveLoadTable from "./StudentMasiveLoadTable";

import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../../shared/components";
import MasiveLoadService from "../../../service/StudentMasiveLoadService";

class GetDataFromExcelJusTInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hoja: "",
      hojas: [],
      file: false,
      disabled: true,
      studentData: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this)

  }

  handleInputChange(event) {
    console.log(this.state);
    console.log(this.props);
    var errores = "";
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
      let studentData = ""//XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);

      //el  reader del archivo
      let reader = new FileReader()
      reader.readAsArrayBuffer(target.files[0])
      //validamos que sea un csv
      console.log(target.files[0]);
      //console.log(target.files[0].name.lastIndexOf('csv'));
      if (target.files[0].name.lastIndexOf('csv') >= 0 || target.files[0].name.lastIndexOf('xlsx') >= 0) {
        reader.onloadend = (e) => {

          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, { type: 'array' });

          //obtenemos la primera hoja
          var sheetName = workbook.SheetNames[0];

          console.log("sheetname:" + sheetName);
          console.log("workbook:");
          console.log(workbook);
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { raw: true, defval: null });
          //console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{raw: true, defval:null}));
          //studentData=XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);
          //objeto para cargar la peticion al api
          var objetPost = { cargaAlumnos: [] }
          //console.log("XL_row_object");
          //console.log(XL_row_object);
          //iteramos renglones
          console.log("antes de for");
          console.log(XL_row_object);
          if (XL_row_object.length < 1) {
            errores = "El archivo esta vacio";
          }
          XL_row_object.forEach((item, i) => {
            console.log("dentro de for" +JSON.stringify(item));
            if (errores == "") {
              //creamos objeto que va dentro del array de cargaAlumnos
              var objJson = { competencias: [] };


              //metemos los valores constantes
              objJson.curp = item.CURP;
              var nom = (item.NOMBRE === undefined) ? ' ' : item.NOMBRE;
              var primap = (item.PRIMER_APELLIDO === undefined) ? ' ' : item.PRIMER_APELLIDO;
              var segap = (item.SEGUNDO_APELLIDO === undefined) ? ' ' : item.SEGUNDO_APELLIDO;
              var nomcarr = (item.NOMBRE_CARRERA === undefined) ? ' ' : item.NOMBRE_CARRERA;
              try {
                nom = utf8.decode(nom);
                primap = utf8.decode(primap);
                segap = utf8.decode(segap);
                nomcarr = utf8.decode(nomcarr);
              }
              catch (error) {
                console.error(error);
              }
              objJson.nombre = nom;
              objJson.primer_apellido = primap;
              objJson.segundo_apellido = segap;
              objJson.matricula = (item.MATRICULA === undefined || item.MATRICULA === null) ? 0 : item.MATRICULA;
              objJson.cct = item.CCT;
              objJson.clave_carrera = item.CLAVE_CARRERA;

              //validamos la calve de la carrera
              if (!this.validaCarrera(item.CLAVE_CARRERA)) {
                //si no corresponde a la indicada en los combos manda error
                errores = "La clave de carrera cargada " + item.CLAVE_CARRERA + " no concide con la seleccionada";

              }
              objJson.nombre_carrera = nomcarr;
              objJson.promedio = (item.PROMEDIO === undefined || item.PROMEDIO === null) ? 0 : item.PROMEDIO;

              //agregamos el idEntidad y el id generacion
              console.log("idEntidad:" + this.props.idEntidad + ",idGeneration:" + this.props.idGeneration);
              objJson.entidad = this.props.idEntidad;
              objJson.generacion = this.props.idGeneration;
              objJson.fechaTermino = this.props.fecha;
              //iteramos los valores dentro del objeto json
              Object.keys(item).forEach((key) => {
                //guardamos si son valores que no conocemos
                if (key != "CURP" && key != "NOMBRE" && key != "PRIMER_APELLIDO" && key != "SEGUNDO_APELLIDO" && key != "MATRICULA" && key != "CCT" && key != "CLAVE_CARRERA" && key != "NOMBRE_CARRERA" && key != "PROMEDIO") {
                  item[key] = (item[key] === undefined || item[key] === null) ? 0 : item[key];
                  //console.log(item[key]);
                  var competencia = '{"competencia":"' + key + '","calificacion":' + item[key] + '}';
                  objJson.competencias.push(JSON.parse(competencia));
                }
              });
              //empujamos el objeto al arreglo
              objetPost.cargaAlumnos.push(objJson);


              //obtenemos el valor de idCarrera
              if (this.props.idCarrera > 0) {
                objetPost.idCarreraSel = this.props.idCarrera;
              } else {
                Alerts.error("Ocurrio un error", "No se selecciono una carrera");
              }
            }
          });
          if (errores != "") {
            Alerts.error("Ocurrio un error", errores);
          } else {


            Alerts.success("Operación exitosa", "Archivo cargado correctamente");
            hojas.push({
              data: objetPost
            })

            this2.setState({
              selectedFileDocument: target.files[0],
              hojas,
              disabled: false,
              studentData
            })

          }

        }
      } else {
        Alerts.error("Tipo de archivo incorrecto", "solo se admiten archivos .csv");
      }
    } else {
      Alerts.error("Ocurrio un error", "No se pudo cargar el archivo");
    }

  }

  validaCarrera(claveCarrera) {
    //recorremos las carreras
    for (var i = 0; i < this.props.catalogsCareer.length; i++) {
      if (this.props.catalogsCareer[i].id == this.props.idCarrera) {
        //console.log("-----------------------------");
        var a = this.props.catalogsCareer[i].description;
        //console.log("existe carrera"+a.lastIndexOf(claveCarrera));
        if (a.lastIndexOf(claveCarrera) >= 0) {
          return true;
        }
      }
    }
    return false;
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
          onClick={(event) => { event.target.value = "" }}
          placeholder="Archivo de excel"
        />
        <br />
        <PrimaryButton icon={<CheckCircleOutlined />}
          size="large" fullWidth={false}
          onClick={() => { addMasiveLoad(this.state.hojas); this.setState({ disabled: true }) }}
          disabled={this.state.disabled}
        >
          Enviar Excel
        </PrimaryButton>
      </>
    );
  }
}




async function addMasiveLoad(form) {
  //validamos que venga lleno el procesado del archivo
  console.log(form);
  if (form.size != 0) {
    form = form[0].data;
    //form =JSON.stringify(form[0].data);
    console.log("en if" + JSON.stringify(form));
    const response = await MasiveLoadService.masiveLoad(form);
    console.log(response);
    if (response.success) {
      console.log(response);
      Alerts.success("Operación exitosa", "Excel insertado correctamente");
    } else {
      console.log(response);
      // this.setState({
      //   errors:response
      // });
    }
  } else {
    Alerts.error("Ocurrio un error", "No no hay datos en el archivo");
  }

};


export default GetDataFromExcelJusTInput
