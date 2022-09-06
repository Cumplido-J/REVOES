import React, { useLayoutEffect, useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Loading } from "../../shared/components";
import DashboardService from "../../service/DashboardService";
import {Card, Col} from "antd";

const colProps2 = {
  xs: { span: 24 },
  sm: { span: 16 },
  md: { span: 8 },
};   
export default function ChartsHMTitulo({stateId,schoolId}) {
  const [loading, setLoading] = useState(false);  
  const [dataDegreed, setDataDegreed] = useState([]);
  useEffect(() => {
      const getData = async () => {
          setLoading(true);
          const response = await DashboardService.getDegreedByGenero(stateId,schoolId);
          setLoading(false);
          if (!response.success) return;
          setDataDegreed(response.dataDegreed[0]);
      }
      getData();
  },[stateId,schoolId]);


 const dataset=[
      {
          genero:"Hombre",
          value:dataDegreed.tman
      },
      {
          genero:"Mujer",
          value:dataDegreed.twoman
      }    
  ];

    const tot=(dataDegreed.tman)+(dataDegreed.twoman);
    useLayoutEffect(() => {
        setLoading(true);
        am4core.useTheme(am4themes_animated);
        let chart = am4core.create("chartdiv3", am4charts.PieChart);
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
    },[dataset]);
    return (
        <Col {...colProps2}>
          <Card title={"Total de Titulados "+tot}>
            <div style={{ height: "25vh",width: "100%"}} id="chartdiv3"></div>
          </Card>
        </Col>
      );  
}
