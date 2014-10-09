var data2002GOVDem,
    data2006GOVDem,
    data2010GOVDem,

    data2010SpecialSenate,

    data2012Senate,

    data2013SpecialSenate,

    dataLive;


var url2002GovDem =  'data/2002-Gov-Gen-OBrien-and-Gabrieli.json',
    url2006GovDem = 'data/2006-Gov-Gen-Patrick-and-Murray.json',
    url2010GovDem = 'data/2010-Gov-Gen-Patrick-and-Murray.json',

    url2010SpecialSenate = 'data/2010-US-Special-Senate-Martha-Coakley.json',

    url2012Senate = 'data/2012-US-Senate-Elizabeth-A-Warren.json',

    url2013SpecialSenate = 'data/2013-US-Special-Senate-Edward-J-Markey.json',

    urlLive = 'http://ma-staging.electionstats.com/elections/get_granular_margins_ap/22003/36385859.json';


var ma_localities = ["Abington",
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
    "Yarmouth",
    "Abington",
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


function load_page_data(){

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


            LineChart();

            Tbt();

            Map();


        });

}

function LineChart(){

    var start = new Date("2014/11/01 8:PM"),
        iterationMin = 5,
        iterationTownNumber =20,
        maxcount = 15,

        intervalSec = 15,

        dataTable,
        chart,

        url = "http://ma-staging.electionstats.com/elections/get_granular_margins_ap/22003/36385859.json",

        options = {
            series: {
                0: {
                    color: 'rgb(170, 70, 67)',
                    lineWidth: 6
                }
            },
            hAxis: {
                gridlines: {
                    color: "#e4e4e4"
                },
                minValue: start,
                maxValue: addMinutes(start, maxcount*iterationMin),
                format: "HH:mm"
            },
            vAxis: {
                format: '#\'%\''
            }
        },

        i = 0;


    drawLineChart();


    var intervalID = window.setInterval(function(){  getLiveData((i+1)*iterationTownNumber)}, intervalSec*1000);


    function getLiveData(testnum){

        var a = new Date();
        console.log("GETLIVEDATA START " + testnum);
        var currentTowns =  _.first(ma_localities, testnum);

        $.when(
            $.ajax({
                url: url,
                type: "POST",
                data:  {'filter_by_locality': currentTowns},
                dataType: 'json',
                async: false
            })
        ).done(function(data) {

                var totalMarginAP = data.output.margin_total.pct_votes,
                    historicals = calculateHistoricalMargins(currentTowns);

                var array = [
                    totalMarginAP,
                    historicals[0],
                    historicals[1],
                    historicals[2],
                    historicals[3],
                    historicals[4],
                    historicals[5]
                ];


                addRowstoChart(array, i);

                var b = new Date();

                console.log("GETLIVEDATA END, time taken: " + Math.abs(b.getTime() - a.getTime()) + "ms");
                i++;
                if(i==maxcount){
                    clearInterval(intervalID);
                }
            });

    }

    function calculateHistoricalMargins(townArray){

        var resultArray = [];

        var urls = {
            url2002Governor: 'http://ma-staging.electionstats.com/elections/get_granular_margins/19968/OBrien-and-Gabrieli.json',
            url2006Governor: 'http://ma-staging.electionstats.com/elections/get_granular_margins/12966/Patrick-and-Murray.json',
            url2010Governor: 'http://ma-staging.electionstats.com/elections/get_granular_margins/15310/Patrick-and-Murray.json',
            url2010SpecialSenate: 'http://ma-staging.electionstats.com/elections/get_granular_margins/14528/Martha-Coakley.json',
            url2012Senate: 'http://ma-staging.electionstats.com/elections/get_granular_margins/22519/Elizabeth-A-Warren.json',
            url2013SpecialSenate: 'http://ma-staging.electionstats.com/elections/get_granular_margins/24364/Edward-J-Markey.json'
        };

        for(var i in urls){
            var url = urls[i];
            $.ajax({
                url: url,
                type: "POST",
                data:  {'filter_by_locality': townArray},
                dataType: 'json',
                async: false
            })
                .done(function(data) {
                    var a = data.output.margin_total.pct_votes;
                    resultArray.push(a);


                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log("Historical margin call failed. ", jqXHR, textStatus, errorThrown);
                    alert( "error" );
                });
        }

        return resultArray;
    }

    function addRowstoChart(array, time){
        dataTable.addRows([
            [
                addMinutes(start, time*iterationMin),
                    ((array[0]*100).toFixed(2))/1,
                    ((array[1]*100).toFixed(2))/1,
                    ((array[2]*100).toFixed(2))/1,
                    ((array[3]*100).toFixed(2))/1,
                    ((array[4]*100).toFixed(2))/1,
                    ((array[5]*100).toFixed(2))/1,
                    ((array[6]*100).toFixed(2))/1
            ]
        ]);

        chart.draw(dataTable, options);
        console.log("drawed at" + addMinutes(start, time) + " " + array);
    }

    function drawLineChart() {
        dataTable = new google.visualization.DataTable();

        dataTable.addColumn('datetime', 'Time');
        dataTable.addColumn('number', '2014 Martha Coakley margin');
        dataTable.addColumn('number', "2002 Governor Gen O'Brien and Gabrieli margin");
        dataTable.addColumn('number', '2006 Governor Patrick and Murray margin');
        dataTable.addColumn('number', '2010 Governor Patrick and Murray margin');
        dataTable.addColumn('number', '2010 Special Senate Martha Coakley');
        dataTable.addColumn('number', '2012 U.S. Senate Elizabeth A. Warren margin');
        dataTable.addColumn('number', '2013 Speacial Senate Edward J. Markey margin');

        chart = new google.visualization.LineChart(document.getElementById('line-visualization'));

        chart.draw(dataTable, options);
    }

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }

}

function Tbt(){

    compare(urlLive, $('#comp').val());
    hideOptions();

    $('#base, #comp').change(function(){

        hideOptions();
        var b = urlLive,
            c = $('#comp').val();

        compare(b,c);

    });

    drawAxis();


    function compare(baseElectionJsonUrl, toCompareJsonUrl){

        $.when(
            $.getJSON(baseElectionJsonUrl),
            $.getJSON(toCompareJsonUrl)
        ).done(function(base, comp) {

                var basePctVotes = _.map(base[0].output.margins.pct_votes, function(a, b){
                        return [b, a];
                    }),
                    compPctVotes =  _.map(comp[0].output.margins.pct_votes, function(a, b){
                        return [b, a];
                    }),
                    baseNumVotes = _.map(base[0].output.margins.n_votes, function(a, b){
                        return [b, a];
                    }),
                    compNumVotes = _.map(base[0].output.margins.n_votes, function(a, b){
                        return [b, a];
                    });

                //like not all town
                // s are in from the AP
                if(basePctVotes.length != compPctVotes.length){

                    if(compPctVotes.length < basePctVotes.length) {
                        var resBase = [];
                        _.each(compPctVotes, function(item, a){

                            var d = _.find(basePctVotes, function(baseItem){

                                return baseItem[0] == item[0];
                            });
                            resBase.push(d);

                        })
                    }
                    var compArrayShort = createScatterArray(resBase, compPctVotes);
                    drawVisualization(compArrayShort);
                    return;
                }


                var compArray = createScatterArray(basePctVotes, compPctVotes, baseNumVotes);
                drawVisualization(compArray)

            });
    }

    function createScatterArray(base, array, array2){
        var result = _.map(base, function(item, i) {
            return [((item[1]*100).toFixed(2))/1, ((array[i][1]*100).toFixed(2))/1, item[0], array2[i][1]];
        })
        return result;
    }

    function drawVisualization(array) {
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn('string', 'town');
        dataTable.addColumn('number', 'Coakley margin');
        dataTable.addColumn('number', 'Compared margin');
        dataTable.addColumn('number', '');
        dataTable.addColumn('number', 'Coakley vote count');

        _.each(array, function(item){
            dataTable.addRows([
                [ item[2], item[0], item[1], item[0], item[3]]
            ]);
        });

        var yAxisTextBottom = $('#comp :selected').attr('data-text'),
            xAxisTextBottom = "2014 Coakley (generated)";

        var options = {
            colors: ['red', 'blue'],
            bubble : {
                opacity: 0.5,
                textStyle: {
                    color: "transparent"
                }
            },
            legend: {position: 'none'},
            hAxis: {

                gridlines: {
                    color: "#e4e4e4"
                },
                minValue: -100,
                maxValue: 100,
                format:'#,###%',
                title: xAxisTextBottom,
                ticks: [{v:-50, f:'-50%'}, {v:0, f:'0'}, {v:50, f:'50%'}]
            },
            vAxis: {
                gridlines: {
                    color: "#e4e4e4"
                },
                minValue: -100,
                maxValue: 100,
                format:'#,###%',
                slantedText:true,
                slantedTextAngle:90,
                title: yAxisTextBottom,
                ticks: [{v:-50, f:'-50%'}, {v:0, f:'0'}, {v:50, f:'50%'}]

            },
            backgroundColor: 'transparent',
            sizeAxis: {
                minSize: 1,
                maxSize: 18
            },
            tooltip: {isHtml: true}
        };

        // create and draw the visualization.

        var chart = new google.visualization.BubbleChart(document.getElementById('visualization'));
        chart.draw(dataTable, options);
    }


    function drawAxis(){
        var hackChart = new google.visualization.ChartWrapper({
            chartType: 'LineChart',
            containerId: 'hack_chart_div',
            dataTable: [['x', 'y'],[-100, -100], [100, 100]],
            options: {
                height: 500,
                width: 700,
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
                colors: ['gray'],
                pointSize: 0,
                lineWidth: 1,
                enableInteractivity: false,
                legend: {
                    position: 'none'
                },
                series: {
                    0: { lineDashStyle: [14, 2, 7, 2] }
                }
            }
        });
        hackChart.draw();
    }

    function hideOptions(){
        var selectedParty =$('#comp :selected').attr('data-party'),
            selectedVal = $('#comp :selected').val();


        $('#base').find("[data-party!=" + selectedParty + "]").hide();

        $('#base').find("[data-party=" + selectedParty + "]").show();

        $('#base').find("[value='" +  selectedVal + "']").hide();
    };
}

function Map() {
    // Create a simple map.
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 8,
        center: {lat: 41.9863254919206, lng: 288.54126416015635}
    });

    var tooltip = $('.tooltip');
    var tooltipOffset = {x: 5, y: -25};


    var featureStyle = {
        fillColor: 'green',
        strokeWeight: 0.5,
        strokeColor: "#444"
    }
    map.data.setStyle(featureStyle);

    // Load a GeoJSON from the same server as our demo.

    $.getJSON("geo/towns.topojson", function(data){

        var geoJsonObject = topojson.feature(data,data.objects.ma);
        map.data.addGeoJson(geoJsonObject);
    });

    map.data.addListener('mouseover', function(event) {

        map.data.overrideStyle(event.feature, {fillColor: "#444", strokeWeight:3});

        for(var e in event){

            if(event[e] != undefined){
                if((event[e].constructor.name == 'MouseEvent')||(event[e].constructor.toString() == '[object MouseEvent]')||(event[e].constructor.toString() == '[object MouseEventConstructor]')){

                    var x = event[e].pageX;
                    var y = event[e].pageY;
                    tooltip.css('top', y + 20);
                    tooltip.css('left', x + 20);


                    var captTown = event.feature.getProperty('TOWN').capitalize(true),

                        datas = [
                            {arr: dataLive, text: '2014 Governor General (generated)', cand: 'Martha Coakley'},
                            {arr: data2002GOVDem, text: '2002 Governor General', cand: 'Romney and Healy'},
                            {arr: data2006GOVDem, text: '2006 Governor General', cand: 'Patrick and Murray'},
                            {arr: data2010GOVDem, text: '2010 Governor General', cand: 'Patrick and Murray'},
                            {arr: data2010SpecialSenate, text: '2010 Special Senate ', cand: 'Martha Coakley'},
                            {arr: data2012Senate, text: '2012 U.S. Senate', cand: 'Elizabeth A Warren'},
                            {arr: data2013SpecialSenate, text: '2013 Special Senate ', cand: 'Edward J. Markey'}
                        ];


                    var pcts = [];

                    for(var i = 0; i < datas.length; i++){
                        pcts[i] =  _.find(datas[i]['arr'], function(a){
                            return a[0] == captTown;
                        })[1];
                    }

                    if(pcts.length != datas.length){
                        console.log("pct array length != datas length")
                    }

                    tooltip.find('.pcts').empty();
                    tooltip.find('.live').empty();

                    for(var i = 0; i < pcts.length; i++){
                        var row = $('<div class="pct-item">' +
                            '<span class="election">' + datas[i]['text'] +' </span> ' +
                            '<span class="cand">' + datas[i]['cand'] + ': </span> ' +
                            '<span class="value">' + (pcts[i]*100).toFixed(2) +'%</span> ' +
                            '</div> ');

                        if(i==0){
                            tooltip.find('.live').append(row);
                            continue;
                        }

                        tooltip.find('.pcts').append(row);
                    }


                    tooltip.find('.town').text(captTown);
                    tooltip.show();
                }
            }

        }


    });

    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();

        tooltip.hide();
    });

    String.prototype.capitalize = function(lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };

}



