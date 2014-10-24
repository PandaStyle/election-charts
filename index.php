<!DOCTYPE html>
<html lang="en">
    <head>
    <title>2014 Election: Past Margin Comparisons</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta charset="utf-8">
    
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap-3.2.0-dist/css/bootstrap.min.css" rel="stylesheet">

	<!-- App-specific CSS -->
    <link href="css/election.css" rel="stylesheet">
    
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="js/lib/jquery-2.1.1.min.js"></script>

    <script src="js/lib/underscore-min.js"></script>
    <script src="js/lib/maps.js"></script>
    <script src="js/lib/topojson.js"></script>
    <script src="js/lib/moment.min.js"></script>

    <script src="js/election.js"></script>

    <script type="text/javascript">
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(load_page_data);
    </script>
    </head>

    <body>

        <div id="loader-for-page">
            <div> Updating charts with the latest results data...<br /><img src="assets/ajax-loader-red-bar.gif" /> </div>
        </div>
 
		<div class="container-fluid">

          <div class="page-header">
             <div class="row">
                <div class="col-md-8">
                   <h1>Election 2014 </h1>
                   <p class="lead">Past Margin Comparisons</p>
                </div>
                <div class="col-md-4 sponsor-logos">
                   <div class="logo-wrap "><img class="logo mpg" src="assets/logo-mpg.png" /></div>
                   <div class="logo-wrap "><img class="logo civica" src="assets/logo-civica.png" /></div>
                   <div class="logo-wrap "><img class="logo google" src="assets/logo-google.png" /></div>
                   <!-- <div class="logo-wrap "><img class="logo wbur" src="assets/logo-wbur.png" /></div> -->
                   
                   
                </div>
             </div>
          </div>
     
     
       	  <!-- Two columns with two nested columns -->
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12">
                 
                   <!--Line chart-->
                    <div class="wrap">
                        <div id="line-visualization"></div>
                    </div>
                    
                </div>
              </div> <!-- END row --> 
              <div class="row">
                <div class="col-lg-7 col-md-12">
                	
                    <!--Map-->
                    <div class="wrap">
                        <div id="map-canvas"></div>
            
                        <div id="locality-info-window" style="display: none;">
                            <span class="town">Unknown</span>
                            <div class="live"></div>
                            <div class="pcts"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 col-md-12">
                	<!--Bubble chart-->
                    <div class="wrap">
                        <div class="chart-container">
                            <div id="visualization"></div>
                            <div id="hack_chart_div"></div>
                        </div>
            
            
                        <span>Martha Coakley's margin compared to </span>
                        <select name="comp" id="comp">


                            <option value="data/2013-US-Special-Senate-Edward-J-Markey.json" data-text="2013 Senate: Edward Markey" data-party="dem" data-last-name="Markey" selected="selected">2013 Senate: Markey</option>

                            <option value="data/2012-US-Senate-Elizabeth-A-Warren.json" data-text="2012 Senate: Elizabeth Warren" data-party="dem" data-last-name="Warren" >2012 Senate: Warren</option>
                            <option value="data/2010-US-Special-Senate-Martha-Coakley.json" data-text="2010 Senate: Martha Coakley" data-party="dem" data-last-name="Coakley (2010)">2010 Senate: Coakley</option>
                            <option value="data/2010-Gov-Gen-Patrick-and-Murray.json" data-text="2010 Gov: Deval Patrick" data-party="dem" data-last-name="Patrick">2010 Gov: Patrick</option>
                            <option value="data/2006-Gov-Gen-Patrick-and-Murray.json" data-text="2006 Gov: Deval Patrick" data-party="dem" data-last-name="Patrick">2006 Gov: Patrick</option>
                            <option value="data/2002-Gov-Gen-OBrien-and-Gabrieli.json" data-text="2002 Gov: Shannon O'Brien" data-party="dem" data-last-name="O'Brien">2002 Gov: O'Brien</option>

                        </select>
                    </div>
                </div>
              </div> <!-- END row -->
              <div class="col-md-12">
                <div id="localities-reporting"></div>
              </div>
              
            </div> <!-- END column -->
             
          </div> <!-- END row -->
          
          <br><br><br>
          
       
    </body>
</html>