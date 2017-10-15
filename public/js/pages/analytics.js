var courseQuizScores, courseUsersTaken, regionQuizScores, regionUsersTaken, region;

$(document).ready(function() {
    region = $('#userRegion').text();
    setDefaultDates();
    // Initialize date range pickers
    initDateRangePickers();
    // Intialize quiz scores chart
    initCourseQuizScores();
    // Initialize users course taken chart
    initCourseUsersTaken();
    initRegionQuizScores();
    initRegionUsersTaken();
    //Initialize regionOnOptionSelecteds
    initOptionSelected();
    initUserStats();
});

function initOptionSelected() {
    $('#courseRegion').change(function() {
        var value = $(this).find(":selected").text();
        courseQuizScores.data.datasets[0].label = value;
        courseQuizScores.update();
        var dates = getSelectedDates('courseDateRangePicker');
        updateChart('course-quizScoresChart', dates.startDate.format('MM/DD/YYY'),
         dates.endDate.format('MM/DD/YYYY'));
        updateChart('course-usersTakenChart', dates.startDate.format('MM/DD/YYY'),
          dates.endDate.format('MM/DD/YYYY'));

    });

    $('#username').change(function() {
        var username = $(this).find(":selected").text();
        var dates = getSelectedDates('userDateRangePicker');
        updateStats(dates.startDate.format('MM/DD/YYY'),
         dates.endDate.format('MM/DD/YYYY'));

    });
}

function setDefaultDates() {
    var startDate = moment().subtract(6, 'days').format('LL');
    var endDate = moment().format('LL');
    setDateRange('courseDaterange', startDate, endDate);
    setDateRange('regionDaterange', startDate, endDate);
    setDateRange('userDaterange', startDate, endDate);
}

function getSelectedDates(datepicker) {
    var dates = {
        startDate: $('#'+datepicker).data('daterangepicker').startDate,
        endDate: $('#'+datepicker).data('daterangepicker').endDate
    }

    return dates;

}

function getDefaultDates() {
    var dates = [];
    for(var i = 6; i >= 0; i--) {
        dates.push(moment().subtract(i, 'days'));
    }
    return dates;
}

function setDateRange(elemid, date1, date2) {
    $('#'+elemid).text(date1 + ' - ' + date2);
}

// function updateCharts(chartid, selectid, daterange) {
//     if(chartid == 'course-quizScoresChart') {
//         // Get value of course selected
//         var value =  $(selectid).find(":selected").text();
//         // Call
//     }
// }

function initCourseUsersTaken() {
    var ctx = document.getElementById('course-usersTakenChart').getContext('2d');

    courseUsersTaken = new Chart(ctx, {
        type: 'doughnut',
        data : {
            datasets: [{
                backgroundColor: ['#d50000', '#ffffff'],
                data: [80, 20]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Taken',
                'Not Taken'
            ]
        },

        options: {}
    });
}

function initUserStats() {
    var dates = getDefaultDates();
    var startDate = dates[0].format('MM/DD/YYYY');
    var endDate = dates[6].format('MM/DD/YYYY');
    var username = $('#username').find(':selected').text();
    var url = window.location.origin + '/api/user';
    $.ajax({
        url: url,
        type: 'post',
        data: {
            startDate: startDate,
            endDate: endDate,
            region: region,
            user: username,
        }
    }).done(function(response) {
        var data = JSON.parse(response);
        console.log(data);
        var completed = data.completed;
        var avgScores = data.avgScores;
        $('.progress-bar').each(function(index) {
            var id = $(this).attr('id');
            if(completed[id] != undefined) {
                $(this).css('width', completed[id]+'%');
            }
            else {
                $(this).css('width', 0);
            }

        });
        $('.quizScores').each(function(index) {
            var id = $(this).attr('id');
            var selector = id.substr(4);
            if(avgScores[selector] != undefined) {
                $(this).text(avgScores[selector]);
            }
            else {
                $(this).text(0);
            }
        });

    }).fail(function(jqXHR, textSatus, errorThrown) {
        console.log("Couldn't retrieve Data");
    });

}

function initDateRangePickers() {
    $('#courseDateRangePicker').daterangepicker({
      ranges   : {
        'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month'  : [moment().startOf('month'), moment().endOf('month')],
        'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      startDate: moment().subtract(29, 'days'),
      endDate  : moment()
    }, function (start, end) {
      updateChart('course-quizScoresChart', start.format('MM/DD/YYYY'), end.format('MM/DD/YYYY'));
      updateChart('course-usersTakenChart', start.format('MM/DD/YYYY'), end.format('MM/DD/YYYY'));
      setDateRange('courseDaterange', start.format('LL'), end.format('LL'));
    });

    $('#regionDateRangePicker').daterangepicker({
      ranges   : {
        'Today'       : [moment(), moment()],
        'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month'  : [moment().startOf('month'), moment().endOf('month')],
        'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      startDate: moment().subtract(29, 'days'),
      endDate  : moment()
    }, function (start, end) {
      updateChart('region-quizScoresChart', start.format('MM/DD/YYYY'), end.format('MM/DD/YYYY'));
      updateChart('region-usersTakenChart', start.format('MM/DD/YYYY'), end.format('MM/DD/YYYY'));
      setDateRange('regionDaterange', start.format('LL'), end.format('LL'));
    });

    $('#userDateRangePicker').daterangepicker({
      ranges   : {
        'Today'       : [moment(), moment()],
        'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month'  : [moment().startOf('month'), moment().endOf('month')],
        'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      startDate: moment().subtract(29, 'days'),
      endDate  : moment()
    }, function (start, end) {
      updateStats(start.format('MM/DD/YYYY'), end.format('MM/DD/YYYY'));
      setDateRange('userDaterange', start.format('LL'), end.format('LL'));
    });
}
function updateStats(startDate, endDate) {
    var username = $('#username').find(':selected').text();
    var url = window.location.origin + '/api/user';
    $.ajax({
        url: url,
        type: 'post',
        data: {
            startDate: startDate,
            endDate: endDate,
            region: region,
            user: username,
        }
    }).done(function(response) {
        var data = JSON.parse(response);
        console.log(data);
        var completed = data.completed;
        var avgScores = data.avgScores;
        $('.progress-bar').each(function(index) {
            var id = $(this).attr('id');
            if(completed[id] != undefined) {
                $(this).css('width', completed[id]+'%');
            }
            else {
                $(this).css('width', '0%');
            }

        });
        $('.quizScores').each(function(index) {
            var id = $(this).attr('id');
            var selector = id.substr(4);
            if(avgScores[selector] != undefined) {
                $(this).text(avgScores[selector]);
            }
            else {
                $(this).text(0);
            }

        });

    }).fail(function(jqXHR, textSatus, errorThrown) {
        console.log("Couldn't retrieve Data");
    });
}


function updateChart(chartid, startDate, endDate) {
    if(chartid == 'course-quizScoresChart') {
        var url = window.location.origin+'/api/users/'+region;
        $.ajax({
            url: url,
            type: 'post',
            data: {
                startDate: startDate,
                endDate: endDate,
                course: $('#courseRegion').find(':selected').text(),
                iwant: 'avgScores'
            }
        }).done(function(response) {
            var obj = JSON.parse(response);
            var xAxis = [];
            var yAxis = [];
            var i = 0;
            console.log(response);
            for(var key in obj) {
                xAxis.push(key);
                yAxis.push(obj[key]);
            }
            courseQuizScores.data.labels = xAxis;
            courseQuizScores.data.datasets[0].data = yAxis;
            courseQuizScores.update();

        }).fail(function(jqXHR, textSatus, errorThrown) {
            console.log("Couldn't retrieve data");
        });
    }
    else if(chartid == 'course-usersTakenChart') {
        var url = window.location.origin + '/api/users/' + region;
        $.ajax({
            url: url,
            type: 'post',
            data: {
                startDate: startDate,
                endDate: endDate,
                course: $('#courseRegion').find(':selected').text(),
                iwant: 'percentageTaken'
            }
        }).done(function(response) {
            var data = JSON.parse(response);
            courseUsersTaken.data.datasets[0].data = data;
            courseUsersTaken.update();

        }).fail(function(jqXHR, textSatus, errorThrown) {
            console.log("Couldn't retrieve Data");
        });
    }
    else if(chartid == 'region-quizScoresChart') {
        var url = window.location.origin + '/api/regions';
        $.ajax({
            url: url,
            type: 'post',
            data: {
                startDate: startDate,
                endDate: endDate,
                iwant: "avgScores"
            }
        }).done(function(response) {
            var data = JSON.parse(response);
            regionQuizScores.data.labels = data.regions;
            regionQuizScores.data.datasets[0].data = data.users;
            regionQuizScores.update();
        }).fail(function(jqXHR, textStatus, errorThrown){
          console.log("fail" + textStatus);
        });
    }
    else if(chartid == 'region-usersTakenChart') {
        var url = window.location.origin + '/api/regions';
        $.ajax({
            url: url,
            type: 'post',
            data: {
                startDate: startDate,
                endDate: endDate,
                region: region,
                iwant: 'usersTaken'
            }
        }).done(function(response) {
            var data = JSON.parse(response);
            regionUsersTaken.data.labels = data.courses;
            regionUsersTaken.data.datasets[0].data = data.completed;
            regionUsersTaken.update();

        }).fail(function(jqXHR, textSatus, errorThrown) {
            console.log("Couldn't retrieve Data");
        });
    }
}

function initRegionUsersTaken() {
    var ctx = document.getElementById('region-usersTakenChart').getContext('2d');

    // Get default date range
    var dateRange = getDefaultDates().map(function(date) {
        var val = date.format('lll');
        if(val.charAt(5) == ',') return date.format('lll').substr(0,5);
        else return date.format('lll').substr(0,6);

    });

    regionUsersTaken = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Basic Sales', 'Internet Sales', 'Advertise'],
            datasets: [
                {
                    label: 'Percentage of Users Completed',
                    backgroundColor: '#4FC3F7',
                    borderColor: '#1565C0',
                    data: [
                        0,
                        10,
                        5,
                    ]
                }
            ]
        },

        // Configuration options go here
        options: {}
    });
}



function initRegionQuizScores() {
    var ctx = document.getElementById('region-quizScoresChart').getContext('2d');

    // Get default date range
    var dateRange = getDefaultDates().map(function(date) {
        var val = date.format('lll');
        if(val.charAt(5) == ',') return date.format('lll').substr(0,5);
        else return date.format('lll').substr(0,6);

    });

    var courseName = $('#courseRegion').find(':selected').text();

    regionQuizScores = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Dhaka', 'Sylhet', 'Chittagong', 'Rajshahi', 'Comilla'],
            datasets: [
                {
                    label: 'Average Quiz Scores',
                    backgroundColor: '#4FC3F7',
                    borderColor: '#1565C0',
                    data: [
                        0,
                        10,
                        5,
                        2,
                        20
                    ]
                }
            ]
        },

        // Configuration options go here
        options: {}
    });
}

function initCourseQuizScores() {
    var ctx = document.getElementById('course-quizScoresChart').getContext('2d');

    // Get default date range
    var dateRange = getDefaultDates().map(function(date) {
        var val = date.format('lll');
        if(val.charAt(5) == ',') return date.format('lll').substr(0,5);
        else return date.format('lll').substr(0,6);

    });

    var courseName = $('#courseRegion').find(':selected').text();

    courseQuizScores = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateRange,
            datasets: [
                {
                    label: courseName,
                    backgroundColor: '#4FC3F7',
                    borderColor: '#1565C0',
                    data: [
                        0,
                        10,
                        5,
                        2,
                        20,
                        30,
                        45
                    ]
                }
            ]
        },

        // Configuration options go here
        options: {}
    });
}
