import React, { useLayoutEffect, useEffect, useState } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/animated";
import { Loading } from "../../shared/components";
import DashboardService from "../../service/DashboardService";
// Create chart instance
export default function ChartsXY({ stateId,schoolId,surveyType }) {
  const [loading, setLoading] = useState(false);
  const [question4, setQuestion4] = useState([]);
  const [question41, setQuestion41] = useState([]);
  const [question42, setQuestion42] = useState([]);
  const [question43, setQuestion43] = useState([]);

  const [question44, setQuestion44] = useState([]);
  const [question444, setQuestion444] = useState([]);

  const [question45, setQuestion45] = useState([]);
  const [question455, setQuestion455] = useState([]);  
  let gender;
  let question;
  let question1;
  useEffect(() => {
    const getDato = async () => {
        setLoading(true);
        if(surveyType==1 || surveyType==3){
          question1="Estudios universitarios";
        }
        else if(surveyType==4 || surveyType==2){
          question1="Estudiar";
        }
        const response3 = await DashboardService.getQuestion4(question1, gender="M",stateId,schoolId,surveyType );
        const response4 = await DashboardService.getQuestion4(question1, gender="H",stateId,schoolId,surveyType);

        const response41 = await DashboardService.getQuestion4(question="Otra", gender="M",stateId,schoolId,surveyType);
        const response42 = await DashboardService.getQuestion4(question="Otra", gender="H",stateId,schoolId,surveyType);

        const response43 = await DashboardService.getQuestion4(question="Estudiar y Trabajar", gender="M",stateId,schoolId,surveyType);
        const response433 = await DashboardService.getQuestion4(question="Estudiar y Trabajar", gender="H",stateId,schoolId,surveyType);

        const response44 = await DashboardService.getQuestion4(question="Trabajar", gender="M",stateId,schoolId,surveyType);
        const response444 = await DashboardService.getQuestion4(question="Trabajar", gender="H",stateId,schoolId,surveyType);
        setLoading(false);
        if (!response41.success) return;
        setQuestion4(response3.question4);
        setQuestion41(response4.question4);

        setQuestion42(response41.question4);
        setQuestion43(response42.question4);

        setQuestion44(response43.question4);
        setQuestion444(response433.question4);

        setQuestion45(response44.question4);
        setQuestion455(response444.question4);
    };
    getDato();
  }, [stateId,schoolId,surveyType]);

  const dataset=[
    {
      activity: 'Estudiar',
      hombre: question41,
      mujer: question4,
    },
    {
      activity: 'Trabajar',
      hombre: question455,
      mujer: question45,      
    },
    {
      activity: 'Est. y Trab.',
      hombre: question444,
      mujer: question44,      
    },
    {
      activity: 'Otra',
      hombre: question43,
      mujer: question42,
    },        
  ];

  useLayoutEffect(() => {
    setLoading(true);
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_kelly);
      let chart = am4core.create("chartxydiv", am4charts.XYChart);
      chart.marginRight = 400;
      // Add data
      chart.data = dataset.map((row) => ({
        "actividad": row.activity,
        "hombre": row.hombre,
        "mujer": row.mujer,
      }));

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "actividad";
      categoryAxis.title.text = "Actividad";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      
      var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "Total de alumnos";  
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "hombre";
      series.dataFields.categoryX = "actividad";
      series.name = "Hombre";
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = true;

      let series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "mujer";
      series2.dataFields.categoryX = "actividad";
      series2.name = "Mujer";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;    

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      // Add a legend
      chart.legend = new am4charts.Legend();
      setLoading(false);   
  },[dataset]);

  return (
    <Loading loading={loading}>
      <div style={{ minHeight: "400px",width: "100%",marginLeft:"20px"}} id="chartxydiv"></div>
    </Loading>
  );  
}

