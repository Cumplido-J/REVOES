import React, { useLayoutEffect, useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Loading } from "../../shared/components";
import DashboardService from "../../service/DashboardService";
import {Card, Col} from "antd";
const colProps = {
    xs: { span: 24 },
    sm: { span: 16 }, 
    md: { span: 8 },
  };
export default function ChartsHMNuevo({stateId,schoolId}) {
    const [loading, setLoading] = useState(false);  
    const [newgeneration, setNewgeneration] = useState([]);
    useEffect(() => {
      const getData = async () => {
        setLoading(true);
        const response = await DashboardService.getNewGeneration(stateId,schoolId);
        setLoading(false);
        if (!response.success) return;
        setNewgeneration(response.newgeneration[0]);
      };
      getData();
    }, [stateId,schoolId]); 

    const dataset=[
      {
          genero:"Hombre",
          value:newgeneration.thombre
      },
      {
          genero:"Mujer",
          value:newgeneration.tmujer
      }    
    ]  
    const tot=(newgeneration.thombre)+(newgeneration.tmujer);
    useLayoutEffect(() => {
        setLoading(true);
        am4core.useTheme(am4themes_animated);
        let chart = am4core.create("chartdiv1", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data=dataset;
        /*chart.data = [{
            country: "Hombres",
            value: 401
        },
        { 
            country: "Mujeres",
            value: 300
        },
        ];*/
        chart.radius = am4core.percent(70);
        chart.innerRadius = am4core.percent(45);//ancho
        chart.startAngle = 180;
        chart.endAngle = 360;  
        
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "genero";

        series.labels.template.disabled = true;
        series.ticks.template.disabled = true;

        series.slices.template.cornerRadius = 10;
        series.slices.template.innerCornerRadius = 7;
        series.slices.template.draggable = true;
        series.slices.template.inert = true;
        
        series.hiddenState.properties.startAngle = 90;
        series.hiddenState.properties.endAngle = 90;
        

        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        setLoading(false);  
    },[dataset]);
    return (
      <Col {...colProps}>
        <Card title={"Total de Nuevo Ingresos "+tot}>
          <div style={{ height: "25vh",width: "100%"}} id="chartdiv1"></div>
        </Card>
      </Col>
      );  
}
