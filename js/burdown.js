$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'line'
            },
            title: {
                text: 'BURDOWN'
            },
            subtitle: {
                text: 'PROJET: X'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
            },
            yAxis: {
                title: {
                    text: 'Stories'
                }
            },
            tooltip: {
                enabled: false,
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'°C';
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'Stories restante',
                data: [70, 60, 45, 35, 28, 20, 17, 25, 6, 2, 0]
            }, {
                name: 'Fin prévisionnelle',
                data: [70, 63, 56, 49, 42, 35, 28, 21, 14, 7, 0]
            }]
        });
    });
    
});
