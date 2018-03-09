import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { position } from 'tether';
import { ServiceProvider } from '../../providers/service/service';
import * as moment from 'moment';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-analysis',
  templateUrl: 'analysis.html',
})

export class AnalysisPage {
  selectTypeValue;
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  data;
  selectSegment;
  length: boolean;
  moreFiveMinValue: boolean = false;
  lessFiveMinValue: boolean = false;
  moreThirtyMinValue: boolean = false;
  lessThirtyMinValue: boolean = false;
  trendReport =[];

  constructor(private translate: TranslateService, private screenOrientation: ScreenOrientation, public service: ServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    /*Get episode */
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.selectSegment = '3M';
    this.selectTypeValue = 'Chart';
    var languageValue = localStorage.getItem('Launguage');
    translate.setDefaultLang(languageValue);
    translate.use(languageValue);
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var firstMonthValueOfYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var firstMonthValueDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueDate = moment().subtract(2, 'months').format('DD');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var thirdMonthValueYear = moment().subtract(2, 'months').format('YYYY');
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          console.log("thirdMonthValueYear", thirdMonthValueYear, yearValue);
          console.log("firstMonthValueofMonth", firstMonthValueofMonth, monthValue)
          if (firstMonthValueOfYear === yearValue || thirdMonthValueYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
            }
          }
        }

        this.data = {
          labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [{
            label: "< 5 M",
            backgroundColor: "#2d7e9c",
            data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 5 M",
            backgroundColor: "#fe0000",
            data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }, {
            label: "< 30 M",
            backgroundColor: "#9833fd",
            data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 30 M",
            backgroundColor: "#007e00",
            data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }]
        }

        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        var maxValue = Math.max.apply(Math, arr);

        this.getChart(maxValue);
      } else {
        this.length = false;
      }
    })
  }

  ionViewDidLoad() {
    var dateTo = moment().format('YYYY-MM-DD');
    var dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD');
  }

  getChart(value) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: this.data,
      showTooltips: false,
      options: {
        barValueSpacing: 20,
        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
            });
          }
        },
        legend: {
          display: false,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              // labelString: 'Feb-2018'
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              stepSize: parseInt(value) + 1,
            },
            position: 'bottom'
          }]
        }
      }
    })
    document.getElementById('legend').innerHTML = this.barChart.generateLegend();
  }

  getEvent(event) {
    if (event.target.textContent === '> 30 M') {
      if (!this.moreThirtyMinValue) {
        this.moreThirtyMinValue = true;
        var value = event.target.style;
        value['text-decoration'] = 'line-through';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.moreThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.moreThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.moreThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.moreThirtyMinValue, event.target.textContent)
        }
        //this.setChart(this.moreThirtyMinValue, event.target.textContent);
      } else if (this.moreThirtyMinValue) {
        this.moreThirtyMinValue = false;
        var valueOne = event.target.style;
        valueOne['text-decoration'] = 'none';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.moreThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.moreThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.moreThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.moreThirtyMinValue, event.target.textContent)
        }
        // this.setChart(this.moreThirtyMinValue, event.target.textContent)
      }
    } else if (event.target.textContent === '< 30 M') {
      if (!this.lessThirtyMinValue) {
        this.lessThirtyMinValue = true;
        var valueTwo = event.target.style;
        valueTwo['text-decoration'] = 'line-through';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.lessThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.lessThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.lessThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.lessThirtyMinValue, event.target.textContent)
        }
        //this.setChart(this.lessThirtyMinValue, event.target.textContent)
      } else if (this.lessThirtyMinValue) {
        this.lessThirtyMinValue = false;
        var valueTwoOne = event.target.style;
        valueTwoOne['text-decoration'] = 'none';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.lessThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.lessThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.lessThirtyMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.lessThirtyMinValue, event.target.textContent)
        }
        //this.setChart(this.lessThirtyMinValue, event.target.textContent)
      }
    } else if (event.target.textContent === '> 5 M') {
      if (!this.moreFiveMinValue) {
        this.moreFiveMinValue = true;
        var valueThree = event.target.style;
        valueThree['text-decoration'] = 'line-through';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.moreFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.moreFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.moreFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.moreFiveMinValue, event.target.textContent)
        }
        //this.setChart(this.moreFiveMinValue, event.target.textContent)
      } else if (this.moreFiveMinValue) {
        this.moreFiveMinValue = false;
        var valueThreeOne = event.target.style;
        valueThreeOne['text-decoration'] = 'none';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.moreFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.moreFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.moreFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.moreFiveMinValue, event.target.textContent)
        }
        // this.setChart(this.moreFiveMinValue, event.target.textContent)
      }
    } else if (event.target.textContent === '< 5 M') {
      if (!this.lessFiveMinValue) {
        this.lessFiveMinValue = true;
        var valueFour = event.target.style;
        valueFour['text-decoration'] = 'line-through';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.lessFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.lessFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.lessFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.lessFiveMinValue, event.target.textContent)
        }
        //this.setChartwithThreeMonths(this.lessFiveMinValue, event.target.textContent)
      } else if (this.lessFiveMinValue) {
        this.lessFiveMinValue = false;
        var valueFourOne = event.target.style;
        valueFourOne['text-decoration'] = 'none';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.lessFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.lessFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.lessFiveMinValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.lessFiveMinValue, event.target.textContent)
        }
        //this.setChart(this.lessFiveMinValue, event.target.textContent)
      }
    }
  }

  setChartWithTweleveMonths(min, minValue) {
    this.service.getEpisode().then(data => {
      console.log("EPISODES DATA", data);
      var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
      var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
      var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
      var fourthMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
      var fiveMonthValue = moment().subtract(4, 'months').format('MMM-YYYY');
      var sixMonthValue = moment().subtract(5, 'months').format('MMM-YYYY');
      var sevenMonthValue = moment().subtract(6, 'months').format('MMM-YYYY');
      var eightMonthValue = moment().subtract(7, 'months').format('MMM-YYYY');
      var nineMonthValue = moment().subtract(8, 'months').format('MMM-YYYY');
      var tenMonthValue = moment().subtract(9, 'months').format('MMM-YYYY');
      var elevenMonthValue = moment().subtract(10, 'months').format('MMM-YYYY');
      var tweleveMonthValue = moment().subtract(11, 'months').format('MMM-YYYY');

      /*Calculate Month */
      var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
      var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
      var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
      var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
      var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
      var fourthMonthValueofMonth = moment().subtract(3, 'months').format('MM');
      var fiveMonthValueofMonth = moment().subtract(4, 'months').format('MM');
      var sixMonthValueofMonth = moment().subtract(5, 'months').format('MM');
      var sevenMonthValueofMonth = moment().subtract(6, 'months').format('MM');
      var eightMonthValueofMonth = moment().subtract(7, 'months').format('MM');
      var nineMonthValueofMonth = moment().subtract(8, 'months').format('MM');
      var tenMonthValueofMonth = moment().subtract(9, 'months').format('MM');;
      var elevenMonthValueofMonth = moment().subtract(10, 'months').format('MM');
      var tweleveMonthValueofMonth = moment().subtract(11, 'months').format('MM');
      var tweleveMonthValueofYear = moment().subtract(11, 'months').format('YYYY');
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        let fourMonthMoreFiveMinCount = 0;
        let fourMonthLessFiveMinCount = 0;
        let fourMonthMoreThirtyMinCount = 0;
        let fourMonthLessThirtyMinCount = 0;

        let fiveMonthMoreFiveMinCount = 0;
        let fiveMonthLessFiveMinCount = 0;
        let fiveMonthMoreThirtyMinCount = 0;
        let fiveMonthLessThirtyMinCount = 0;

        let sixMonthMoreFiveMinCount = 0;
        let sixMonthLessFiveMinCount = 0;
        let sixMonthMoreThirtyMinCount = 0;
        let sixMonthLessThirtyMinCount = 0;

        let sevenMonthMoreFiveMinCount = 0;
        let sevenMonthLessFiveMinCount = 0;
        let sevenMonthMoreThirtyMinCount = 0;
        let sevenMonthLessThirtyMinCount = 0;

        let eigthMonthMoreFiveMinCount = 0;
        let eigthMonthLessFiveMinCount = 0;
        let eigthMonthMoreThirtyMinCount = 0;
        let eigthMonthLessThirtyMinCount = 0;

        let nineMonthMoreFiveMinCount = 0;
        let nineMonthLessFiveMinCount = 0;
        let nineMonthMoreThirtyMinCount = 0;
        let nineMonthLessThirtyMinCount = 0;

        let tenMonthMoreFiveMinCount = 0;
        let tenMonthLessFiveMinCount = 0;
        let tenMonthMoreThirtyMinCount = 0;
        let tenMonthLessThirtyMinCount = 0;

        let elevenMonthMoreFiveMinCount = 0;
        let elevenMonthLessFiveMinCount = 0;
        let elevenMonthMoreThirtyMinCount = 0;
        let elevenMonthLessThirtyMinCount = 0;

        let tweleveMonthMoreFiveMinCount = 0;
        let tweleveMonthLessFiveMinCount = 0;
        let tweleveMonthMoreThirtyMinCount = 0;
        let tweleveMonthLessThirtyMinCount = 0;


        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || tweleveMonthValueofYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate fourth month */
            if (fourthMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fourMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fourMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fourMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fourMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate fifth month */
            if (fiveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fiveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fiveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fiveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fiveMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate sixth month */
            if (sixMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sixMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sixMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sixMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sixMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate seventh month */
            if (sevenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sevenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sevenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sevenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sevenMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate eighth month */
            if (eightMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                eigthMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                eigthMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                eigthMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                eigthMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate nineth month */
            if (nineMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                nineMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                nineMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                nineMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                nineMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate 10th month */
            if (tenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                tenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                tenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                tenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                tenMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate eleven month */
            if (elevenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                elevenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                elevenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                elevenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                elevenMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate 12th month */
            if (tweleveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                tweleveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                tweleveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                tweleveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                tweleveMonthLessThirtyMinCount += 1;
              }
            }
          }
        }
        //More Five Minute Value
        if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          console.log("data", this.lessFiveMinValue, this.moreFiveMinValue, this.moreThirtyMinValue, this.lessThirtyMinValue)
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "< 5 M",
              backgroundColor: "#2d7e9c",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#fe0000",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#9833fd",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#007e00",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
          }
          this.setChartanother();
        }
      }
    })
    //})
  }

  setChartwithNineMonths(min, minValue) {
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var fourthMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
    var fiveMonthValue = moment().subtract(4, 'months').format('MMM-YYYY');
    var sixMonthValue = moment().subtract(5, 'months').format('MMM-YYYY');
    var sevenMonthValue = moment().subtract(6, 'months').format('MMM-YYYY');
    var eightMonthValue = moment().subtract(7, 'months').format('MMM-YYYY');
    var nineMonthValue = moment().subtract(8, 'months').format('MMM-YYYY');
    var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var fourthMonthValueofMonth = moment().subtract(3, 'months').format('MM');
    var fiveMonthValueofMonth = moment().subtract(4, 'months').format('MM');
    var sixMonthValueofMonth = moment().subtract(5, 'months').format('MM');
    var sevenMonthValueofMonth = moment().subtract(6, 'months').format('MM');
    var eightMonthValueofMonth = moment().subtract(7, 'months').format('MM');
    var nineMonthValueofMonth = moment().subtract(8, 'months').format('MM');
    var nineMonthValueofDate = moment().subtract(8, 'months').format('DD');
    var nineMonthValueofYear = moment().subtract(8, 'months').format('YY');
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        let fourMonthMoreFiveMinCount = 0;
        let fourMonthLessFiveMinCount = 0;
        let fourMonthMoreThirtyMinCount = 0;
        let fourMonthLessThirtyMinCount = 0;

        let fiveMonthMoreFiveMinCount = 0;
        let fiveMonthLessFiveMinCount = 0;
        let fiveMonthMoreThirtyMinCount = 0;
        let fiveMonthLessThirtyMinCount = 0;

        let sixMonthMoreFiveMinCount = 0;
        let sixMonthLessFiveMinCount = 0;
        let sixMonthMoreThirtyMinCount = 0;
        let sixMonthLessThirtyMinCount = 0;

        let sevenMonthMoreFiveMinCount = 0;
        let sevenMonthLessFiveMinCount = 0;
        let sevenMonthMoreThirtyMinCount = 0;
        let sevenMonthLessThirtyMinCount = 0;

        let eigthMonthMoreFiveMinCount = 0;
        let eigthMonthLessFiveMinCount = 0;
        let eigthMonthMoreThirtyMinCount = 0;
        let eigthMonthLessThirtyMinCount = 0;

        let nineMonthMoreFiveMinCount = 0;
        let nineMonthLessFiveMinCount = 0;
        let nineMonthMoreThirtyMinCount = 0;
        let nineMonthLessThirtyMinCount = 0;

        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || nineMonthValueofYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate fourth month */
            if (fourthMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fourMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fourMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fourMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fourMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate fifth month */
            if (fiveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fiveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fiveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fiveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fiveMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate sixth month */
            if (sixMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sixMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sixMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sixMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sixMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate seventh month */
            if (sevenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sevenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sevenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sevenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sevenMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate eighth month */
            if (eightMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                eigthMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                eigthMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                eigthMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                eigthMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate nineth month */
            if (nineMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                nineMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                nineMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                nineMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                nineMonthLessThirtyMinCount += 1;
              }
            }

            //More Five Minute Value
            if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount, eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              console.log("data", this.lessFiveMinValue, this.moreFiveMinValue, this.moreThirtyMinValue, this.lessThirtyMinValue)
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [nineMonthLessThirtyMinCount,
                    eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [nineMonthMoreThirtyMinCount,
                    eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [nineMonthLessFiveMinCount,
                    eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [nineMonthMoreFiveMinCount,
                    eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue
                  , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            }
          }
        }
      }
    })
  }

  setChartwithSixMonths(min, minValue) {
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var fourthMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
    var fiveMonthValue = moment().subtract(4, 'months').format('MMM-YYYY');
    var sixMonthValue = moment().subtract(5, 'months').format('MMM-YYYY');

    var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var fourthMonthValueofMonth = moment().subtract(3, 'months').format('MM');
    var fiveMonthValueofMonth = moment().subtract(4, 'months').format('MM');
    var sixMonthValueofMonth = moment().subtract(5, 'months').format('MM');
    var sixMonthValueofyear = moment().subtract(5, 'months').format('YYYY');
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        let fourMonthMoreFiveMinCount = 0;
        let fourMonthLessFiveMinCount = 0;
        let fourMonthMoreThirtyMinCount = 0;
        let fourMonthLessThirtyMinCount = 0;

        let fiveMonthMoreFiveMinCount = 0;
        let fiveMonthLessFiveMinCount = 0;
        let fiveMonthMoreThirtyMinCount = 0;
        let fiveMonthLessThirtyMinCount = 0;

        let sixMonthMoreFiveMinCount = 0;
        let sixMonthLessFiveMinCount = 0;
        let sixMonthMoreThirtyMinCount = 0;
        let sixMonthLessThirtyMinCount = 0;


        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || sixMonthValueofyear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate fourth month */
            if (fourthMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fourMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fourMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fourMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fourMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate fifth month */
            if (fiveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fiveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fiveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fiveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fiveMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate sixth month */
            if (sixMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sixMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sixMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sixMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sixMonthLessThirtyMinCount += 1;
              }
            }

            //More Five Minute Value
            if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              console.log("data", this.lessFiveMinValue, this.moreFiveMinValue, this.moreThirtyMinValue, this.lessThirtyMinValue)
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                    fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                    fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0, 0, 0, 0]
                }]
              }
              this.setChartanother();
            }
          }
        }
      }
    })
  }

  setChartwithThreeMonths(min, minValue) {
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');

    var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var thirdMonthValueofyear = moment().subtract(2, 'months').format('YYYY');
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;


        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || thirdMonthValueofyear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
            }

            //More Five Minute Value
            if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              console.log("data", this.lessFiveMinValue, this.moreFiveMinValue, this.moreThirtyMinValue, this.lessThirtyMinValue)
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && !this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && !this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0, 0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (!this.lessFiveMinValue && !this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            } else if (this.lessFiveMinValue && this.moreFiveMinValue && this.moreThirtyMinValue && this.lessThirtyMinValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [{
                  label: "< 5 M",
                  backgroundColor: "#2d7e9c",
                  data: [0, 0, 0]
                }, {
                  label: "> 5 M",
                  backgroundColor: "#fe0000",
                  data: [0, 0, 0]
                }, {
                  label: "< 30 M",
                  backgroundColor: "#9833fd",
                  data: [0, 0, 0]
                }, {
                  label: "> 30 M",
                  backgroundColor: "#007e00",
                  data: [0, 0, 0]
                }]
              }
              this.setChartanother();
            }
          }
        }
      }
    })
  }

  setChartanother() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: this.data,
      showTooltips: false,
      options: {
        barValueSpacing: 20,
        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
            });
          }
        },
        legend: {
          display: false,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              // labelString: 'Feb-2018'
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              stepSize: 2,
            },
            position: 'bottom'
          }]
        }
      }
    })
  }

  segmentChanged(event) {
    this.selectSegment = event;
    let scope = this;

    var firstMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
    if (this.selectSegment === '3M') {
      this.threemonths();
    } else if (this.selectSegment === '6M') {
      this.sixmonths();
    } else if (this.selectSegment === '9M') {
      this.nineMonths();
    } else if (this.selectSegment === '12M') {
      this.tweleveMonths();
    }
    // setTimeout(function () { scope.getChart(); }, 500);
    // this.service.getEpisode().then(data => {
    //   console.log("EPISODES",data);
    //   for(var i in data){
    //     console.log("data[i]",moment(data[i].date).format())
    //   }
    // })  

  }

  getChartValue() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: this.data,
      showTooltips: false,
      options: {
        barValueSpacing: 20,
        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
            });
          }
        },
        legend: {
          display: false,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Feb-2018'
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              stepSize: 2,
            },
            position: 'bottom'
          }]
        }
      }
    })
    document.getElementById('legend').innerHTML = this.barChart.generateLegend();
  }

  threemonths() {
    this.trendReport=[];
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var firstMonthValueOfYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var firstMonthValueDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueDate = moment().subtract(2, 'months').format('DD');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var thirdMonthValueYear = moment().subtract(2, 'months').format('YYYY');
    let first =moment().subtract(0, 'months').format('MMM YYYY');
    let second =moment().subtract(1, 'months').format('MMM YYYY');
    let third =moment().subtract(2, 'months').format('MMM YYYY');
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValueOfYear === yearValue || thirdMonthValueYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }

              this.trendReport.push({
                'date':first,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':first,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':second,
                '>5M' :secondMonthMoreFiveMinCount,
                '<5M' :secondMonthLessFiveMinCount,
                '>30M':secondMonthMoreThirtyMinCount,
                '<30M':secondMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':second,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':third,
                '>5M' :thirdMonthMoreFiveMinCount,
                '<5M' :thirdMonthLessFiveMinCount,
                '>30M':thirdMonthMoreThirtyMinCount,
                '<30M':thirdMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':third,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }
          }
        }

        this.data = {
          labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [{
            label: "< 5 M",
            backgroundColor: "#2d7e9c",
            data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 5 M",
            backgroundColor: "#fe0000",
            data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }, {
            label: "< 30 M",
            backgroundColor: "#9833fd",
            data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 30 M",
            backgroundColor: "#007e00",
            data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }]
        }
        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        var maxValue = Math.max.apply(Math, arr);
        if(this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
    })
  }

  sixmonths() {
    this.trendReport=[];
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var fourthMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
    var fiveMonthValue = moment().subtract(4, 'months').format('MMM-YYYY');
    var sixMonthValue = moment().subtract(5, 'months').format('MMM-YYYY');
    var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var fourthMonthValueofMonth = moment().subtract(3, 'months').format('MM');
    var fiveMonthValueofMonth = moment().subtract(4, 'months').format('MM');
    var sixMonthValueofMonth = moment().subtract(5, 'months').format('MM');
    var sixMonthValueofDate = moment().subtract(5, 'months').format('DD');
    var sixMonthValueofYear = moment().subtract(5, 'months').format('YYYY');
    let first =moment().subtract(0, 'months').format('MMM YYYY');
    let second =moment().subtract(1, 'months').format('MMM YYYY');
    let third =moment().subtract(2, 'months').format('MMM YYYY');
    let four =moment().subtract(3, 'months').format('MMM YYYY');
    let five =moment().subtract(4, 'months').format('MMM YYYY');
    let six =moment().subtract(5, 'months').format('MMM YYYY');
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        let fourMonthMoreFiveMinCount = 0;
        let fourMonthLessFiveMinCount = 0;
        let fourMonthMoreThirtyMinCount = 0;
        let fourMonthLessThirtyMinCount = 0;

        let fiveMonthMoreFiveMinCount = 0;
        let fiveMonthLessFiveMinCount = 0;
        let fiveMonthMoreThirtyMinCount = 0;
        let fiveMonthLessThirtyMinCount = 0;

        let sixMonthMoreFiveMinCount = 0;
        let sixMonthLessFiveMinCount = 0;
        let sixMonthMoreThirtyMinCount = 0;
        let sixMonthLessThirtyMinCount = 0;

        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || sixMonthValueofYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':first,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':first,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':second,
                'morefive' :secondMonthMoreFiveMinCount,
                'lessfive' :secondMonthLessFiveMinCount,
                'morethirty':secondMonthMoreThirtyMinCount,
                'lessthirty':secondMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':second,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':third,
                'morefive' :thirdMonthMoreFiveMinCount,
                'lessfive' :thirdMonthLessFiveMinCount,
                'morethirty':thirdMonthMoreThirtyMinCount,
                'lessthirty':thirdMonthLessThirtyMinCount
              })
            }  else {
              this.trendReport.push({
                'date':third,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }

            /*calculate fourth month */
            if (fourthMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fourMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fourMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fourMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fourMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':four,
                'morefive' :fourMonthMoreFiveMinCount,
                'lessfive' :fourMonthLessFiveMinCount,
                'morethirty':fourMonthMoreThirtyMinCount,
                'lessthirty':fourMonthLessThirtyMinCount
              })
            }  else {
              this.trendReport.push({
                'date':four,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }
            /*calculate fifth month */
            if (fiveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fiveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fiveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fiveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fiveMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':five,
                'morefive' :fiveMonthMoreFiveMinCount,
                'lessfive' :fiveMonthLessFiveMinCount,
                'morethirty':fiveMonthMoreThirtyMinCount,
                'lessthirty':fiveMonthLessThirtyMinCount
              })
            }  else {
              this.trendReport.push({
                'date':five,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }
            /*calculate sixth month */
            if (sixMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sixMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sixMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sixMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sixMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':six,
                'morefive' :sixMonthMoreFiveMinCount,
                'lessfive' :sixMonthLessFiveMinCount,
                'morethirty':sixMonthMoreThirtyMinCount,
                'lessthirty':sixMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':six,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            }
          }
        }

        this.data = {
          labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [{
            label: "< 5 M",
            backgroundColor: "#2d7e9c",
            data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
              fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 5 M",
            backgroundColor: "#fe0000",
            data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount, fourMonthMoreFiveMinCount,
              thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }, {
            label: "< 30 M",
            backgroundColor: "#9833fd",
            data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount, fourMonthLessFiveMinCount,
              thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 30 M",
            backgroundColor: "#007e00",
            data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
              fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }]
        }
        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        var maxValue = Math.max.apply(Math, arr);
        if(this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
    })
  }

  nineMonths() {
    this.trendReport=[];
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var fourthMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
    var fiveMonthValue = moment().subtract(4, 'months').format('MMM-YYYY');
    var sixMonthValue = moment().subtract(5, 'months').format('MMM-YYYY');
    var sevenMonthValue = moment().subtract(6, 'months').format('MMM-YYYY');
    var eightMonthValue = moment().subtract(7, 'months').format('MMM-YYYY');
    var nineMonthValue = moment().subtract(8, 'months').format('MMM-YYYY');
    var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var fourthMonthValueofMonth = moment().subtract(3, 'months').format('MM');
    var fiveMonthValueofMonth = moment().subtract(4, 'months').format('MM');
    var sixMonthValueofMonth = moment().subtract(5, 'months').format('MM');
    var sevenMonthValueofMonth = moment().subtract(6, 'months').format('MM');
    var eightMonthValueofMonth = moment().subtract(7, 'months').format('MM');
    var nineMonthValueofMonth = moment().subtract(8, 'months').format('MM');
    var nineMonthValueofDate = moment().subtract(8, 'months').format('DD');
    var nineMonthValueofYear = moment().subtract(8, 'months').format('YY');
    let first =moment().subtract(0, 'months').format('MMM YYYY');
    let second =moment().subtract(1, 'months').format('MMM YYYY');
    let third =moment().subtract(2, 'months').format('MMM YYYY');
    let four =moment().subtract(3, 'months').format('MMM YYYY');
    let five =moment().subtract(4, 'months').format('MMM YYYY');
    let six =moment().subtract(5, 'months').format('MMM YYYY');
    let seven =moment().subtract(6, 'months').format('MMM YYYY');
    let eight =moment().subtract(7, 'months').format('MMM YYYY');
    let nine =moment().subtract(8, 'months').format('MMM YYYY');

    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        let fourMonthMoreFiveMinCount = 0;
        let fourMonthLessFiveMinCount = 0;
        let fourMonthMoreThirtyMinCount = 0;
        let fourMonthLessThirtyMinCount = 0;

        let fiveMonthMoreFiveMinCount = 0;
        let fiveMonthLessFiveMinCount = 0;
        let fiveMonthMoreThirtyMinCount = 0;
        let fiveMonthLessThirtyMinCount = 0;

        let sixMonthMoreFiveMinCount = 0;
        let sixMonthLessFiveMinCount = 0;
        let sixMonthMoreThirtyMinCount = 0;
        let sixMonthLessThirtyMinCount = 0;

        let sevenMonthMoreFiveMinCount = 0;
        let sevenMonthLessFiveMinCount = 0;
        let sevenMonthMoreThirtyMinCount = 0;
        let sevenMonthLessThirtyMinCount = 0;

        let eigthMonthMoreFiveMinCount = 0;
        let eigthMonthLessFiveMinCount = 0;
        let eigthMonthMoreThirtyMinCount = 0;
        let eigthMonthLessThirtyMinCount = 0;

        let nineMonthMoreFiveMinCount = 0;
        let nineMonthLessFiveMinCount = 0;
        let nineMonthMoreThirtyMinCount = 0;
        let nineMonthLessThirtyMinCount = 0;

        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || nineMonthValueofYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':first,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':first,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':second,
                'morefive' :secondMonthMoreFiveMinCount,
                'lessfive' :secondMonthLessFiveMinCount,
                'morethirty':secondMonthMoreThirtyMinCount,
                'lessthirty':secondMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':second,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':third,
                'morefive' :thirdMonthMoreFiveMinCount,
                'lessfive' :thirdMonthLessFiveMinCount,
                'morethirty':thirdMonthMoreThirtyMinCount,
                'lessthirty':thirdMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':third,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }

            /*calculate fourth month */
            if (fourthMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fourMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fourMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fourMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fourMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':four,
                'morefive' :fourMonthMoreFiveMinCount,
                'lessfive' :fourMonthLessFiveMinCount,
                'morethirty':fourMonthMoreThirtyMinCount,
                'lessthirty':fourMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':four,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate fifth month */
            if (fiveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fiveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fiveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fiveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fiveMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':five,
                'morefive' :fiveMonthMoreFiveMinCount,
                'lessfive' :fiveMonthLessFiveMinCount,
                'morethirty':fiveMonthMoreThirtyMinCount,
                'lessthirty':fiveMonthLessThirtyMinCount
              })
            }  else {
              this.trendReport.push({
                'date':five,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate sixth month */
            if (sixMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sixMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sixMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sixMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sixMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':six,
                'morefive' :sixMonthMoreFiveMinCount,
                'lessfive' :sixMonthLessFiveMinCount,
                'morethirty':sixMonthMoreThirtyMinCount,
                'lessthirty':sixMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':six,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate seventh month */
            if (sevenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sevenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sevenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sevenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sevenMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':seven,
                'morefive' :sevenMonthMoreFiveMinCount,
                'lessfive' :sevenMonthLessFiveMinCount,
                'morethirty':sevenMonthMoreThirtyMinCount,
                'lessthirty':sevenMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':seven,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate eighth month */
            if (eightMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                eigthMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                eigthMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                eigthMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                eigthMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':eight,
                'morefive' :eigthMonthMoreFiveMinCount,
                'lessfive' :eigthMonthLessFiveMinCount,
                'morethirty':eigthMonthMoreThirtyMinCount,
                'lessthirty':eigthMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':eight,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate nineth month */
            if (nineMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                nineMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                nineMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                nineMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                nineMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':nine,
                'morefive' :nineMonthMoreFiveMinCount,
                'lessfive' :nineMonthLessFiveMinCount,
                'morethirty':nineMonthMoreThirtyMinCount,
                'lessthirty':nineMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':nine,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
          }
        }

        this.data = {
          labels: [nineMonthValue, eightMonthValue
            , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [{
            label: "< 5 M",
            backgroundColor: "#2d7e9c",
            data: [nineMonthLessFiveMinCount, eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
              fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 5 M",
            backgroundColor: "#fe0000",
            data: [nineMonthMoreFiveMinCount, eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
              fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }, {
            label: "< 30 M",
            backgroundColor: "#9833fd",
            data: [nineMonthLessThirtyMinCount, eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
              fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 30 M",
            backgroundColor: "#007e00",
            data: [nineMonthMoreThirtyMinCount, eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
              fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }]
        }
        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        var maxValue = Math.max.apply(Math, arr);
        if(this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
    })
  }

  tweleveMonths() {
    this.trendReport=[];
    var firstMonthValue = moment().subtract(0, 'months').format('MMM-YYYY');
    var secondMonthValue = moment().subtract(1, 'months').format('MMM-YYYY');
    var thirdMonthValue = moment().subtract(2, 'months').format('MMM-YYYY');
    var fourthMonthValue = moment().subtract(3, 'months').format('MMM-YYYY');
    var fiveMonthValue = moment().subtract(4, 'months').format('MMM-YYYY');
    var sixMonthValue = moment().subtract(5, 'months').format('MMM-YYYY');
    var sevenMonthValue = moment().subtract(6, 'months').format('MMM-YYYY');
    var eightMonthValue = moment().subtract(7, 'months').format('MMM-YYYY');
    var nineMonthValue = moment().subtract(8, 'months').format('MMM-YYYY');
    var tenMonthValue = moment().subtract(9, 'months').format('MMM-YYYY');
    var elevenMonthValue = moment().subtract(10, 'months').format('MMM-YYYY');
    var tweleveMonthValue = moment().subtract(11, 'months').format('MMM-YYYY');

    /*Calculate Month */
    var firstMonthValueofDate = moment().subtract(0, 'months').format('DD');
    var firstMonthValueofMonth = moment().subtract(0, 'months').format('MM');
    var firstMonthValuofYear = moment().subtract(0, 'months').format('YYYY');
    var secondMonthValuofMonth = moment().subtract(1, 'months').format('MM');
    var thirdMonthValueofMonth = moment().subtract(2, 'months').format('MM');
    var fourthMonthValueofMonth = moment().subtract(3, 'months').format('MM');
    var fiveMonthValueofMonth = moment().subtract(4, 'months').format('MM');
    var sixMonthValueofMonth = moment().subtract(5, 'months').format('MM');
    var sevenMonthValueofMonth = moment().subtract(6, 'months').format('MM');
    var eightMonthValueofMonth = moment().subtract(7, 'months').format('MM');
    var nineMonthValueofMonth = moment().subtract(8, 'months').format('MM');
    var tenMonthValueofMonth = moment().subtract(9, 'months').format('MM');;
    var elevenMonthValueofMonth = moment().subtract(10, 'months').format('MM');
    var tweleveMonthValueofMonth = moment().subtract(11, 'months').format('MM');
    var tweleveMonthValueofYear = moment().subtract(11, 'months').format('YYYY');
    
    let first =moment().subtract(0, 'months').format('MMM YYYY');
    let second =moment().subtract(1, 'months').format('MMM YYYY');
    let third =moment().subtract(2, 'months').format('MMM YYYY');
    let four =moment().subtract(3, 'months').format('MMM YYYY');
    let five =moment().subtract(4, 'months').format('MMM YYYY');
    let six =moment().subtract(5, 'months').format('MMM YYYY');
    let seven =moment().subtract(6, 'months').format('MMM YYYY');
    let eight =moment().subtract(7, 'months').format('MMM YYYY');
    let nine =moment().subtract(8, 'months').format('MMM YYYY');
    let ten =moment().subtract(9,'months').format('MMM YYYY');
    let eleven =moment().subtract(10,'months').format('MMM YYYY');
    let twelve  =moment().subtract(11,'months').format('MMM YYYY');

    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;

        let fourMonthMoreFiveMinCount = 0;
        let fourMonthLessFiveMinCount = 0;
        let fourMonthMoreThirtyMinCount = 0;
        let fourMonthLessThirtyMinCount = 0;

        let fiveMonthMoreFiveMinCount = 0;
        let fiveMonthLessFiveMinCount = 0;
        let fiveMonthMoreThirtyMinCount = 0;
        let fiveMonthLessThirtyMinCount = 0;

        let sixMonthMoreFiveMinCount = 0;
        let sixMonthLessFiveMinCount = 0;
        let sixMonthMoreThirtyMinCount = 0;
        let sixMonthLessThirtyMinCount = 0;

        let sevenMonthMoreFiveMinCount = 0;
        let sevenMonthLessFiveMinCount = 0;
        let sevenMonthMoreThirtyMinCount = 0;
        let sevenMonthLessThirtyMinCount = 0;

        let eigthMonthMoreFiveMinCount = 0;
        let eigthMonthLessFiveMinCount = 0;
        let eigthMonthMoreThirtyMinCount = 0;
        let eigthMonthLessThirtyMinCount = 0;

        let nineMonthMoreFiveMinCount = 0;
        let nineMonthLessFiveMinCount = 0;
        let nineMonthMoreThirtyMinCount = 0;
        let nineMonthLessThirtyMinCount = 0;

        let tenMonthMoreFiveMinCount = 0;
        let tenMonthLessFiveMinCount = 0;
        let tenMonthMoreThirtyMinCount = 0;
        let tenMonthLessThirtyMinCount = 0;

        let elevenMonthMoreFiveMinCount = 0;
        let elevenMonthLessFiveMinCount = 0;
        let elevenMonthMoreThirtyMinCount = 0;
        let elevenMonthLessThirtyMinCount = 0;

        let tweleveMonthMoreFiveMinCount = 0;
        let tweleveMonthLessFiveMinCount = 0;
        let tweleveMonthMoreThirtyMinCount = 0;
        let tweleveMonthLessThirtyMinCount = 0;


        for (var i in data) {
          var dateValue = moment(data[i].date).format('DD');
          var monthValue = moment(data[i].date).format('MM');
          var yearValue = moment(data[i].date).format('YYYY');
          if (firstMonthValuofYear === yearValue || tweleveMonthValueofYear === yearValue) {
            /* calculate First Month */
            if (firstMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                firstMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                firstMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                firstMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                firstMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':first,
                'morefive' :firstMonthMoreFiveMinCount,
                'lessfive' :firstMonthLessFiveMinCount,
                'morethirty':firstMonthMoreThirtyMinCount,
                'lessthirty':firstMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':first,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate second Month */
            if (secondMonthValuofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                secondMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                secondMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                secondMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                secondMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':second,
                'morefive' :secondMonthMoreFiveMinCount,
                'lessfive' :secondMonthLessFiveMinCount,
                'morethirty':secondMonthMoreThirtyMinCount,
                'lessthirty':secondMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':second,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }

            /*calculate third Month */
            if (thirdMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                thirdMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                thirdMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                thirdMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                thirdMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':third,
                'morefive' :thirdMonthMoreFiveMinCount,
                'lessfive' :thirdMonthLessFiveMinCount,
                'morethirty':thirdMonthMoreThirtyMinCount,
                'lessthirty':thirdMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':third,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }

            /*calculate fourth month */
            if (fourthMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fourMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fourMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fourMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fourMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':four,
                'morefive' :fourMonthMoreFiveMinCount,
                'lessfive' :fourMonthLessFiveMinCount,
                'morethirty':fourMonthMoreThirtyMinCount,
                'lessthirty':fourMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':four,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate fifth month */
            if (fiveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                fiveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                fiveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                fiveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                fiveMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':five,
                'morefive' :fiveMonthMoreFiveMinCount,
                'lessfive' :fiveMonthLessFiveMinCount,
                'morethirty':fiveMonthMoreThirtyMinCount,
                'lessthirty':fiveMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':five,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate sixth month */
            if (sixMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sixMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sixMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sixMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sixMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':six,
                'morefive' :sixMonthMoreFiveMinCount,
                'lessfive' :sixMonthLessFiveMinCount,
                'morethirty':sixMonthMoreThirtyMinCount,
                'lessthirty':sixMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':six,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate seventh month */
            if (sevenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                sevenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                sevenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                sevenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                sevenMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':seven,
                'morefive' :sevenMonthMoreFiveMinCount,
                'lessfive' :sevenMonthLessFiveMinCount,
                'morethirty':sevenMonthMoreThirtyMinCount,
                'lessthirty':sevenMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':seven,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate eighth month */
            if (eightMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                eigthMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                eigthMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                eigthMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                eigthMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':eight,
                'morefive' :eigthMonthMoreFiveMinCount,
                'lessfive' :eigthMonthLessFiveMinCount,
                'morethirty':eigthMonthMoreThirtyMinCount,
                'lessthirty':eigthMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':eight,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate nineth month */
            if (nineMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                nineMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                nineMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                nineMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                nineMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':nine,
                'morefive' :nineMonthMoreFiveMinCount,
                'lessfive' :nineMonthLessFiveMinCount,
                'morethirty':nineMonthMoreThirtyMinCount,
                'lessthirty':nineMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':nine,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }

            /*calculate 10th month */
            if (tenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                tenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                tenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                tenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                tenMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':ten,
                'morefive' :tenMonthMoreFiveMinCount,
                'lessfive' :tenMonthLessFiveMinCount,
                'morethirty':tenMonthMoreThirtyMinCount,
                'lessthirty':tenMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':ten,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate eleven month */
            if (elevenMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                elevenMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                elevenMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                elevenMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                elevenMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':eleven,
                'morefive' :elevenMonthMoreFiveMinCount,
                'lessfive' :elevenMonthLessFiveMinCount,
                'morethirty':elevenMonthMoreThirtyMinCount,
                'lessthirty':elevenMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':eleven,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
            /*calculate 12th month */
            if (tweleveMonthValueofMonth === monthValue) {
              if (data[i].minutes === "More than 5 min") {
                tweleveMonthMoreFiveMinCount += 1;
              } else if (data[i].minutes === "Less than 5 min") {
                tweleveMonthLessFiveMinCount += 1;
              } else if (data[i].minutes === "More than 30 min") {
                tweleveMonthMoreThirtyMinCount += 1;
              } else if (data[i].minutes === "Less than 30 min") {
                tweleveMonthLessThirtyMinCount += 1;
              }
              this.trendReport.push({
                'date':twelve,
                'morefive' :tweleveMonthMoreFiveMinCount,
                'lessfive' :tweleveMonthLessFiveMinCount,
                'morethirty':tweleveMonthMoreThirtyMinCount,
                'lessthirty':tweleveMonthLessThirtyMinCount
              })
            } else {
              this.trendReport.push({
                'date':twelve ,
                'morefive' :0,
                'lessfive' :0,
                'morethirty':0,
                'lessthirty':0
              })
            }
          }
        }


        this.data = {
          labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
            , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [{
            label: "< 5 M",
            backgroundColor: "#2d7e9c",
            data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
              eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
              fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 5 M",
            backgroundColor: "#fe0000",
            data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
              eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
              fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }, {
            label: "< 30 M",
            backgroundColor: "#9833fd",
            data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
              eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
              fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
          }, {
            label: "> 30 M",
            backgroundColor: "#007e00",
            data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
              eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
              fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
          }]
        }

        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        var maxValue = Math.max.apply(Math, arr);
        if(this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
      console.log("trendReport",this.trendReport)
    })
  }

  selectType(type) {
    this.selectTypeValue = type;
    if (this.selectTypeValue === 'Chart' && this.selectSegment === '3M') {
      this.threemonths();
    } else if (this.selectTypeValue === 'Chart' && this.selectSegment === '6M') {
      this.sixmonths();
    } else if (this.selectTypeValue === 'Chart' && this.selectSegment === '9M') {
      this.nineMonths();
    } else if (this.selectTypeValue === 'Chart' && this.selectSegment === '12M') {
      this.tweleveMonths();
    }

    if(this.selectTypeValue === 'Trend' && this.selectSegment === '3M') {
      var firstMonthValue = moment().subtract(0, 'months').format('MMM-YY');
      this.threemonths();
    } else if (this.selectTypeValue === 'Trend' && this.selectSegment === '6M') {
      this.sixmonths();
    } else if (this.selectTypeValue === 'Trend' && this.selectSegment === '9M') {
      this.nineMonths();
    } else if (this.selectTypeValue === 'Trend' && this.selectSegment === '12M') {
      this.tweleveMonths();
    }
  }
}
