import React, { useLayoutEffect, useEffect, useState } from "react";
//import React, { useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_mexicoLow from "@amcharts/amcharts4-geodata/mexicoLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import imarker from "../../images/marker.svg";

import { Loading,SearchSelect, } from "../../shared/components";
import {Card, Col,Row,Descriptions} from "antd";
import DashboardService from "../../service/DashboardService";
import { surveyTypeCatalog, SurveyTypes } from "../../shared/catalogs";
import AlertInfo from "./AlertInfo";
import ChartsXY from "./ChartsXY";
import ChartsHM from "./ChartsHM";
import ChartsHMTitulo from "./ChartsHMTitulo";
import ChartsHMNuevo from "./ChartsHMNuevo";

const colProps = {
  xs: { span: 24 },
  sm: { span: 16 },
  md: { span: 12 },
};

const colProps2 = {
  xs: { span: 24 },
  sm: { span: 16 },
  md: { span: 8 },
};
// Create chart instance
export default function MapMexico({stateId,schoolId,msj,reseteo} ) {
  am4core.useTheme(am4themes_animated);
  const [loading, setLoading] = useState(false);
  const [datamapa, setDatamapa] = useState([]);
  const [surveyType, setSurveyType] = useState(SurveyTypes.GRADUATED2021);
  ///info alert
  const [idestado, setIdestado] = useState(stateId);
  const [idschool, setIdschool] = useState(schoolId);
  const [schools, setSchools] = useState([]);
  ///mostrar cambio en el encabezado
  const [msjheader,setMsjheader]=useState([msj]);
  const [msjheadermapa,setMsjheadermapa]=useState([msj]);

  useEffect(() => {
    const getSurveyReport = async () => {
      setLoading(true);
      const response = await DashboardService.getMexicoReport(surveyType);
      await loadSchool();
      setLoading(false);
      if (!response.success) return;
      setDatamapa(response.surveyReport);
    };
    getSurveyReport();
  }, [surveyType,idestado,idschool]);

  const loadSchool= async () => {
    setLoading(true);
    const response = await DashboardService.getPlanteles(idestado,idschool);
    setLoading(false);
    if (!response.success) return;
    setSchools(response.schools);
  };


  useLayoutEffect(() => {
    setLoading(true);

    let chart = am4core.create("mapdiv", am4maps.MapChart);
        chart.projection = new am4maps.projections.Miller();
        //variable ciudades
    let citiesSeries = chart.series.push(new am4maps.MapPolygonSeries());
        //variable estados
    let stateSeries = chart.series.push(new am4maps.MapPolygonSeries());
        stateSeries.useGeodata = true;

        if(idestado!=0){
          let map;
          switch(idestado) {
            case 1:
              map = "agsLow";
            break;
            case 2:
              map = "bcnLow";
            break;      
            case 3:
              map = "bcsLow";
            break;
            case 4:
              map = "camLow";
            break;
            case 5:
              map = "coaLow";
            break;
            case 6:
              map = "colLow";
            break;
            case 7:
              map = "chpLow";
            break;
            case 8:
              map = "chhLow";
            break;
            case 9:
              map = "cmxLow";
            break;
            case 10:
              map = "durLow";
            break;
            case 11:
              map = "guaLow";
            break;
            case 12:
              map = "groLow";
            break;      
            case 13:
              map = "hidLow";
            break;              
            case 14:
              map = "jalLow";
            break;
            case 15:
              map = "mexLow";
            break;
            case 16:
              map = "micLow";
            break;
            case 17:
              map = "morLow";
            break;
            case 18:
              map = "nayLow";
            break;
            case 19:
              map = "nleLow";
            break;
            case 20:
              map = "oaxLow";
            break;
            case 21:
              map = "pueLow";
            break;
            case 22:
              map = "queLow";
            break;
            case 23:
              map = "rooLow";
            break;
            case 24:
              map = "slpLow";
            break;
            case 25:
              map = "sinLow";
            break;
            case 26:
              map = "sonLow";
            break;
            case 27:
              map = "tabLow";
            break;
            case 28:
              map = "tamLow";
            break; 
            case 29:
              map = "tlaLow";
            break;
            case 30:
              map = "verLow";
            break;
            case 31:
              map = "yucLow";
            break;
            case 32:
              map = "zacLow";
            break;                        
          }
          if (map) {
            citiesSeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/region/mexico/" + map + ".json";
            citiesSeries.geodataSource.load();
          }
        }else{
          stateSeries.geodata = am4geodata_mexicoLow;
        }
        //stateSeries.geodata = am4geodata_mexicoLow;
        stateSeries.mapPolygons.template.tooltipText = "{name}: hombres {value},mujeres {value1}";
        stateSeries.mapPolygons.template.fill = am4core.color("#F2C02E");
        //74B266
        stateSeries.mapPolygons.template.stroke = am4core.color("#528745");
        //hoverState  al pasar el clic
    let hs = stateSeries.mapPolygons.template.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");
        stateSeries.data  = datamapa.map((row) => ({
          "id": row.id,
          "value":row.hvalue,
          "value1":row.mvalue,
          "fill": am4core.color("#99C78F")
        }));               
        //pinta por el estado
        stateSeries.mapPolygons.template.propertyFields.fill = "fill";
        

    //let citiesSeries = chart.series.push(new am4maps.MapPolygonSeries());
        citiesSeries.useGeodata = true;
        citiesSeries.hide();
        citiesSeries.geodataSource.events.on("done", function(ev) {
          stateSeries.hide();
          citiesSeries.show();
        }); 

        var citiesPolygon = citiesSeries.mapPolygons.template;
        citiesPolygon.tooltipText = "{COUNTY}";
        citiesPolygon.nonScalingStroke = true;
        citiesPolygon.strokeOpacity = 0.5;
        citiesPolygon.fill = am4core.color("#CFB9A5");
        
        var hCities = citiesPolygon.states.create("hover");
        hCities.properties.fill = chart.colors.getIndex(9);        

        // marcador
        // Create image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());
        // Create image
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var marker = imageSeriesTemplate.createChild(am4core.Image);
        //marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
        marker.href = imarker;
        marker.width = 20;
        marker.height = 20;
        marker.nonScaling = true;
        marker.tooltipText = "{title}";
        marker.horizontalCenter = "middle";
        marker.verticalCenter = "bottom";

      // Set property fields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";

      imageSeries.data  = schools.map((row) => ({
        "title" : row.title,
        "latitude" : row.latitude,
        "longitude" : row.longitude,
        "id" : row.id,
      }));

        // Set up click events
        imageSeriesTemplate.events.on("hit", function(ev) {
          var data = ev.target.dataItem.dataContext;
          var info = document.getElementById("info");
          info.innerHTML = "<h3>" + data.title+ " </h3>";
          if (data.title) {
            info.innerHTML += data.latitude;
            setIdschool(data.id);
            setMsjheader(data.title);
          }
          else {
            info.innerHTML += "<i>No title provided.</i>"
          }

        });
        stateSeries.mapPolygons.template.events.on("hit", function(ev) {
          ev.target.series.chart.zoomToMapObject(ev.target);
          let map;
          let idesta;
          var data = ev.target.dataItem.dataContext;
          switch(ev.target.dataItem.dataContext.id) {
            case "MX-AGU":
              map = "agsLow";
              idesta=1;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-BCN":
              map = "bcnLow";
              idesta=2;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;      
            case "MX-BCS":
              map = "bcsLow";
              idesta=3;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-CAM":
              map = "camLow";
              idesta=4;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-CHH":
              map = "chhLow";
              idesta=8;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-CHP":
              map = "chpLow";
              idesta=7;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-CMX":
              map = "cmxLow";
              idesta=9;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-COA":
              map = "coaLow";
              idesta=5;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-COL":
              map = "colLow";
              idesta=6;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-DUR":
              map = "durLow";
              idesta=10;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-GRO":
              map = "groLow";
              idesta=12;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;      
            case "MX-GUA":
              map = "guaLow";
              idesta=11;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-HID":
              map = "hidLow";
              idesta=13;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;              
            case "MX-JAL":
              map = "jalLow";
              idesta=14;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-MEX":
              map = "mexLow";
              idesta=15;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-MIC":
              map = "micLow";
              idesta=16;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-MOR":
              map = "morLow";
              idesta=17;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-NAY":
              map = "nayLow";
               idesta=18;
               setMsjheader(data.name);
               setMsjheadermapa(data.name);
            break;
            case "MX-NLE":
              map = "nleLow";
              idesta=19;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-OAX":
              idesta=20;
              map = "oaxLow";
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-PUE":
              map = "pueLow";
              idesta=21;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-QUE":
              map = "queLow";
              idesta=22;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-ROO":
              map = "rooLow";
              idesta=23;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-SIN":
              map = "sinLow";
              idesta=25;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-SLP":
              map = "slpLow";
              idesta=24;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-SON":
              map = "sonLow";
              idesta=26;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-TAB":
              map = "tabLow";
              idesta=27;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-TAM":
              map = "tamLow";
              idesta=28;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break; 
            case "MX-TLA":
              map = "tlaLow";
              idesta=29;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-VER":
              map = "verLow";
              idesta=30;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-YUC":
              map = "yucLow";
              idesta=31;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
            case "MX-ZAC":
              map = "zacLow";
              idesta=32;
              setMsjheader(data.name);
              setMsjheadermapa(data.name);
            break;
          }
          if (map) {
            ev.target.isHover = false;
            citiesSeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/region/mexico/" + map + ".json";
            citiesSeries.geodataSource.load();
            //back.show();
            setIdestado(idesta);
          }
        });
        ///boton del zoom     
        chart.zoomControl = new am4maps.ZoomControl();

        var homeButton = new am4core.Button();
        homeButton.events.on("hit", function() {
          //let reinicio=0;
          //let id_school_r=0;
          if(reseteo!=1){
            citiesSeries.show();
            setIdschool(schoolId);
          }else{
            stateSeries.show();
            citiesSeries.hide();
            setIdestado(stateId);
            setIdschool(schoolId);
            setMsjheader(msj);
            setMsjheadermapa(msj);
          }
          //await loadSchool();
          chart.goHome();
        });
        
        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.marginBottom = 10;
        homeButton.parent = chart.zoomControl;
        homeButton.insertBefore(chart.zoomControl.plusButton);        
        setLoading(false);   
  },[datamapa,schools]);

  return (
    <Loading loading={loading}>
        <Descriptions title={"Información "+msjheader}></Descriptions>
      <AlertInfo stateId={idestado} schoolId={idschool}/>
      <Row gutter={16}> 
        <ChartsHM stateId={idestado} schoolId={idschool}/>       
        <ChartsHMTitulo stateId={idestado} schoolId={idschool}/>
        <ChartsHMNuevo stateId={idestado} schoolId={idschool}/>
      </Row>
      <br/>
      <Row gutter={16}>
        <DashMapa name={"Mapa de Encuesta "+msjheadermapa} surveyCatalog={surveyTypeCatalog} setSurveyType={setSurveyType} survey={surveyType}  />
        <DashXy name={"Gráfica de Encuesta "+msjheader} stateId={idestado} schoolId={idschool} survey={surveyType}/>
      </Row>
    </Loading>
  );  
}


function DashMapa({name, surveyCatalog,setSurveyType,survey}){
  return (
    <Col className="gutter-row" {...colProps}>
      <Card title={name}>
        <SearchSelect dataset={surveyCatalog} onChange={setSurveyType} value={survey} />
        <div style={{ height: "400px",width: "100%"}} id="mapdiv"></div>
        <div id="info"></div>
      </Card>
    </Col>
    );
}

function DashXy({name, stateId, schoolId, survey}){
  return (
  <Col {...colProps}>
    <Card title={name} >
      <ChartsXY stateId={stateId} schoolId={schoolId} surveyType={survey}/>
    </Card>
  </Col>
  );
}


