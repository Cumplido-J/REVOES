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
  const colProps2 = {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 8 },
  };  
export default function ChartsHM({stateId,schoolId}) {
    const [dataCertified, setDataCertified] = useState([]);
    useEffect(() => { 
        const getData = async () => {
            setLoading(true);
            const response = await DashboardService.getCertifiedByGenero(stateId,schoolId);
            setLoading(false);
            if (!response.success) return;
            setDataCertified(response.dataCertified[0]);
        }
        getData();
    },[stateId,schoolId]);


   const dataset=[
        {
            genero:"Hombre",
            value:dataCertified.tman
        },
        {
            genero:"Mujer",
            value:dataCertified.twoman
        }    
    ];
    const tot=(dataCertified.tman)+(dataCertified.twoman);
    const [loading, setLoading] = useState(false);  
    useLayoutEffect(() => {
        setLoading(true);
        am4core.useTheme(am4themes_animated);
        let chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data=dataset;
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
        setLoading(false);  
    },[dataCertified]);
    return (
        <Col {...colProps2}>
            <Card title={"Total de Certificados "+ tot}>
                <div style={{ height: "25vh",width: "100%"}} id="chartdiv"></div>
            </Card>
        </Col>
      );  
}
