import React, { useLayoutEffect, useState } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { Loading } from "../../shared/components";

export default function SurveyReportCountryChart({ dataset }) {
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    setLoading(true);
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("divChart", am4charts.XYChart);
    chart.data = dataset.map((row) => ({
      category: row.stateName,
      notAnswered: (100 - row.percentage).toFixed(2),
      answered: row.percentage.toFixed(2),
    }));
    let title = chart.titles.push(new am4core.Label());
    title.text = "Encuestas contestadas por estado";
    title.fontSize = 25;
    title.marginBottom = 15;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.axisFills.template.disabled = false;
    categoryAxis.renderer.axisFills.template.fillOpacity = 0.05;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.renderer.ticks.template.length = 5;
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
    });

    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";

    chart.numberFormatter.numberFormat = "#.#s";

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.filePrefix = "EncuestaEgresados";
    chart.exporting.menu.items = [
      {
        label: "...",
        menu: [
          { type: "png", label: "PNG" },
          { type: "pdf", label: "PDF" },
          { type: "print", label: "Imprimir" },
        ],
      },
    ];

    function createSeries(field, name, color) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "category";
      series.stacked = true;
      series.name = name;
      series.stroke = color;
      series.fill = color;

      let label = series.bullets.push(new am4charts.LabelBullet());
      label.label.text = "{valueX}%";
      label.label.fill = am4core.color("#fff");
      label.label.strokeWidth = 0;
      label.label.truncate = false;
      label.label.hideOversized = true;
      label.locationX = 0.5;
      return series;
    }

    let interfaceColors = new am4core.InterfaceColorSet();
    let positiveColor = interfaceColors.getFor("positive");
    let negativeColor = interfaceColors.getFor("negative");

    createSeries("notAnswered", "No contestó", negativeColor);
    createSeries("answered", "Contestó", positiveColor);
    setLoading(false);

    return () => {
      chart.dispose();
    };
  }, [dataset]);

  return (
    <Loading loading={loading}>
      <div style={{ minHeight: "1200px" }} id="divChart"></div>
    </Loading>
  );
}
