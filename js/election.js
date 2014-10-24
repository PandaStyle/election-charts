
var data2002GOVDem,
    data2006GOVDem,
    data2010GOVDem,
    data2010SpecialSenate,
    data2012Senate,
    data2013SpecialSenate,
    dataLive,
    dataLiveFull;


var url2002GovDem =  'data/2002-Gov-Gen-OBrien-and-Gabrieli.json',
    url2006GovDem = 'data/2006-Gov-Gen-Patrick-and-Murray.json',
    url2010GovDem = 'data/2010-Gov-Gen-Patrick-and-Murray.json',

    url2010SpecialSenate = 'data/2010-US-Special-Senate-Martha-Coakley.json',

    url2012Senate = 'data/2012-US-Senate-Elizabeth-A-Warren.json',

    url2013SpecialSenate = 'data/2013-US-Special-Senate-Edward-J-Markey.json',

    // RaceNumber and CandidateID
    raceNumber = 22957,
    candidateId = 39385862,
    urlLive = 'http://ma-staging.electionstats.com/elections/get_granular_margins_ap/'+raceNumber+'/'+candidateId+'.json';


var ma_localities = get_ma_localities();

var currentLocalitiesReporting = [];
var currentFirstReportedTime = null;
var currentLiveData = {};
var isElectionComplete = false;

var window_info = {width: $(window).width() };

var refresh_counter = 0;

/**
 * Singleton names for all charts/maps
 */
var TimeLineChart, TownBubbleChart, Map;




/**
 * load_page_data
 */
function load_page_data(){
    var is_redraw_blocked = false;

    // Redraw charts on resize
    $(window).on('resize',function(){
        window.setTimeout(function() {
            if (!is_redraw_blocked && Math.abs($(window).width() - window_info.width) > 10) {
                window_info.width = $(window).width();
                console.log('redrawing...');
                is_redraw_blocked = true;

                // Call the redraw functions
                TimeLineChart.chart.draw(TimeLineChart.dataTable, TimeLineChart.options);
                TownBubbleChart.chart.draw(TownBubbleChart.dataTable, TownBubbleChart.options);
                TownBubbleChart.drawXYLine();

                google.maps.event.trigger(Map.map, "resize");

                is_redraw_blocked = false;
                console.log('done.');
            }
            else {
                console.log('redraw blocked!');
            }
        }, 300);
    });


    $.when(
        $.getJSON(url2002GovDem),
        $.getJSON(url2006GovDem),
        $.getJSON(url2010GovDem),
        $.getJSON(url2010SpecialSenate),
        $.getJSON(url2012Senate),
        $.getJSON(url2013SpecialSenate),
        $.getJSON(urlLive)
    ).done(function(x, y, z, v, w, k, u) {

            data2002GOVDem = _.map(x[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            }),
            data2006GOVDem =  _.map(y[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            }),
            data2010GOVDem =  _.map(z[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            }),
            data2010SpecialSenate = _.map(v[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            }),
            data2012Senate = _.map(w[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            }),
            data2013SpecialSenate = _.map(k[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            }),

            dataLive = _.map(u[0].output.margins.pct_votes, function(a, b){
                return [b, a];
            });

            dataLiveFull = u[0].output;


            // Draw the basic charts (no data yet)

            TownBubbleChart.init();
            Map.init();
            ReportList.init();
            TimeLineChart.init();


            var refreshInterval = 20; // in seconds

            // Refresh once upon page load to pull existing data
            refreshCharts();

            // Then refresh on an interval
            var intervalID = window.setInterval(function(){

                if(refresh_counter > 2) { console.log('3 refreshes reached. Ending data refresh loop.'); window.clearInterval(intervalID); }

                refreshCharts();

                refresh_counter++;

            }, refreshInterval*1000);


    }).fail(function (jqXHR, textStatus) {
            console.error('Failed to call all initial when/done requests:'+' '+textStatus);
            console.error('Server Response in log below:');
            console.log(jqXHR.responseText);
    });

} // END function load_page_data()



/**
 * Stand-alone function called on a time interval to continually redraw the charts/map with new data from server
 *
 */
function refreshCharts() {


    $.when(
        $.ajax({
            url: urlLive,
            type: "POST",
            // data:  {'filter_by_locality': currentTowns},
            dataType: 'json',
            async: true
        })
    ).done(function(data) {

        // Update all charts with any new towns/votes

        console.log('Live (AP) data retrieved from server.');
        console.log(data.output);

        if(data.output.localities_reporting.length > currentLocalitiesReporting.length) {

            Loader.show();

            console.log('Changes found ('+data.output.localities_reporting.length+' total localities): updating charts...');

            currentLocalitiesReporting = data.output.localities_reporting;

            if(currentLocalitiesReporting.length >= 351) {
                isElectionComplete = true;
            }


            _.each(data.output.margins_total_by_time,function(v,k) { currentFirstReportedTime = k; return; });



            TimeLineChart.updateData(data);
            TownBubbleChart.updateData(data);
            Map.updateData(data);
            ReportList.updateData(data);

            currentLiveData = data;




            console.log('Update complete.');
            Loader.hide();
        }
        else {
            console.log('No changes found: Don\'t update charts.');
        }




    });
}




/**
 * TimeLineChart singleton
 */
TimeLineChart = {

    xAxisHoursAhead: 2, // change this to change the width of the chart
    dataTable: null,
    options: {},
    chart: null,
    listOfShowHideColumns: null,
    listOfShowHideSeries: null,


    updateData: function (data) {

        var a = new Date();

        var localities            = data.output.localities_reporting;
        var localities_by_time    = data.output.localities_reporting_by_time;
        var margins_total_by_time = data.output.margins_total_by_time;

        if(!localities_by_time) { return false; }

        var rows = this.dataTable.getNumberOfRows();

        if(rows) {
            this.dataTable.removeRows(0, rows);
        }

        var lastDateTime = null;
        var cumulativeLocalities = [];

        var i=0;
        for(datetime in localities_by_time) {

            cumulativeLocalities = cumulativeLocalities.concat(localities_by_time[datetime]);

            var historicals = this.calculateHistoricalMargins(cumulativeLocalities);

            var array = [

                margins_total_by_time[datetime]['pct_votes'],

                historicals[0],

                historicals[1],

                historicals[2],

                historicals[3],

                historicals[4],

                historicals[5],

                cumulativeLocalities

            ];

            lastDateTime = datetime;


            this.addRowstoChart(array, datetime);
            i++;
        }

        if(!isElectionComplete) {

            // Add blank data point to create a gap in the line
            array = [
                '_', '_', '_', '_', '_', '_', '_','_'

            ];

            var datetime = moment().format('YYYY-MM-DD') + ' 23:30:00';

            this.addRowstoChart(array, datetime);
        }


        // Get margins
        var historicals = this.calculateHistoricalMargins();

        // Add last data point to simulate ending margin
        array = [
            !isElectionComplete? '_': data.output.margin_total.pct_votes,

            historicals[0],

            historicals[1],

            historicals[2],

            historicals[3],

            historicals[4],

            historicals[5],

            cumulativeLocalities

        ];



        var datetime = lastDateTime;

        if(!isElectionComplete) {
            var datetime = moment(lastDateTime).add(1, 'hour').format('YYYY-MM-DD HH:mm:00');

        }

        this.addRowstoChart(array,datetime,true);

        //console.log(google.visualization.dataTableToCsv(this.dataTable));

    },

    calculateHistoricalMargins: function (localities) {

        var method_base_url = 'http://ma-staging.electionstats.com/elections/get_granular_margins';
        var resultArray = [];

        var urls = {
            url2013SpecialSenate: method_base_url + '/24364/Edward-J-Markey.json',
            url2012Senate: method_base_url + '/22519/Elizabeth-A-Warren.json',
            url2010SpecialSenate: method_base_url + '/14528/Martha-Coakley.json',
            url2010Governor: method_base_url + '/15310/Patrick-and-Murray.json',
            url2006Governor: method_base_url + '/12966/Patrick-and-Murray.json',
            url2002Governor: method_base_url + '/19968/OBrien-and-Gabrieli.json'
        };



        // This can be run on the server to simulate 10 new cities/towns reporting in votes
        //php cake.php a_p_data simulate_ap_changes

        for (var i in urls) {
            var url = urls[i];
            $.ajax({
                url: url,
                type: "POST",
                data: {'filter_by_locality': localities},
                dataType: 'json',
                async: false
            })
                .done(function (data) {
                    var a = data.output.margin_total.pct_votes;
                    resultArray.push(a);


                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log("Historical margin call failed. ", jqXHR, textStatus, errorThrown);
                    alert("Error calling the server.");
                });
        }

        return resultArray;
    },

    toPerc: function(v,append){
        if(v===null) { return ''; }

       // else if (v === '_') { return '_'; }
       // else if (typeof(v) == 'string') {return v;}
       // v = Number(v);

        var ret = ((v*100).toFixed(2)) / 1;
        if(typeof append != 'undefined') { ret = ret.toString(); ret =+ append; }

        return ret;

    },

    addRowstoChart: function (array, datetime, isLast) {

        if(typeof isLast == 'undefined') { var isLast = false; }

        // Adjust date string to fix FF, Safari errors
        datetime = datetime.replace(' ','T')+'-0400';

        //console.log(new Date(datetime));
        //console.log(array);

        // Adjust the x-axis values
        var dateCompare = new Date(this.options.hAxis.minValue);
        var dateCompare2 = new Date('2010-01-01T20:00:00');

        if(dateCompare.getFullYear() == dateCompare2.getFullYear()) {
            var min = currentFirstReportedTime?
                new Date(currentFirstReportedTime.replace(' ','T')).getTime():
                new Date(datetime).getTime();
            this.options.hAxis.minValue = new Date(datetime);
            this.options.hAxis.maxValue = new Date(moment().format('YYYY-MM-DD ')+' 23:59:00'); // new Date(min + ( (this.xAxisHoursAhead) * 60*60*1000));

        }
        this.options.hAxis.viewWindowMode = 'maximized';

        if(isLast) {
            this.options.hAxis.maxValue = new Date(datetime);
        }

        var rowValues = [
            this.toPerc(array[0]),

            this.toPerc(array[1]),

            this.toPerc(array[2]),

            this.toPerc(array[3]),

            this.toPerc(array[4]),

            this.toPerc(array[5]),

            this.toPerc(array[6])
        ];
        var cumulativeLocalities = array[7];

        var row = [
            new Date(datetime),
            this.formatTooltip(datetime,this.columnLabels,rowValues,cumulativeLocalities.length)
        ];

        row = row.concat(rowValues);


        this.dataTable.addRows([
            row
        ]);


        this.chart.draw(this.dataTable, this.options);

    },


    configureShowHideBehavior: function () {
        // create columns array
        var columns = [];
        // display these data series by default
        var defaultSeries = [1];
        var series = {};
        for (var i = 0; i < this.dataTable.getNumberOfColumns(); i++) {
            if (i == 0 || defaultSeries.indexOf(i) > -1) {
                // if the column is the domain column or in the default list, display the series
                columns.push(i);
            }
            else {
                // otherwise, hide it
                columns.push({
                    label: this.dataTable.getColumnLabel(i),
                    type:  this.dataTable.getColumnType(i),
                    sourceColumn: i,
                    calc: function () {
                        return null;
                    }
                });
            }
            if (i > 0) {
                /*
                    columns.push({
                        calc: 'stringify',
                        sourceColumn: i,
                        type: 'string',
                        role: 'annotation'
                    });
                */
                // set the default series option
                series[i - 1] = {};
                if (defaultSeries.indexOf(i) == -1) {
                    // backup the default color (if set)
                    if (typeof(series[i - 1].color) !== 'undefined') {
                        series[i - 1].backupColor = series[i - 1].color;
                    }
                    series[i - 1].color = '#CCCCCC';
                }
            }
        }
        this.listOfShowHideColumns = columns;
        this.listOfShowHideSeries  = series;
    },
    showHideSeries: function () {

        var sel     = this.chart.getSelection();
        var columns = this.listOfShowHideColumns;
        var series  = this.listOfShowHideSeries;
        var data    = this.dataTable;

        // if selection length is 0, we deselected an element
        if (sel.length > 0) {
            // if row is undefined, we clicked on the legend
            if (sel[0].row == null) {
                var col = sel[0].column;
                if (typeof(columns[col]) == 'number') {
                    var src = columns[col];

                    // hide the data series
                    columns[col] = {
                        label: data.getColumnLabel(src),
                        type:  data.getColumnType(src),
                        sourceColumn: src,
                        calc: function () {
                            return null;
                        }
                    };

                    // grey out the legend entry
                    series[src - 1].color = '#CCCCCC';
                }
                else {
                    var src = columns[col].sourceColumn;

                    // show the data series
                    columns[col] = src;
                    series[src - 1].color = null;
                }
                var view = new google.visualization.DataView(data);
                view.setColumns(columns);
                this.chart.draw(view, this.options);
            }
        }
    },
    formatTooltip: function(time,columnLabels,rowData,localities) {
        var table = '<table cellpadding="0" cellspacing="0">';
        _.each(columnLabels , function (label, i) {
            table += '<tr class="'+(rowData[i]>=0?'positive':'negative')+'">' +
            '<td class="data-label"><span class="office">' + label.replace(':','</span><br /><span class="candidate">') + '</span></td>' +
            '<td class="value">' + rowData[i] + '%</td>' +
            '</tr>';
        });
        table += '</table>';

        var html = '<div class="tooltip-for-chart">' +
            '<div class="title"><span class="time">' + moment(time).format('h:mmA') + '&nbsp;</span>' +
            '<span class="localities">' + localities + ' cities/towns reporting</span>' +
            '</div>' +
            table +

            '</div>';
        return html;
    },
    init: function () {
        var this1 = this;
        var hours_before = 8;
        var hours_after  = 5;

        var hour_ts = 60*60*1000;

        var timeMin = new Date(new Date().getTime()-(hour_ts*hours_before));

        var timeMax = new Date(new Date().getTime()+(hour_ts*hours_after));

        this.options = {
            title: 'Timeline Comparing Democratic Vote Margins',
                series: {
                0: {
                    color: '#000',
                        lineWidth: 4
                }
            },
            curveType: 'function',

            // This line makes the entire category's tooltip active.
            focusTarget: 'category',
            // Use an HTML tooltip.
            tooltip: { isHtml: true },



            hAxis: {
                title: 'Timeline of cities/towns reporting',
                    gridlines: {
                    color: "#e4e4e4"
                },
                minValue: new Date('2010-01-01T20:00:00'),
                maxValue: new Date('2010-01-01T23:59:00'),
                format: "h:mm"
            },
            vAxis:
                {title: 'Vote margin',format: '#\'%\''}
             ,
            legend: {
                position: 'top',
                maxLines: 2,
                textStyle: { fontSize: 12 }

            },
            pointSize: 5,

            chartArea: {
                top: 70,

                backgroundColor: {
                    stroke: '#222',
                    strokeWidth: 1
                }
            }
            // NOTE: If legend position:'right', then add this to chartArea: left: 70

        };


        this.dataTable = new google.visualization.DataTable();

        this.dataTable.addColumn('datetime', 'Time');

        // Issue: even if some lines are turned off, the tooltip displays for all items.
        // Thus, might be better to turn off this custom tooltip.
        this.dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});

        this.columnLabels = [
            '2014 Gov: Coakley v Baker',
            '2013 Senate: Markey v Gomez',
            '2012 Senate: Warren v Brown',
            '2010 Senate: Coakley v Brown',
            '2010 Gov: Patrick v Baker',
            '2006 Gov: Patrick v Healey',
            '2002 Gov: O’Brien v Romney'];

        _.each(this.columnLabels,function(v,k) {
            this1.dataTable.addColumn('number', v);
           // this1.dataTable.addColumn({type:'boolean', role:'certainty'}); // used for last point dashed line
            //this1.dataTable.addColumn({type:'string',  role:'annotation'}); // used for last point text label
        });



        this.chart = new google.visualization.LineChart(document.getElementById('line-visualization'));

        this.chart.draw(this.dataTable, this.options);

        this.configureShowHideBehavior();

        google.visualization.events.addListener(this1.chart, 'select', function(){ this1.showHideSeries(); });

    }



}; // END var TimeLineChart


/**
 * TownBubbleChart singleton
 */
var TownBubbleChart = {
	data: null,
    dataTable: null,
    options: {},
    chart: null,
    baseCandidate: 'Coakley',
    comparingCandidate: 'Unknown',
    xyLine: null,


    init: function() {

        var this1 = this;

        $('#base, #comp').change(function () {
                this1.updateData(this1.data);
            });

        this.dataTable = new google.visualization.DataTable();

        this.dataTable.addColumn('string', 'town');
        this.dataTable.addColumn('number', this.baseCandidate+' margin');
        this.dataTable.addColumn('number', this.comparingCandidate+' margin');
        this.dataTable.addColumn('number', '');
        this.dataTable.addColumn('number', this.baseCandidate+' raw margin');


        var yAxisTextBottom = $('#comp :selected').attr('data-text'),
            xAxisTextBottom = "2014 Gov: Martha Coakley";

        this.options = {
            title: 'Town-by-Town Comparing Vote Margins',
            colors: ['red', 'blue'],
            bubble : {
                opacity: 0.5,
                textStyle: {
                    color: "transparent"
                }
            },
            legend: {position: 'none'},
            colorAxis: { legend: { position: 'none' } },
            hAxis: {

                gridlines: {
                    color: "#E4E4E4"
                },
                minValue: -100,
                maxValue: 100,
                format:'#,###%',
                title: xAxisTextBottom,
                ticks: [{v:-50, f:'-50%'}, {v:0, f:'0'}, {v:50, f:'50%'}]
            },
            vAxis: {
                gridlines: {
                    color: "#E4E4E4"
                },
                minValue: -100,
                maxValue: 100,
                format:'#,###%',
                slantedText:true,
                slantedTextAngle:90,
                title: yAxisTextBottom,
                ticks: [{v:-50, f:'-50%'}, {v:0, f:'0'}, {v:50, f:'50%'}]

            },
            chartArea: {
                left: 70, top: 70 ,
                backgroundColor: {
                    stroke: '#000',
                    strokeWidth: 1
                }
            },
            backgroundColor: 'transparent',
            sizeAxis: {
                minSize: 1,
                maxSize: 18
            },
            tooltip: {isHtml: true}
        };

        // create and draw the visualization.

        this.chart = new google.visualization.BubbleChart(document.getElementById('visualization'));
        this.chart.draw(this.dataTable, this.options);


        this.drawXYLine();


    },


    compare: function(data, toCompareJsonUrl){
        var this1 = this;
        if(!data) { return false; }

        $.when(
            data,
            $.getJSON(toCompareJsonUrl)
        ).done(function(base, comp) {

// TO DO: get total votes cast for each muni, or population, put this in the combined tooltip!

                var basePctVotes = _.map(data.output.margins.pct_votes, function(a, b){
                        return [b, a];
                    }),
                    compPctVotes =  _.map(comp[0].output.margins.pct_votes, function(a, b){
                        return [b, a];
                    }),
                    baseNumVotes = _.map(data.output.margins.n_votes, function(a, b){
                        return [b, a];
                    }),
                    compNumVotes = _.map(comp[0].output.margins.n_votes, function(a, b){
                        return [b, a];
                    });




                // If lengths different, then equalize lengths to conform to the shorter of the two
                if(basePctVotes.length != compPctVotes.length){

                    var sets  = [compPctVotes,basePctVotes];
                    var short_to_long = [1,0];
                    if(compPctVotes.length < basePctVotes.length) {
                        short_to_long = [0,1];
                    }

                    var resShorter = [],
                        newBaseNumVotes = [];

                    _.each(sets[short_to_long[0]], function(shorterItem, a){

                        // Percentages
                        var d = _.find(sets[short_to_long[1]], function(longerItem){

                            return longerItem[0] == shorterItem[0];
                        });
                        resShorter.push(d);

                        // Numbers
                        var d2 = _.find(baseNumVotes, function(longerItem){

                            return longerItem[0] == shorterItem[0];
                        });
                        newBaseNumVotes.push(d2);

                    });

                    if(compPctVotes.length < basePctVotes.length) {
                        basePctVotes = resShorter;
                    } else {
                        compPctVotes = resShorter;
                    }


                    var compArrayShort = this1.createScatterArray(basePctVotes, compPctVotes,baseNumVotes);
                    this1.drawVisualization(compArrayShort);

                }
                else {

                    var compArray = this1.createScatterArray(basePctVotes, compPctVotes, baseNumVotes);
                    this1.drawVisualization(compArray)
                }

            });
    },

    createScatterArray: function(base, array, array2){

        var result = _.map(base, function(item, i) {

            return [((item[1]*100).toFixed(2))/1, ((array[i][1]*100).toFixed(2))/1, item[0], array2[i][1]];
        });

        return result;
    },

    drawVisualization: function(array) {

        var this1 = this;

        var rows = this.dataTable.getNumberOfRows();

        if(rows) {
            this.dataTable.removeRows(0, rows);
        }

		

        _.each(array, function(item){
            this1.dataTable.addRows([
                [ 
					item[2], 
					item[0],
					item[1], 
					item[0],
					item[3]
				]
            ]);
        });



		var formatter = new google.visualization.NumberFormat({
			fractionDigits: 1,
			suffix: '%'
		});
		formatter.format(this.dataTable, 1);
		formatter.format(this.dataTable, 2);


        var yAxisTextBottom = $('#comp :selected').attr('data-text');
        this.options.vAxis.title = yAxisTextBottom;




        this.chart.draw(this.dataTable, this.options);




    },


    drawXYLine: function(){
        this.xyLine = new google.visualization.ChartWrapper({
            chartType: 'LineChart',
            containerId: 'hack_chart_div',
            dataTable: [['x', 'y'],[-100, -100], [100, 100]],
            options: {
              
                hAxis: {
                    minValue: -100,
                    maxValue: 100,
                    textPosition: 'none',
                    gridlines: {
                        count: 0
                    },
                    baselineColor: 'none'
                },
                vAxis: {
                    minValue: -100,
                    maxValue: 100,
                    textPosition: 'none',
                    gridlines: {
                        count: 0
                    },
                    baselineColor: 'none'
                },
				chartArea: { left: 70, top: 70 },
                colors: ['black'],
                pointSize: 1,
                lineWidth: 1,
                enableInteractivity: false,
                legend: {
                    position: 'none'
                },
                series: {
                   // 0: { lineDashStyle: [14, 2, 7, 2] }
                }
            }
        });
        this.xyLine.draw();
    },

    hideOptions: function(){
        var selectedParty =$('#comp :selected').attr('data-party'),
            selectedVal = $('#comp :selected').val();


        $('#base').find("[data-party!=" + selectedParty + "]").hide();

        $('#base').find("[data-party=" + selectedParty + "]").show();

        $('#base').find("[value='" +  selectedVal + "']").hide();
    },

    updateData: function(data) {

        var this1 = this;

        this.data = data;

        this.compare(data, $('#comp').val());
        this.comparingCandidate = $('#comp :selected').attr('data-last-name');

        console.log('comparingCandidate: '+this.comparingCandidate);

        this.hideOptions();

        this.drawXYLine();
    }

}; // END var TownBubbleChart




/** 
 * LocalityInfo singleton
 * Is the information pane for cities/towns, used by both map and bubble chart
 *
 */
var LocalityInfo = {

	tooltip: null,
    tooltip_selector: '#locality-info-window',

    tooltipOffset: {x: 5, y: -25},
	
	hide: function(event,parentObj) {
		!this.tooltip? this.tooltip = $(this.tooltip_selector): '';
        this.tooltip.hide();
	},

	show: function(event,parentObj) {
		//if(typeof parentObj.panTo === 'function') {
			//var map = parentObj;	
		//}

        !this.tooltip? this.tooltip = $(this.tooltip_selector): '';

        for(var e in event){

            if(event[e] != undefined){
                if((event[e].constructor.name == 'MouseEvent')||(event[e].constructor.toString() == '[object MouseEvent]')||(event[e].constructor.toString() == '[object MouseEventConstructor]')){


                    var locality_name = event.feature.getProperty('TOWN').capitalize(true);

                        datas = [
                            {arr: dataLive, text: '2014 Governor', cand: 'Martha Coakley'},
                            {arr: data2013SpecialSenate, text: '2013  Senate', cand: 'Edward Markey'},
							{arr: data2012Senate, text: '2012 Senate', cand: 'Elizabeth Warren'},
							{arr: data2010SpecialSenate, text: '2010 Senate ', cand: 'Martha Coakley'},
							{arr: data2010GOVDem, text: '2010 Governor', cand: 'Deval Patrick'},
							{arr: data2006GOVDem, text: '2006 Governor', cand: 'Deval Patrick'},
							{arr: data2002GOVDem, text: '2002 Governor', cand: 'Shannon O\'Brien'}
                   
                        ];



                    var pcts = [];

                    for(var i = 0; i < datas.length; i++){

                        var value =  _.find(datas[i]['arr'], function(a){
                             return a[0] == locality_name;
                        });
                        pcts[i] = false;
                        if(typeof value != 'undefined') {pcts[i] = value[1]; }

                    }

                    if(pcts.length != datas.length){
                        console.warn("pct array length != datas length")
                    }

                    this.tooltip.find('.pcts').empty();
                    this.tooltip.find('.live').empty();

                    for(var i = 0; i < pcts.length; i++){

                        var pcts_text = !pcts[i]? 'N/A': (pcts[i]*100).toFixed(2) +'%';
                        var pos_neg = pcts[i] > 0? 'positive':'negative';

						var row = $('<div class="pct-item '+pos_neg+'">' +
                            '<span class="election">' + datas[i]['text'] +' </span> ' +
                            '<span class="cand">' + datas[i]['cand'] + ': </span> ' +
                            '<span class="value">' + pcts_text + '</span> ' +
                            '</div> ');

                        if(i==0){
                            this.tooltip.find('.live').append(row);
                            continue;
                        }

                        this.tooltip.find('.pcts').append(row);
                    }


                    this.tooltip.find('.town').text(locality_name);
                    this.tooltip.show();
                }
            }

        }


    } // END show() method

} // END LocalityInfo() obj



/**
 * Map()
 *
 */
var Map = {
    data: null,
    options: {},
    bounds: null,
    map: null,
    featureStyles: {},
    colorKey: { // light to dark
        blue: [
            '#69B6FC',
            '#1B77E9',
            '#124F9A'
        ],
        red: [
            '#F98782',
            '#C4503D',
            '#90392B'
        ]
    },

    updateData: function(data) {
        var this1 = this;

        var localities_reporting = data.output.localities_reporting;


        localities_reporting    = localities_reporting.map(function(x){ return x.toLowerCase(); })
        margins                 = [];
        _.each(data.output.margins.pct_votes,function(v,k){

            margins[k.toLowerCase()]=v;
        });

        // Color each letter gray. Change the color when the isColorful property
        // is set to true.
        this.map.data.setStyle(function (feature) {

            var localityName = feature.getProperty('TOWN').toLowerCase();

            var styles = {};

            if(localities_reporting.indexOf(localityName) > -1) {

                var c = '#999';
                var margin = margins[localityName];

                if(margin > 0 && margin < 0.05) {
                    c = this1.colorKey.blue[0];
                }
                else if(margin >= 0.05 && margin < 0.15) {
                    c = this1.colorKey.blue[1];
                }
                else if(margin >= 0.15) {
                    c = this1.colorKey.blue[2];
                }
                // Red
                else if(margin < 0 && margin > -0.05) {
                    c = this1.colorKey.red[0];
                }
                else if(margin <= -0.05 && margin > -0.15) {
                    c = this1.colorKey.red[1];
                }
                else if(margin <= -0.15) {
                    c = this1.colorKey.red[2];
                }


                styles.fillColor = c;

            }


            // Override any matching defaults
            var styles = $.extend({}, this1.featureStyles, styles);



            /*
             if (feature.getProperty('isColorful')) {
             color = feature.getProperty('color');
             }
             */



            return styles;
        });

    },

	init: function() {
        var this1 = this;

        this.options = {
            zoom: 8,
            //center: {lat: 42.12, lng: 288.3},
            disableDefaultUI: true,
            scrollwheel: false,
            backgroundColor: '#FFFFFF'

        };


        // Create a simple map.
        this.map = new google.maps.Map(document.getElementById('map-canvas'), this.options);

        // Default styles
        this1.featureStyles = {
            fillColor: '#CCC',
            fillOpacity: 1.0,
            strokeWeight: 1.5,
            strokeColor: "#FFF",
            strokeOpacity: 1.0
        }
        this.map.data.setStyle(this1.featureStyles);

        // Customize the styling further
        var styles = [
            {
                stylers: [
                    //{hue: "#00ffe6"},
                    {saturation: 0},
                    {visibility: 'off'} // turns EVERYTHING off
                ]
            }
        ];

        this.map.setOptions({styles: styles});

        // Bounding box
        this.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(42.12, 288.3), new google.maps.LatLng(42.12, 288.3));



        // Load a GeoJSON from the same server
        $.getJSON("geo/towns.topojson", function (data) { this1.addGeoJson(data); });



        this.map.fitBounds(this.bounds);

        var listener = google.maps.event.addListenerOnce(this.map, "idle", function () {
            this1.map.setZoom(7 + 1);   // this1.map.getZoom() is returning 22 -- which is bad.
            this1.map.panBy(20,0);
        });



        this.map.data.addListener('mouseover', function (event) {
            this1.map.data.overrideStyle(event.feature, {
                //fillColor: "#444",
                strokeColor: '#000',
                strokeWeight: 2,
                zIndex: 99999
            });

            LocalityInfo.show(event, this1.map);
        });

        this.map.data.addListener('mouseout', function (event) {

            this1.map.data.revertStyle();
            LocalityInfo.hide(event, this1.map);

        });


        String.prototype.capitalize = function (lower) {
            return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
        };

    }, // END init()

    addGeoJson: function(data) {
        var this1 = this;

        var geoJsonObject = topojson.feature(data, data.objects.ma);
        this.map.data.addGeoJson(geoJsonObject);


        _.each(geoJsonObject.features, function (row) {
            _.each(row.geometry.coordinates[0], function (pair) {
                var point = new google.maps.LatLng(pair[1], pair[0]);

                this1.bounds.extend(point);
            });
        });


    }
}; // END var Map


/**
 * @description Area containing lists of cities/towns that report 100% at each time interval
 * @type {{container: string, emptyHtml: string, init: Function, updateData: Function}}
 */
var ReportList = {

    container: '#localities-reporting',

    emptyHtml: '<span class="empty-results">Waiting for cities and towns to report...</div>',


    init: function() {
        $(this.container).html(this.emptyHtml);

    },


    updateData: function(data) {
        if(!data) { this.init(); return; }

        var out = '',
            n_locs = 0;
        _.each(data.output.localities_reporting_by_time, function(v,k) {
            out += '<span class="localities-by-time"><span class="datetime">'+moment(k).format('h:mmA')+', '+ v.length+' cities/towns:</span><span class="list"> '+ v.join(', ') +'</span></span>';
            n_locs += v.length;
        });

        out = '<h3>Cities and Towns Reporting: <span>'+n_locs+' of 351</span></h3>' + out;

        $(this.container).html(out);

    }

};



/**
 * Loader
 * @description Shows and hides an AJAX/data loader notification element
 */
var Loader = {
    selector: '#loader-for-page',

    hide: function(){
        $(this.selector).fadeOut(300);
    },
    show: function(){
        $(this.selector).fadeIn(300);
    }
};

/**
 *
 * @returns {Array.<string>} list of localities
 */

function get_ma_localities() {
	
   var out = ["Abington",
    "Acton",
    "Acushnet",
    "Adams",
    "Agawam",
    "Alford",
    "Amesbury",
    "Amherst",
    "Andover",
    "Aquinnah",
    "Arlington",
    "Ashburnham",
    "Ashby",
    "Ashfield",
    "Ashland",
    "Athol",
    "Attleboro",
    "Auburn",
    "Avon",
    "Ayer",
    "Barnstable",
    "Barre",
    "Becket",
    "Bedford",
    "Belchertown",
    "Bellingham",
    "Belmont",
    "Berkley",
    "Berlin",
    "Bernardston",
    "Beverly",
    "Billerica",
    "Blackstone",
    "Blandford",
    "Bolton",
    "Boston",
    "Bourne",
    "Boxborough",
    "Boxford",
    "Boylston",
    "Braintree",
    "Brewster",
    "Bridgewater",
    "Brimfield",
    "Brockton",
    "Brookfield",
    "Brookline",
    "Buckland",
    "Burlington",
    "Cambridge",
    "Canton",
    "Carlisle",
    "Carver",
    "Charlemont",
    "Charlton",
    "Chatham",
    "Chelmsford",
    "Chelsea",
    "Cheshire",
    "Chester",
    "Chesterfield",
    "Chicopee",
    "Chilmark",
    "Clarksburg",
    "Clinton",
    "Cohasset",
    "Colrain",
    "Concord",
    "Conway",
    "Cummington",
    "Dalton",
    "Danvers",
    "Dartmouth",
    "Dedham",
    "Deerfield",
    "Dennis",
    "Dighton",
    "Douglas",
    "Dover",
    "Dracut",
    "Dudley",
    "Dunstable",
    "Duxbury",
    "East Bridgewater",
    "East Brookfield",
    "East Longmeadow",
    "Eastham",
    "Easthampton",
    "Easton",
    "Edgartown",
    "Egremont",
    "Erving",
    "Essex",
    "Everett",
    "Fairhaven",
    "Fall River",
    "Falmouth",
    "Fitchburg",
    "Florida",
    "Foxborough",
    "Framingham",
    "Franklin",
    "Freetown",
    "Gardner",
    "Georgetown",
    "Gill",
    "Gloucester",
    "Goshen",
    "Gosnold",
    "Grafton",
    "Granby",
    "Granville",
    "Great Barrington",
    "Greenfield",
    "Groton",
    "Groveland",
    "Hadley",
    "Halifax",
    "Hamilton",
    "Hampden",
    "Hancock",
    "Hanover",
    "Hanson",
    "Hardwick",
    "Harvard",
    "Harwich",
    "Hatfield",
    "Haverhill",
    "Hawley",
    "Heath",
    "Hingham",
    "Hinsdale",
    "Holbrook",
    "Holden",
    "Holland",
    "Holliston",
    "Holyoke",
    "Hopedale",
    "Hopkinton",
    "Hubbardston",
    "Hudson",
    "Hull",
    "Huntington",
    "Ipswich",
    "Kingston",
    "Lakeville",
    "Lancaster",
    "Lanesborough",
    "Lawrence",
    "Lee",
    "Leicester",
    "Lenox",
    "Leominster",
    "Leverett",
    "Lexington",
    "Leyden",
    "Lincoln",
    "Littleton",
    "Longmeadow",
    "Lowell",
    "Ludlow",
    "Lunenburg",
    "Lynn",
    "Lynnfield",
    "Malden",
    "Manchester-by-the-Sea",
    "Mansfield",
    "Marblehead",
    "Marion",
    "Marlborough",
    "Marshfield",
    "Mashpee",
    "Mattapoisett",
    "Maynard",
    "Medfield",
    "Medford",
    "Medway",
    "Melrose",
    "Mendon",
    "Merrimac",
    "Methuen",
    "Middleborough",
    "Middlefield",
    "Middleton",
    "Milford",
    "Millbury",
    "Millis",
    "Millville",
    "Milton",
    "Monroe",
    "Monson",
    "Montague",
    "Monterey",
    "Montgomery",
    "Mount Washington",
    "Nahant",
    "Nantucket",
    "Natick",
    "Needham",
    "New Ashford",
    "New Bedford",
    "New Braintree",
    "New Marlborough",
    "New Salem",
    "Newbury",
    "Newburyport",
    "Newton",
    "Norfolk",
    "North Adams",
    "North Andover",
    "North Attleborough",
    "North Brookfield",
    "North Reading",
    "Northampton",
    "Northborough",
    "Northbridge",
    "Northfield",
    "Norton",
    "Norwell",
    "Norwood",
    "Oak Bluffs",
    "Oakham",
    "Orange",
    "Orleans",
    "Otis",
    "Oxford",
    "Palmer",
    "Paxton",
    "Peabody",
    "Pelham",
    "Pembroke",
    "Pepperell",
    "Peru",
    "Petersham",
    "Phillipston",
    "Pittsfield",
    "Plainfield",
    "Plainville",
    "Plymouth",
    "Plympton",
    "Princeton",
    "Provincetown",
    "Quincy",
    "Randolph",
    "Raynham",
    "Reading",
    "Rehoboth",
    "Revere",
    "Richmond",
    "Rochester",
    "Rockland",
    "Rockport",
    "Rowe",
    "Rowley",
    "Royalston",
    "Russell",
    "Rutland",
    "Salem",
    "Salisbury",
    "Sandisfield",
    "Sandwich",
    "Saugus",
    "Savoy",
    "Scituate",
    "Seekonk",
    "Sharon",
    "Sheffield",
    "Shelburne",
    "Sherborn",
    "Shirley",
    "Shrewsbury",
    "Shutesbury",
    "Somerset",
    "Somerville",
    "South Hadley",
    "Southampton",
    "Southborough",
    "Southbridge",
    "Southwick",
    "Spencer",
    "Springfield",
    "Sterling",
    "Stockbridge",
    "Stoneham",
    "Stoughton",
    "Stow",
    "Sturbridge",
    "Sudbury",
    "Sunderland",
    "Sutton",
    "Swampscott",
    "Swansea",
    "Taunton",
    "Templeton",
    "Tewksbury",
    "Tisbury",
    "Tolland",
    "Topsfield",
    "Townsend",
    "Truro",
    "Tyngsborough",
    "Tyringham",
    "Upton",
    "Uxbridge",
    "Wakefield",
    "Wales",
    "Walpole",
    "Waltham",
    "Ware",
    "Wareham",
    "Warren",
    "Warwick",
    "Washington",
    "Watertown",
    "Wayland",
    "Webster",
    "Wellesley",
    "Wellfleet",
    "Wendell",
    "Wenham",
    "West Boylston",
    "West Bridgewater",
    "West Brookfield",
    "West Newbury",
    "West Springfield",
    "West Stockbridge",
    "West Tisbury",
    "Westborough",
    "Westfield",
    "Westford",
    "Westhampton",
    "Westminster",
    "Weston",
    "Westport",
    "Westwood",
    "Weymouth",
    "Whately",
    "Whitman",
    "Wilbraham",
    "Williamsburg",
    "Williamstown",
    "Wilmington",
    "Winchendon",
    "Winchester",
    "Windsor",
    "Winthrop",
    "Woburn",
    "Worcester",
    "Worthington",
    "Wrentham",
    "Yarmouth"];

    return out;
} // END function

