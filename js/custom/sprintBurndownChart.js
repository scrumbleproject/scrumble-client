/** burndownchart methods **/


//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
    myTab['sprintList.html?project='+idProject+''] = 'Sprint List';
    myTab[''] = 'Sprint Burndown Chart'; 

    $.showBreadCrumb(myTab);
}



$(function () {

    //Get parameters idProject and idSprint in url if it exists
    idProject = $(document).getUrlParam("project");
    idSprint = $(document).getUrlParam("sprint");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);

    //Get information from the Web Service, display in the form
    if(idSprint!=="" && idSprint!==null) 
    {
        var chart;
        $(document).ready(function() {
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'burndownchart',
                    type: 'line', 
                    events: 
                    {
                        load: function() 
                        {

                            $.ajax({
                                url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/burndown',
                                type:'GET',
                                contentType:'application/json; charset=UTF-8',
                                success: function(reponse) 
                                {
                                    data = $.parseJSON(reponse);

                                    if(data!=0)
                                    {
                                        i=0;
                                        while(i<data['idealChart'].length)
                                        {
                                            if(typeof(data['idealChart'][i])!='undefined')
                                                chart.series[0].addPoint([parseDate(data['listDates'][i]), Math.round((data['idealChart'][i]) * 100) / 100], true );
                                            if(typeof(data['actualChart'][i])!='undefined')
                                                chart.series[1].addPoint([parseDate(data['listDates'][i]), Math.round((data['actualChart'][i]) * 100) / 100], true );
                                            i++;
                                        }

                                    }
                                },
                                error:function (xhr, status, error)
                                {
                                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                                },
                                dataType:'text',
                                converters:'text json'
                            });
                        }
                    }
                },
                
                //Burn down chart title
                title: {
                    text: 'Burndown Chart'
                },
                //Burn down chart subtitle
                subtitle: {
                    text: 'Sprint'+idSprint
                },
                
                //X axis with sprints
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%Y-%m-%e',
                    },
                    labels: {
                        rotation: -45,
                        align: 'right'
                    }
                },
                //Y axis with sprint Points
                yAxis: {
                    title: {
                        text: 'Estimation points'
                    },
                    min: 0
                },
               
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                tooltip: {
                    formatter: function() 
                    {
                        var s = '<b>'+ Highcharts.dateFormat('%Y-%m-%e', this.x) +'</b>';
            
                        $.each(this.points, function(i, point) {
                            s += '<br/>'+ point.series.name +': '+
                                point.y;
                        });
                        return s;
                    },
                    shared: true,
                    crosshairs: true
                },
                series: 
                [
                    {
                        name: 'Ideal Remaining Points',
                        data: []
                    }, 
                    {
                        name: 'Actual Remaining Points',
                        data: []
                    }
                ]
            });
        });
    }
});