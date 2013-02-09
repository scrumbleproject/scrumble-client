$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'burndownchart',
                type: 'line'
            },
            
            //Burn down chart title
            title: {
                text: 'Burn down chart'
            },
            //Burn down chart subtitle
            subtitle: {
                text: 'Project x'
            },
            
            //X axis with sprints
            xAxis: {
            
                categories: ['Spr0', 'Spr1', 'Spr2', 'Spr3', 'Spr4', 'Spr5', 'Spr6', 'Spr7', 'Spr8', 'Spr9', 'Spr10', 'Spr11', 'Spr12']
                
            },
            //Y axis with sprint Points
            yAxis: {
                title: {
                    text: 'Sum of Task Estimates (points)'
                }
            },
           
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: 'Ideal Tasks Remaining',
                data: [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0]
            }, {
                name: 'Actual Tasks Remaining',
                data: [50, 46, 44, 40, 33, 20, 17, 13, 8, 2, 0]
            }]
        });
    });
    
});
