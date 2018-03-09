import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { Chart } from 'chart.js';
import { position } from 'tether';
import { ServiceProvider } from '../../providers/service/service';
import * as moment from 'moment';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';
import { EmailComposer } from '@ionic-native/email-composer';
declare var cordova: any;
declare var window: any;

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {
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
  totalValue: boolean = false;
  trendReport = [];
  totalTrendReport = [];
  selectedMonthValue;
  NotesReport=[];
  base64;

  constructor(private platform: Platform,private emailComposer: EmailComposer, private translate: TranslateService, private screenOrientation: ScreenOrientation, public service: ServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    /*Get episode */
    this.getEpisodeswithNotes();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.selectSegment = '3M';
    this.selectTypeValue = 'Chart';
    this.selectedMonthValue='Threemonths';
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
    this.threemonths();

    
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
        "responsive": true,
        "maintainAspectRatio": false,
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
            },
            ticks: {
              min: 0,
              fontSize: 18,
            },

          }],
          yAxes: [{
            ticks: {
              min: 0,
              fontSize: 16,
              stepSize: parseInt(value) + 1,
            },
            position: 'bottom'
          }]
        }
      }
    })
    document.getElementById('legend').innerHTML = this.barChart.generateLegend();
    console.log("LEGEND INFO", document.getElementById('legend').innerHTML)
  }

  getEvent(event) {
    console.log("event", event);
    console.log("event.target.textContent", event.target.textContent)
    if (event.target.textContent === 'Total') {
      var valueTotal;
      if (!this.totalValue) {
        this.totalValue = true;
        valueTotal = event.target.style;
        valueTotal['text-decoration'] = 'line-through';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.totalValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.totalValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.totalValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.totalValue, event.target.textContent)
        }
      } else {
        this.totalValue = false;
        valueTotal = event.target.style;
        valueTotal['text-decoration'] = 'none';
        if (this.selectSegment === '3M') {
          this.setChartwithThreeMonths(this.totalValue, event.target.textContent)
        } else if (this.selectSegment === '6M') {
          this.setChartwithSixMonths(this.totalValue, event.target.textContent)
        } else if (this.selectSegment === '9M') {
          this.setChartwithNineMonths(this.totalValue, event.target.textContent)
        } else if (this.selectSegment === '12M') {
          this.setChartWithTweleveMonths(this.totalValue, event.target.textContent)
        }
      }
    }
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
      let firstMonthCount = 0;
      let secondMonthCount = 0;
      let thirdMonthCount = 0;
      let fourMonthCount = 0;
      let fiveMonthCount = 0;
      let sixMonthCount = 0;
      let sevenMonthCount = 0;
      let eightMonthCount = 0;
      let nineMonthCount = 0;
      let tenMonthCount = 0;
      let elevenMonthCount = 0;
      let tweleveMonthCount = 0;
      var arr = [];
      var j, k;
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
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthLessThirtyMinCount + firstMonthMoreThirtyMinCount;
              firstMonthCount = count;
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthLessThirtyMinCount + secondMonthMoreThirtyMinCount;
              secondMonthCount = count;
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthLessThirtyMinCount + thirdMonthMoreThirtyMinCount;
              thirdMonthCount = count;
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
              let count = fourMonthMoreFiveMinCount + fourMonthLessFiveMinCount + fourMonthLessThirtyMinCount + fourMonthMoreThirtyMinCount;
              fourMonthCount = count;
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
              let count = fiveMonthMoreFiveMinCount + fiveMonthLessFiveMinCount + fiveMonthLessThirtyMinCount + fiveMonthMoreThirtyMinCount;
              fiveMonthCount = count;
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
              let count = sixMonthMoreFiveMinCount + sixMonthLessFiveMinCount + sixMonthLessThirtyMinCount + sixMonthMoreThirtyMinCount;
              sixMonthCount = count;
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
              let count = sevenMonthMoreFiveMinCount + sevenMonthLessFiveMinCount + sevenMonthLessThirtyMinCount + sevenMonthMoreThirtyMinCount;
              sevenMonthCount = count;
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
              let count = eigthMonthMoreFiveMinCount + eigthMonthLessFiveMinCount + eigthMonthLessThirtyMinCount + eigthMonthMoreThirtyMinCount;
              eightMonthCount = count;
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
              let count = nineMonthMoreFiveMinCount + nineMonthLessFiveMinCount + nineMonthLessThirtyMinCount + nineMonthMoreThirtyMinCount;
              nineMonthCount = count;
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
              let count = tenMonthMoreFiveMinCount + tenMonthLessFiveMinCount + tenMonthLessThirtyMinCount + tenMonthMoreThirtyMinCount;
              tenMonthCount = count;
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
              let count = elevenMonthMoreFiveMinCount + elevenMonthLessFiveMinCount + elevenMonthLessThirtyMinCount + elevenMonthMoreThirtyMinCount;
              elevenMonthCount = count;
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
              let count = tweleveMonthMoreFiveMinCount + tweleveMonthLessFiveMinCount + tweleveMonthLessThirtyMinCount + tweleveMonthMoreThirtyMinCount;
              tweleveMonthCount = count;
            }
          }
        }

        if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);

        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && !this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
                sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        }
        else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }

          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
          !this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
        } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
          this.lessFiveMinValue && this.totalValue) {
          this.data = {
            labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
              , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
            datasets: [{
              label: "Total",
              backgroundColor: "#ff3c62",
              data: [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0]
            }, {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
          }
          arr = [];
          for (j in this.data.datasets) {
            for (k in this.data.datasets[j].data) {
              arr.push(this.data.datasets[j].data[k]);
            }
          }
          this.setChartanother(arr);
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
    var firstMonthCount = 0;
    var secondMonthCount = 0;
    var thirdMonthCount = 0;
    var fourMonthCount = 0;
    var fiveMonthCount = 0;
    var sixMonthCount = 0;
    var sevenMonthCount = 0;
    var eightMonthCount = 0;
    var nineMonthCount = 0;
    var arr = [];
    var j, k;
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
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount + firstMonthLessThirtyMinCount;
              firstMonthCount = count;
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount + secondMonthLessThirtyMinCount;
              secondMonthCount = count;
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount + thirdMonthLessThirtyMinCount;
              thirdMonthCount = count;
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
              let count = fourMonthMoreFiveMinCount + fourMonthLessFiveMinCount + fourMonthMoreThirtyMinCount + fourMonthLessThirtyMinCount;
              fourMonthCount = count;
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
              let count = fiveMonthMoreFiveMinCount + fiveMonthLessFiveMinCount + fiveMonthMoreThirtyMinCount + fiveMonthLessThirtyMinCount;
              fiveMonthCount = count;
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
              let count = sixMonthMoreFiveMinCount + sixMonthLessFiveMinCount + sixMonthMoreThirtyMinCount + sixMonthLessThirtyMinCount;
              sixMonthCount = count;
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
              let count = sevenMonthMoreFiveMinCount + sevenMonthLessFiveMinCount + sevenMonthMoreThirtyMinCount + sevenMonthLessThirtyMinCount;
              sevenMonthCount = count;
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
              let count = eigthMonthMoreFiveMinCount + eigthMonthLessFiveMinCount + eigthMonthMoreThirtyMinCount + eigthMonthLessThirtyMinCount;
              eightMonthCount = count;
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
              let count = nineMonthMoreFiveMinCount + nineMonthLessFiveMinCount + nineMonthMoreThirtyMinCount + nineMonthLessThirtyMinCount;
              nineMonthCount = count;
            }

            if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);

            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount
                  //     , thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            }
            else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [nineMonthLessThirtyMinCount,
                      eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [nineMonthLessFiveMinCount,
                      eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [nineMonthMoreFiveMinCount,
                      eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [nineMonthValue, eightMonthValue, sevenMonthValue, sixMonthValue,
                  fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0
                  //     , 0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0,
                      0, 0, 0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [nineMonthMoreThirtyMinCount,
                      eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
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
    let firstMonthCount = 0;
    let secondMonthCount = 0;
    let thirdMonthCount = 0;
    let fourMonthCount = 0;
    let fiveMonthCount = 0;
    let sixMonthCount = 0;
    var arr = [];
    var j, k;
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
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount +
                firstMonthLessThirtyMinCount;
              firstMonthCount = count;
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount +
                secondMonthLessThirtyMinCount;
              secondMonthCount = count;
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount +
                thirdMonthLessThirtyMinCount;
              thirdMonthCount = count;
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
              let count = fourMonthMoreFiveMinCount + fourMonthLessFiveMinCount + fourMonthMoreThirtyMinCount +
                fourMonthLessThirtyMinCount;
              fourMonthCount = count;
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
              let count = fiveMonthMoreFiveMinCount + fiveMonthLessFiveMinCount + fiveMonthMoreThirtyMinCount +
                fiveMonthLessThirtyMinCount;
              fiveMonthCount = count;
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
              let count = sixMonthMoreFiveMinCount + sixMonthLessFiveMinCount + sixMonthMoreThirtyMinCount +
                sixMonthLessThirtyMinCount;
              sixMonthCount = count;
            }

            if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              console.log("Success");
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              console.log("data", this.data)
              this.setChartanother(arr);
            }
            else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {

              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {

              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);

            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {

              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0,]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount, fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount,
                      secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {

              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {

              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            }
            else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                      fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // }, 
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                      fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                      fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  //   {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0, 0, 0, 0]

                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0,
                      0, 0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                      fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
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
    let firstMonthCount = 0;
    let secondMonthCount = 0;
    let thirdMonthCount = 0;
    var arr = [];
    var j, k;
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
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount +
                firstMonthLessThirtyMinCount;
              firstMonthCount = count;
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount +
                secondMonthLessThirtyMinCount;
              secondMonthCount = count;
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount +
                thirdMonthLessThirtyMinCount;
              thirdMonthCount = count;
            }

            if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);

            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && !this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            }
            else if (this.moreThirtyMinValue && !this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (this.moreThirtyMinValue && this.lessThirtyMinValue && !this.moreFiveMinValue &&
              !this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [0, 0, 0]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            } else if (!this.moreThirtyMinValue && this.lessThirtyMinValue && this.moreFiveMinValue &&
              this.lessFiveMinValue && this.totalValue) {
              this.data = {
                labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
                datasets: [
                  // {
                  //   label: "Total",
                  //   backgroundColor: "#ff3c62",
                  //   data: [0, 0, 0]
                  // },
                  {
                    label: "< 5 M",
                    backgroundColor: "#8eaadb",
                    data: [0, 0, 0]
                  }, {
                    label: "> 5 M",
                    backgroundColor: "#92d050",
                    data: [0, 0, 0]
                  }, {
                    label: "< 30 M",
                    backgroundColor: "#ffc000",
                    data: [0, 0, 0]
                  }, {
                    label: "> 30 M",
                    backgroundColor: "#fb0808",
                    data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
                  }]
              }
              arr = [];
              for (j in this.data.datasets) {
                for (k in this.data.datasets[j].data) {
                  arr.push(this.data.datasets[j].data[k]);
                }
              }
              this.setChartanother(arr);
            }
          }
        }
      }
    })
  }

  setChartanother(value) {
    var maxValue = Math.max.apply(Math, value);
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
              stepSize: parseInt(maxValue) + 1,
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
      this.selectedMonthValue='Threemonths';
      this.threemonths();
    } else if (this.selectSegment === '6M') {
      this.selectedMonthValue='Sixmonths';
      this.sixmonths();
    } else if (this.selectSegment === '9M') {
      this.selectedMonthValue='Ninemonths';
      this.nineMonths();
    } else if (this.selectSegment === '12M') {
      this.selectedMonthValue='Twelvemonths';
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
    this.trendReport = [];
    this.totalTrendReport = [];
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
    let first = moment().subtract(0, 'months').format('MMM YYYY');
    let second = moment().subtract(1, 'months').format('MMM YYYY');
    let third = moment().subtract(2, 'months').format('MMM YYYY');
    var totalDateValue = [];
    totalDateValue.push(first, second, third);
    this.service.getEpisode().then(data => {
      console.log("EPISODES", data);
      if (data != null) {
        this.length = true;
        let firstMonthMoreFiveMinCount = 0;
        let firstMonthLessFiveMinCount = 0;
        let firstMonthMoreThirtyMinCount = 0;
        let firstMonthLessThirtyMinCount = 0;
        let firstMonthCount = 0;

        let secondMonthMoreFiveMinCount = 0;
        let secondMonthLessFiveMinCount = 0;
        let secondMonthMoreThirtyMinCount = 0;
        let secondMonthLessThirtyMinCount = 0;
        let secondMonthCount = 0;

        let thirdMonthMoreFiveMinCount = 0;
        let thirdMonthLessFiveMinCount = 0;
        let thirdMonthMoreThirtyMinCount = 0;
        let thirdMonthLessThirtyMinCount = 0;
        let thirdMonthCount = 0;

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
                console.log("firstMonth", firstMonthLessThirtyMinCount);
              }

              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount +
                firstMonthLessThirtyMinCount;
              firstMonthCount = count;
              this.trendReport.push({
                'date': first,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': first,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount +
                secondMonthLessThirtyMinCount;
              secondMonthCount = count;
              this.trendReport.push({
                'date': second,
                'morefive': secondMonthMoreFiveMinCount,
                'lessfive': secondMonthLessFiveMinCount,
                'morethirty': secondMonthMoreThirtyMinCount,
                'lessthirty': secondMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': second,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount +
                thirdMonthLessThirtyMinCount;
              thirdMonthCount = count;
              this.trendReport.push({
                'date': third,
                'morefive': thirdMonthMoreFiveMinCount,
                'lessfive': thirdMonthLessFiveMinCount,
                'morethirty': thirdMonthMoreThirtyMinCount,
                'lessthirty': thirdMonthLessThirtyMinCount,
                'total': count
              })

            } else {
              this.trendReport.push({
                'date': third,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
              })
            }
          }
        }



        this.data = {
          labels: [thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [
            //   {
            //   label: "Total",
            //   backgroundColor: "#ff3c62",
            //   data: [thirdMonthCount, secondMonthCount, firstMonthCount]
            // }, 
            {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
        }
        console.log("this.data", this.data);
        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }

        for (var m in totalDateValue) {
          var filter = this.trendReport.filter(f => f.date.toString() === totalDateValue[m].toString());
          var maxPpg = this.getMax(filter, "total");
          this.totalTrendReport.push(maxPpg);
        }
        let finalTotalValue = 0;
        let finallessfive = 0;
        let finalmorefive = 0;
        let finallessthirty = 0;
        let finalmorethirty = 0;
        var finalArray = [];
        for (var m1 in this.totalTrendReport) {
          finalTotalValue += this.totalTrendReport[m1].total;
          finallessfive += this.totalTrendReport[m1].lessfive;
          finalmorefive += this.totalTrendReport[m1].morefive;
          finallessthirty += this.totalTrendReport[m1].lessthirty;
          finalmorethirty += this.totalTrendReport[m1].morethirty;
        }
        finalArray.push({
          date: "",
          total: finalTotalValue,
          lessfive: finallessfive,
          morefive: finalmorefive,
          lessthirty: finallessthirty,
          morethirty: finalmorethirty
        })
        this.totalTrendReport = this.totalTrendReport.concat(finalArray);
        var maxValue = Math.max.apply(Math, arr);
        if (this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
      console.log("totalTrendReport", this.totalTrendReport);
    })
  }

  sixmonths() {
    this.trendReport = [];
    this.totalTrendReport = [];
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
    let first = moment().subtract(0, 'months').format('MMM YYYY');
    let second = moment().subtract(1, 'months').format('MMM YYYY');
    let third = moment().subtract(2, 'months').format('MMM YYYY');
    let four = moment().subtract(3, 'months').format('MMM YYYY');
    let five = moment().subtract(4, 'months').format('MMM YYYY');
    let six = moment().subtract(5, 'months').format('MMM YYYY');
    var totalDateValue = [];
    totalDateValue.push(first, second, third, four, five, six);
    let firstMonthCount = 0;
    let secondMonthCount = 0;
    let thirdmonthCount = 0;
    let fourthMonthCount = 0;
    let fiveMonthCount = 0;
    let sixMonthCount = 0;
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
                console.log("sixMonthLess", firstMonthLessThirtyMinCount);
              }
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount +
                firstMonthLessThirtyMinCount;
              firstMonthCount = count;
              this.trendReport.push({
                'date': first,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': first,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
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
                console.log("sixMonthLess", secondMonthLessThirtyMinCount);
              }
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount +
                secondMonthLessThirtyMinCount;
              secondMonthCount = count;
              this.trendReport.push({
                'date': second,
                'morefive': secondMonthMoreFiveMinCount,
                'lessfive': secondMonthLessFiveMinCount,
                'morethirty': secondMonthMoreThirtyMinCount,
                'lessthirty': secondMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': second,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
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
                console.log("sixMonthLess", thirdMonthLessThirtyMinCount);
              }
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount +
                thirdMonthLessThirtyMinCount;

              thirdmonthCount = count;
              this.trendReport.push({
                'date': third,
                'morefive': thirdMonthMoreFiveMinCount,
                'lessfive': thirdMonthLessFiveMinCount,
                'morethirty': thirdMonthMoreThirtyMinCount,
                'lessthirty': thirdMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': third,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
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
                console.log("sixMonthLess", fourMonthLessThirtyMinCount);
              }
              let count = fourMonthMoreFiveMinCount + fourMonthLessFiveMinCount + fourMonthMoreThirtyMinCount +
                fourMonthLessThirtyMinCount;
              fourthMonthCount = count;
              this.trendReport.push({
                'date': four,
                'morefive': fourMonthMoreFiveMinCount,
                'lessfive': fourMonthLessFiveMinCount,
                'morethirty': fourMonthMoreThirtyMinCount,
                'lessthirty': fourMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': four,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
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
                console.log("sixMonthLess", fiveMonthLessThirtyMinCount);
              }
              let count = fiveMonthMoreFiveMinCount + fiveMonthLessFiveMinCount + fiveMonthMoreThirtyMinCount +
                fiveMonthLessThirtyMinCount;
              fiveMonthCount = count;
              this.trendReport.push({
                'date': five,
                'morefive': fiveMonthMoreFiveMinCount,
                'lessfive': fiveMonthLessFiveMinCount,
                'morethirty': fiveMonthMoreThirtyMinCount,
                'lessthirty': fiveMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': five,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
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
                console.log("sixMonthLess", sixMonthLessThirtyMinCount);
              }

              let count = sixMonthMoreFiveMinCount + sixMonthLessFiveMinCount + sixMonthMoreThirtyMinCount +
                sixMonthLessThirtyMinCount;
              sixMonthCount = count;

              this.trendReport.push({
                'date': six,
                'morefive': sixMonthMoreFiveMinCount,
                'lessfive': sixMonthLessFiveMinCount,
                'morethirty': sixMonthMoreThirtyMinCount,
                'lessthirty': sixMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': six,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': 0
              })
            }
          }
        }

        this.data = {
          labels: [sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [
            //   {
            //   label: "Total",
            //   backgroundColor: "#ff3c62",
            //   data: [sixMonthCount, fiveMonthCount, fourthMonthCount, thirdmonthCount, secondMonthCount, firstMonthCount]
            // }, 
            {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount, fourMonthMoreFiveMinCount,
                thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount, fourMonthLessThirtyMinCount,
                thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
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
        for (var m in totalDateValue) {
          var filter = this.trendReport.filter(f => f.date.toString() === totalDateValue[m].toString());
          var maxPpg = this.getMax(filter, "total");
          this.totalTrendReport.push(maxPpg);
        }
        let finalTotalValue = 0;
        let finallessfive = 0;
        let finalmorefive = 0;
        let finallessthirty = 0;
        let finalmorethirty = 0;
        var finalArray = [];
        for (var m1 in this.totalTrendReport) {
          finalTotalValue += this.totalTrendReport[m1].total;
          finallessfive += this.totalTrendReport[m1].lessfive;
          finalmorefive += this.totalTrendReport[m1].morefive;
          finallessthirty += this.totalTrendReport[m1].lessthirty;
          finalmorethirty += this.totalTrendReport[m1].morethirty;
        }
        finalArray.push({
          total: finalTotalValue,
          lessfive: finallessfive,
          morefive: finalmorefive,
          lessthirty: finallessthirty,
          morethirty: finalmorethirty
        })
        this.totalTrendReport = this.totalTrendReport.concat(finalArray);

        console.log("TEST", this.data);
        var maxValue = Math.max.apply(Math, arr);
        if (this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
    })
  }

  nineMonths() {
    this.trendReport = [];
    this.totalTrendReport = [];
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
    let first = moment().subtract(0, 'months').format('MMM YYYY');
    let second = moment().subtract(1, 'months').format('MMM YYYY');
    let third = moment().subtract(2, 'months').format('MMM YYYY');
    let four = moment().subtract(3, 'months').format('MMM YYYY');
    let five = moment().subtract(4, 'months').format('MMM YYYY');
    let six = moment().subtract(5, 'months').format('MMM YYYY');
    let seven = moment().subtract(6, 'months').format('MMM YYYY');
    let eight = moment().subtract(7, 'months').format('MMM YYYY');
    let nine = moment().subtract(8, 'months').format('MMM YYYY');
    var totalDateValue = [];
    totalDateValue.push(first, second, third, four, five, six, seven, eight, nine);

    let firstMonthCount = 0;
    let secondMonthCount = 0;
    let thirdMonthCount = 0;
    let fourMonthCount = 0;
    let fiveMonthCount = 0;
    let sixMonthCount = 0;
    let sevenMonthCount = 0;
    let eightMonthCount = 0;
    let nineMonthCount = 0;

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
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount +
                firstMonthLessThirtyMinCount;
              firstMonthCount = count;
              this.trendReport.push({
                'date': first,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': first,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount +
                secondMonthLessThirtyMinCount;
              secondMonthCount = count;
              this.trendReport.push({
                'date': second,
                'morefive': secondMonthMoreFiveMinCount,
                'lessfive': secondMonthLessFiveMinCount,
                'morethirty': secondMonthMoreThirtyMinCount,
                'lessthirty': secondMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': second,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount +
                thirdMonthLessThirtyMinCount;
              thirdMonthCount = count;
              this.trendReport.push({
                'date': third,
                'morefive': thirdMonthMoreFiveMinCount,
                'lessfive': thirdMonthLessFiveMinCount,
                'morethirty': thirdMonthMoreThirtyMinCount,
                'lessthirty': thirdMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': third,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = fourMonthMoreFiveMinCount + fourMonthLessFiveMinCount + fourMonthMoreThirtyMinCount +
                fourMonthLessThirtyMinCount;
              fourMonthCount = count;
              this.trendReport.push({
                'date': four,
                'morefive': fourMonthMoreFiveMinCount,
                'lessfive': fourMonthLessFiveMinCount,
                'morethirty': fourMonthMoreThirtyMinCount,
                'lessthirty': fourMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': four,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = fiveMonthMoreFiveMinCount + fiveMonthLessFiveMinCount + fiveMonthMoreThirtyMinCount +
                fiveMonthLessThirtyMinCount;

              fiveMonthCount = count;
              this.trendReport.push({
                'date': five,
                'morefive': fiveMonthMoreFiveMinCount,
                'lessfive': fiveMonthLessFiveMinCount,
                'morethirty': fiveMonthMoreThirtyMinCount,
                'lessthirty': fiveMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': five,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = sixMonthMoreFiveMinCount + sixMonthLessFiveMinCount + sixMonthMoreThirtyMinCount +
                sixMonthLessThirtyMinCount;

              sixMonthCount = count;
              this.trendReport.push({
                'date': six,
                'morefive': sixMonthMoreFiveMinCount,
                'lessfive': sixMonthLessFiveMinCount,
                'morethirty': sixMonthMoreThirtyMinCount,
                'lessthirty': sixMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': six,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = sevenMonthMoreFiveMinCount + sevenMonthLessFiveMinCount + sevenMonthMoreThirtyMinCount +
                sevenMonthLessThirtyMinCount;

              sevenMonthCount = count;
              this.trendReport.push({
                'date': seven,
                'morefive': sevenMonthMoreFiveMinCount,
                'lessfive': sevenMonthLessFiveMinCount,
                'morethirty': sevenMonthMoreThirtyMinCount,
                'lessthirty': sevenMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': seven,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = eigthMonthMoreFiveMinCount + eigthMonthLessFiveMinCount + eigthMonthMoreThirtyMinCount +
                eigthMonthLessThirtyMinCount;

              eightMonthCount = count;
              this.trendReport.push({
                'date': eight,
                'morefive': eigthMonthMoreFiveMinCount,
                'lessfive': eigthMonthLessFiveMinCount,
                'morethirty': eigthMonthMoreThirtyMinCount,
                'lessthirty': eigthMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': eight,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = nineMonthMoreFiveMinCount + nineMonthLessFiveMinCount + nineMonthMoreThirtyMinCount +
                nineMonthLessThirtyMinCount;
              nineMonthCount = count;
              this.trendReport.push({
                'date': nine,
                'morefive': nineMonthMoreFiveMinCount,
                'lessfive': nineMonthLessFiveMinCount,
                'morethirty': nineMonthMoreThirtyMinCount,
                'lessthirty': nineMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': nine,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
              })
            }
          }
        }

        this.data = {
          labels: [nineMonthValue, eightMonthValue
            , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [
            //   {
            //   label: "Total",
            //   backgroundColor: "#ff3c62",
            //   data: [nineMonthCount, eightMonthCount, sevenMonthCount, sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount
            //     , firstMonthCount]
            // }, 
            {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [nineMonthLessFiveMinCount, eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [nineMonthMoreFiveMinCount, eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [nineMonthLessThirtyMinCount, eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [nineMonthMoreThirtyMinCount, eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
        }
        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        for (var m in totalDateValue) {
          var filter = this.trendReport.filter(f => f.date.toString() === totalDateValue[m].toString());
          var maxPpg = this.getMax(filter, "total");
          this.totalTrendReport.push(maxPpg);
        }
        let finalTotalValue = 0;
        let finallessfive = 0;
        let finalmorefive = 0;
        let finallessthirty = 0;
        let finalmorethirty = 0;
        var finalArray = [];
        for (var m1 in this.totalTrendReport) {
          finalTotalValue += this.totalTrendReport[m1].total;
          finallessfive += this.totalTrendReport[m1].lessfive;
          finalmorefive += this.totalTrendReport[m1].morefive;
          finallessthirty += this.totalTrendReport[m1].lessthirty;
          finalmorethirty += this.totalTrendReport[m1].morethirty;
        }
        finalArray.push({
          total: finalTotalValue,
          lessfive: finallessfive,
          morefive: finalmorefive,
          lessthirty: finallessthirty,
          morethirty: finalmorethirty
        })
        this.totalTrendReport = this.totalTrendReport.concat(finalArray);
        var maxValue = Math.max.apply(Math, arr);
        if (this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
    })
    console.log("totalTrendReport", this.totalTrendReport);
  }

  tweleveMonths() {
    this.trendReport = [];
    this.totalTrendReport = [];
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

    let first = moment().subtract(0, 'months').format('MMM YYYY');
    let second = moment().subtract(1, 'months').format('MMM YYYY');
    let third = moment().subtract(2, 'months').format('MMM YYYY');
    let four = moment().subtract(3, 'months').format('MMM YYYY');
    let five = moment().subtract(4, 'months').format('MMM YYYY');
    let six = moment().subtract(5, 'months').format('MMM YYYY');
    let seven = moment().subtract(6, 'months').format('MMM YYYY');
    let eight = moment().subtract(7, 'months').format('MMM YYYY');
    let nine = moment().subtract(8, 'months').format('MMM YYYY');
    let ten = moment().subtract(9, 'months').format('MMM YYYY');
    let eleven = moment().subtract(10, 'months').format('MMM YYYY');
    let twelve = moment().subtract(11, 'months').format('MMM YYYY');
    var totalDateValue = [];
    totalDateValue = [first, second, third, four, five, six, seven, eight, nine, ten, eleven, twelve]
    let firstMonthCount = 0;
    let secondMonthCount = 0;
    let thirdMonthCount = 0;
    let fourMonthCount = 0;
    let fiveMonthCount = 0;
    let sixMonthCount = 0;
    let sevenMonthCount = 0;
    let eightMonthCount = 0;
    let nineMonthCount = 0;
    let tenMonthCount = 0;
    let elevenMonthCount = 0;
    let tweleveMonthCount = 0;


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
              let count = firstMonthMoreFiveMinCount + firstMonthLessFiveMinCount + firstMonthMoreThirtyMinCount +
                firstMonthLessThirtyMinCount;
              firstMonthCount = count;
              this.trendReport.push({
                'date': first,
                'morefive': firstMonthMoreFiveMinCount,
                'lessfive': firstMonthLessFiveMinCount,
                'morethirty': firstMonthMoreThirtyMinCount,
                'lessthirty': firstMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': first,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = secondMonthMoreFiveMinCount + secondMonthLessFiveMinCount + secondMonthMoreThirtyMinCount +
                secondMonthLessThirtyMinCount;
              secondMonthCount = count;
              this.trendReport.push({
                'date': second,
                'morefive': secondMonthMoreFiveMinCount,
                'lessfive': secondMonthLessFiveMinCount,
                'morethirty': secondMonthMoreThirtyMinCount,
                'lessthirty': secondMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': second,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = thirdMonthMoreFiveMinCount + thirdMonthLessFiveMinCount + thirdMonthMoreThirtyMinCount +
                thirdMonthLessThirtyMinCount;
              thirdMonthCount = count;
              this.trendReport.push({
                'date': third,
                'morefive': thirdMonthMoreFiveMinCount,
                'lessfive': thirdMonthLessFiveMinCount,
                'morethirty': thirdMonthMoreThirtyMinCount,
                'lessthirty': thirdMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': third,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = fourMonthMoreFiveMinCount + fourMonthLessFiveMinCount + fourMonthMoreThirtyMinCount +
                fourMonthLessThirtyMinCount;
              fourMonthCount = count;
              this.trendReport.push({
                'date': four,
                'morefive': fourMonthMoreFiveMinCount,
                'lessfive': fourMonthLessFiveMinCount,
                'morethirty': fourMonthMoreThirtyMinCount,
                'lessthirty': fourMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': four,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = fiveMonthMoreFiveMinCount + fiveMonthLessFiveMinCount + fiveMonthMoreThirtyMinCount +
                fiveMonthLessThirtyMinCount;
              fiveMonthCount = count;
              this.trendReport.push({
                'date': five,
                'morefive': fiveMonthMoreFiveMinCount,
                'lessfive': fiveMonthLessFiveMinCount,
                'morethirty': fiveMonthMoreThirtyMinCount,
                'lessthirty': fiveMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': five,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = sixMonthMoreFiveMinCount + sixMonthLessFiveMinCount + sixMonthMoreThirtyMinCount +
                sixMonthLessThirtyMinCount;

              sixMonthCount = count;
              this.trendReport.push({
                'date': six,
                'morefive': sixMonthMoreFiveMinCount,
                'lessfive': sixMonthLessFiveMinCount,
                'morethirty': sixMonthMoreThirtyMinCount,
                'lessthirty': sixMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': six,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = sevenMonthMoreFiveMinCount + sevenMonthLessFiveMinCount + sevenMonthMoreThirtyMinCount +
                sevenMonthLessThirtyMinCount;
              sevenMonthCount = count;
              this.trendReport.push({
                'date': seven,
                'morefive': sevenMonthMoreFiveMinCount,
                'lessfive': sevenMonthLessFiveMinCount,
                'morethirty': sevenMonthMoreThirtyMinCount,
                'lessthirty': sevenMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': seven,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = eigthMonthMoreFiveMinCount + eigthMonthLessFiveMinCount + eigthMonthMoreThirtyMinCount +
                eigthMonthLessThirtyMinCount;
              eightMonthCount = count;
              this.trendReport.push({
                'date': eight,
                'morefive': eigthMonthMoreFiveMinCount,
                'lessfive': eigthMonthLessFiveMinCount,
                'morethirty': eigthMonthMoreThirtyMinCount,
                'lessthirty': eigthMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': eight,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = nineMonthMoreFiveMinCount + nineMonthLessFiveMinCount + nineMonthMoreThirtyMinCount +
                nineMonthLessThirtyMinCount;
              nineMonthCount = count;
              this.trendReport.push({
                'date': nine,
                'morefive': nineMonthMoreFiveMinCount,
                'lessfive': nineMonthLessFiveMinCount,
                'morethirty': nineMonthMoreThirtyMinCount,
                'lessthirty': nineMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': nine,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = tenMonthMoreFiveMinCount + tenMonthLessFiveMinCount + tenMonthMoreThirtyMinCount +
                tenMonthLessThirtyMinCount;
              tenMonthCount = count;
              this.trendReport.push({
                'date': ten,
                'morefive': tenMonthMoreFiveMinCount,
                'lessfive': tenMonthLessFiveMinCount,
                'morethirty': tenMonthMoreThirtyMinCount,
                'lessthirty': tenMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': ten,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
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
              let count = elevenMonthMoreFiveMinCount + elevenMonthLessFiveMinCount + elevenMonthMoreThirtyMinCount +
                elevenMonthLessThirtyMinCount;
              elevenMonthCount = count;
              this.trendReport.push({
                'date': eleven,
                'morefive': elevenMonthMoreFiveMinCount,
                'lessfive': elevenMonthLessFiveMinCount,
                'morethirty': elevenMonthMoreThirtyMinCount,
                'lessthirty': elevenMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': eleven,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
              })
            }
            /*calculate 12th month */
            let count = tweleveMonthMoreFiveMinCount + tweleveMonthLessFiveMinCount + tweleveMonthMoreThirtyMinCount +
              tweleveMonthLessThirtyMinCount;
            tweleveMonthCount = count;
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
                'date': twelve,
                'morefive': tweleveMonthMoreFiveMinCount,
                'lessfive': tweleveMonthLessFiveMinCount,
                'morethirty': tweleveMonthMoreThirtyMinCount,
                'lessthirty': tweleveMonthLessThirtyMinCount,
                'total': count
              })
            } else {
              this.trendReport.push({
                'date': twelve,
                'morefive': 0,
                'lessfive': 0,
                'morethirty': 0,
                'lessthirty': 0,
                'total': 0
              })
            }
          }
        }


        this.data = {
          labels: [tweleveMonthValue, elevenMonthValue, tenMonthValue, nineMonthValue, eightMonthValue
            , sevenMonthValue, sixMonthValue, fiveMonthValue, fourthMonthValue, thirdMonthValue, secondMonthValue, firstMonthValue],
          datasets: [
            //   {
            //   label: "Total",
            //   backgroundColor: "#ff3c62",
            //   data: [tweleveMonthCount, elevenMonthCount, tenMonthCount, nineMonthCount, eightMonthCount, sevenMonthCount,
            //     sixMonthCount, fiveMonthCount, fourMonthCount, thirdMonthCount, secondMonthCount, firstMonthCount]
            // }, 
            {
              label: "< 5 M",
              backgroundColor: "#8eaadb",
              data: [tweleveMonthLessFiveMinCount, elevenMonthLessFiveMinCount, tenMonthLessFiveMinCount, nineMonthLessFiveMinCount,
                eigthMonthLessFiveMinCount, sevenMonthLessFiveMinCount, sixMonthLessFiveMinCount, fiveMonthLessFiveMinCount,
                fourMonthLessFiveMinCount, thirdMonthLessFiveMinCount, secondMonthLessFiveMinCount, firstMonthLessFiveMinCount]
            }, {
              label: "> 5 M",
              backgroundColor: "#92d050",
              data: [tweleveMonthMoreFiveMinCount, elevenMonthMoreFiveMinCount, tenMonthMoreFiveMinCount, nineMonthMoreFiveMinCount,
                eigthMonthMoreFiveMinCount, sevenMonthMoreFiveMinCount, sixMonthMoreFiveMinCount, fiveMonthMoreFiveMinCount,
                fourMonthMoreFiveMinCount, thirdMonthMoreFiveMinCount, secondMonthMoreFiveMinCount, firstMonthMoreFiveMinCount]
            }, {
              label: "< 30 M",
              backgroundColor: "#ffc000",
              data: [tweleveMonthLessThirtyMinCount, elevenMonthLessThirtyMinCount, tenMonthLessFiveMinCount, nineMonthLessThirtyMinCount,
                eigthMonthLessThirtyMinCount, sevenMonthLessThirtyMinCount, sixMonthLessThirtyMinCount, fiveMonthLessThirtyMinCount,
                fourMonthLessThirtyMinCount, thirdMonthLessThirtyMinCount, secondMonthLessThirtyMinCount, firstMonthLessThirtyMinCount]
            }, {
              label: "> 30 M",
              backgroundColor: "#fb0808",
              data: [tweleveMonthMoreThirtyMinCount, elevenMonthMoreThirtyMinCount, tenMonthMoreFiveMinCount, nineMonthMoreThirtyMinCount,
                eigthMonthMoreThirtyMinCount, sevenMonthMoreThirtyMinCount, sixMonthMoreThirtyMinCount, fiveMonthMoreThirtyMinCount,
                fourMonthMoreThirtyMinCount, thirdMonthMoreThirtyMinCount, secondMonthMoreThirtyMinCount, firstMonthMoreThirtyMinCount]
            }]
        }

        for (var m in totalDateValue) {
          var filter = this.trendReport.filter(f => f.date.toString() === totalDateValue[m].toString());
          var maxPpg = this.getMax(filter, "total");
          this.totalTrendReport.push(maxPpg);
        }
        let finalTotalValue = 0;
        let finallessfive = 0;
        let finalmorefive = 0;
        let finallessthirty = 0;
        let finalmorethirty = 0;
        var finalArray = [];
        for (var m1 in this.totalTrendReport) {
          finalTotalValue += this.totalTrendReport[m1].total;
          finallessfive += this.totalTrendReport[m1].lessfive;
          finalmorefive += this.totalTrendReport[m1].morefive;
          finallessthirty += this.totalTrendReport[m1].lessthirty;
          finalmorethirty += this.totalTrendReport[m1].morethirty;
        }
        finalArray.push({
          total: finalTotalValue,
          lessfive: finallessfive,
          morefive: finalmorefive,
          lessthirty: finallessthirty,
          morethirty: finalmorethirty
        })
        this.totalTrendReport = this.totalTrendReport.concat(finalArray);

        var arr = [];
        for (var j in this.data.datasets) {
          for (var k in this.data.datasets[j].data) {
            arr.push(this.data.datasets[j].data[k]);
          }
        }
        var maxValue = Math.max.apply(Math, arr);
        if (this.selectTypeValue === 'Chart') {
          this.getChart(maxValue);
        }
      } else {
        this.length = false;
      }
      console.log("trendReport", this.trendReport)
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

    if (this.selectTypeValue === 'Trend' && this.selectSegment === '3M') {
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

  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
    }
    return max;
  }

  sendMessage() {
    // let printContents = `<h5 style="color:#eee">Test</h5>`
    var html = [
      '<center>',
      '<h1 style="font-family: "Oswald", sans-serif;">Recap</h1>',
      '<h3 style="color:#aaa;font-style:italic;">Sample</h3>',
      '</center>',
    ];
    var css = ['<style>',
      'body',
      '{',
      'max-width: 600px;',
      'margin:  auto;',
      'padding: 1rem;',
      '}',
      'p',
      '{',
      'width:100%',
      'font-family: "Roboto", sans-serif;',
      '}',
      '</style>',
      '<link href="http://fonts.googleapis.com/css?family=Oswald:300|Shadows Into Light|Roboto:300" rel="stylesheet" type="text/css" />'
    ];
    var arrayss: any = [];
    arrayss = css.concat(html);
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
    let email = {
      app: 'gmail',
      to: 'anivaishu95@gmail.com',
      cc: '',
      attachments: [

      ],
      subject: 'Sample Email from Logrythmia',
      body: arrayss,
      isHtml: true
    };

    this.emailComposer.open(email);
  }

  createPdf() {
    let scriptContent = '';
    let contentTwo = '';
    var currentDate = moment().format('DD MMM,YYYY');
    console.log("totalRTrendReport",this.totalTrendReport)
    let popped = this.totalTrendReport.pop();
    console.log("POPPED",popped)
    var dateValue=[];
   
    for(var m in this.totalTrendReport) {
      dateValue.push({
        date:this.totalTrendReport[m].date
      });
    }
    
    for (var i in this.totalTrendReport) {
      let count =parseInt(i)+1;
        scriptContent += `<tr style="background: #fff; border-bottom: 1px solid #000;border-right: 1px solid #000;">
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ this.totalTrendReport[i].date + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ this.totalTrendReport[i].total + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ this.totalTrendReport[i].lessfive + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ this.totalTrendReport[i].morefive + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ this.totalTrendReport[i].lessthirty + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ this.totalTrendReport[i].morethirty + `</td>
          <tr>`;
    }

    var NotesReportValue=[];
    for(var m1 in dateValue) {
      var a=[];
    for(var k in this.NotesReport) {
      var valueOfdateValue = dateValue[m1];
        if(dateValue[m1].date === this.NotesReport[k].date) {
          a.push(this.NotesReport[k].Notes);
          valueOfdateValue['Notes']=a;
        } else {
          valueOfdateValue['Notes']=[];
        }
      }
    }

   scriptContent += `<tr style="background: #fff; border-bottom: 1px solid #000;border-right: 1px solid #000;">
          <td style="padding: 6px 10px;border-right: 1px solid #000;">Total</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ popped.total + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ popped.lessfive + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ popped.morefive + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ popped.lessthirty + `</td>
          <td style="padding: 6px 10px;border-right: 1px solid #000;">`+ popped.morethirty + `</td>
          <tr>`;

    console.log("dateValue",dateValue);
    for(var l in dateValue){
      console.log("date",dateValue[l].date);
      console.log("Notes",dateValue[l].Notes);
      contentTwo += `<tr style="background: #fff; border-bottom: 1px solid #000;border-right: 1px solid #000;">
                    <td style="padding: 6px 10px;border-right: 1px solid #000;">`+dateValue[l].date+`</td>
                    <td style="padding-top: 17px;line-height: 4px;border-right: 1px solid #000;">`;
                    for(var mn in dateValue[l].Notes) {
                      if(dateValue[l].Notes.length != 0) {
                        if(dateValue[l].Notes[mn] != undefined) {
                          contentTwo += 
                            `<ul>
                                <li>`+dateValue[l].Notes[mn]+`</li>
                            </ul>`
                        } else if(dateValue[l].Notes[mn] === undefined) {
                          `<ul>
                                <li></li>
                          </ul>`
                        }
                      }
                    } 
                    contentTwo += `</td>
                    </tr>`
    }
    var value = `<html id="print-section">
                <div style="padding: 15px;margin-top: 56px;border-left: 1px solid #000;border-right: 1px solid #000;
                border-top: 1px solid #000;">
                  <h2 style="text-align: center;">Logrythmia Entry</h2>
                  <h4 style="text-align: center;">Monthly Report</h4>
                  <div class="table-view">
                    <table class="table" style="width: 100%; border-collapse: collapse;font-family: Roboto;overflow-x: auto;border: 1px solid #000;">
                      <thead>
                        <tr style="background: #fff; border-bottom: 1px solid #000;border-right: 1px solid #000;">
                          <th style=" background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">Month</th>
                          <th style=" background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">Total</th>
                          <th style=" background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">
                          < 5M</th>
                          <th style=" background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">> 5M</th>
                          <th style=" background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">
                          < 30M</th>
                          <th style=" background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">> 30M</th>
                        </tr>
                      </thead>
                      <tbody>`
                        + scriptContent +
                      `</tbody>
                    </table>
                  </div>
                  <table style="border-collapse: collapse;font-family: Roboto;overflow-x: auto;border: 1px solid #000;width: 100%;margin-top: 17px;">
                    <thead>
                      <tr style=" background: #fff; border-bottom: 1px solid #000;border-right: 1px solid #000;">
                        <th style="background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">Month</th>
                        <th style="background: #000;color: white;text-align: center;padding: 6px 10px; border-right: 1px solid #000;">Note Summary</th>
                      </tr>
                    </thead>
                    <tbody>`+ contentTwo + `
                    </tbody>
                  </table>
                  <div class="row" style="width: 100%;display: flex;">
                    <div class="col-sm-6" style="width: 50%;">
                      <p>Patient Name : </p>
                    </div>
                    <div class="col-sm-6 text-right" style="width: 50%;text-align:right;">
                      <p>Report Generated Date : `+ currentDate + `</p>
                    </div>
                  </div>
                  <div>
                    <p>You can use this space to describe any additional features you feel is important</p>
                    <textarea style="width: 100%;height: 100px;" type="text" row="3" name="text-describe"></textarea>
                    <p>The above information is true and correct to the best of my brief.</p>
                  </div>

                  <div class="row" style="width: 100%;display: flex;">
                    <div class="col-sm-2" style="padding: 5px;width: 34%;">
                      <p>Patient Signature:</p>
                    </div>
                    <div class="col-sm-4" style="width: 66%;padding: 5px;">
                      <input style="width: 100%;margin-top: 15px;border: none;border-bottom: 1px solid #ddd;" type="text" name="Patient-sign">
                    </div>
                    <div class="col-sm-2"  style="padding: 5px;width: 34%;">
                      <p>Date :</p>
                    </div>
                    <div class="col-sm-4" style="width: 66%;padding: 5px;">
                      <input style="width: 100%;margin-top: 15px;border: none;border-bottom: 1px solid #ddd;" type="text" name="Patient-date">
                    </div>
                  </div>

                  <div class="row" style="width: 100%;display: flex;">
                    <div class="col-sm-2" style="padding: 5px;width: 34%;">
                      <p>Physician Signature:</p>
                    </div>
                    <div class="col-sm-4" style="width: 66%;padding: 5px;">
                      <input style="width: 100%;margin-top: 15px;border: none;border-bottom: 1px solid #ddd;" type="text" name="Physician-sign">
                    </div>
                    <div class="col-sm-2" style="padding: 5px;width: 34%;">
                      <p>Date :</p>
                    </div>
                    <div class="col-sm-4" style="width: 66%;padding: 5px;">
                      <input style="width: 100%;margin-top: 15px;border: none;border-bottom: 1px solid #ddd;" type="text" name="Physician-date">
                    </div>
                  </div>
                </div>
                <div style="border: 1px solid #000;">
                  <p style="margin-left: 15px;">Report Generated using LogRythmia App</p>
                </div>
                </html>`;
                console.log("Value",value);
    let scope = this;
    document.addEventListener('deviceready', function () {
      let options = {
        documentSize: 'A4',
        type: 'base64',
        fileName: 'myFile.pdf'
      }
      let base64;
      cordova.plugins.pdf.fromData(value, options)
        .then((imageData) => {
          base64 = imageData;
          var filename = 'some_filename.pdf';
          var attachmentBase64 = "'" + base64 + "'"; // This should be your base64-string
          scope.base64 = attachmentBase64;
          scope.emailComposer.isAvailable().then((available: boolean) => {
            if (available) {
              //Now we know we can send
            }
          });
          let email = {
            app: '',
            to: 'anivaishu95@gmail.com',
            cc: '',
            attachments: [
              'base64:filename.pdf//' + scope.base64
            ],
            subject: 'Sample Email from Logrythmia',
            body: 'How are you? Nice greetings from Leipzig',
            isHtml: true
          };

          scope.emailComposer.open(email);
        }, (err) => {
          // Handle error
        });
    })
  }

  getEpisodeswithNotes() {
    var episodesWithNotes=[];
    this.service.getEpisode().then(data=>{
      if(data != null) {
        for(var i in data) {
          episodesWithNotes.push({
            date:moment(data[i].date).format('MMM YYYY'),
            Notes:data[i].Notes
          })
        }
      }
      this.NotesReport=episodesWithNotes;
    })
  }
}
