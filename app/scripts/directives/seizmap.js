'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:seizmap
 * @description
 * # seizmap
 */
angular.module('fireInterfaceApp')
  .directive('seizmap', function() {
    return {
      template: '<svg id="seizmap"></svg>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var aggregation = scope.seizByNUTS;
        var zoomlvl = 1 << 12;


        getData();


        var xscale = d3.scaleSqrt()
          .range([2, 15])
          .domain([0, d3.max(_.map(scope.cityByCount, "value"), function(d) {
            return d.count })])


        var colscale = d3.scaleQuantize()
          //.domain([1,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.seized})])
          .domain([1, 700]) //manually set to 500 to avoid outliers
          .range(['#fcd66d', '#f0ab5a', '#e17f47', '#d05236', '#bd0026']);

        var pi = Math.PI,
          tau = 2 * pi;

        var width = element[0].clientWidth,
          height = element[0].clientHeight;

        // Define the div for the tooltip
          var tooltip = d3.select("seizmap").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Initialize the projection to fit the world in a 1×1 square centered at the origin.
        var projection = d3.geoMercator()
          .scale(1 / tau)
          .translate([0, 0]);

        var path = d3.geoPath()
          .projection(projection);

        var tile = d3.tile()
          .size([width, height]);

        var zoom = d3.zoom()
          .scaleExtent([1 << 12, 1 << 16])
          .on("zoom", zoomed);

        var svg = d3.select("#seizmap")
          .attr("width", width)
          .attr("height", height);

        var raster = svg.append("g")
          .on("click", function() {
            scope.$emit("deselect");
          })

        var vector = svg.append("path");


        // Compute the projected initial center.
        var center = projection([18.933333, 48.733333]);

        // Apply a zoom transform equivalent to projection.{scale,translate,center}.
        svg
          .call(zoom)
          .call(zoom.transform, d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(zoomlvl)
            .translate(-center[0], -center[1]));



        drawMap();


        function zoomed() {
          var transform = d3.event.transform;

          if (transform.k > 1 << 13 && zoomlvl <= 1 << 13) {
            aggregation = scope.seizByCity;
            getData();
            //colscale.domain([1,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.victims})])
            colscale.domain([1, 400]) //fixed value to avoid outliers
            drawMap();


          } else if (transform.k < 1 << 13 && zoomlvl >= 1 << 13) {
            aggregation = scope.seizByNUTS;
            getData();
            //colscale.domain([1,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.victims})])
            colscale.domain([1, 700]) //fixed value to avoid outliers
            drawMap();
          }

          zoomlvl = transform.k;

          var tiles = tile
            .scale(transform.k)
            .translate([transform.x, transform.y])
            ();

          projection
            .scale(transform.k / tau)
            .translate([transform.x, transform.y]);

          vector
            .attr("d", path);

          var image = raster
            .attr("transform", stringify(tiles.scale, tiles.translate))
            .selectAll("image")
            .data(tiles, function(d) {
              return d; })



          svg.selectAll(".city")
            .attr("transform", function(d) {
              return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")" })


          image.exit().remove();

          //close tooltip
          tooltip.transition()
                .duration(500)
                .style("opacity", 0);


          //https://api.mapbox.com/styles/v1/fenicento/ciskc3xy200dr2xp8s7wieg8d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmVuaWNlbnRvIiwiYSI6ImNpbmhsenNqeDAwMmd3ZGx5MXVmcjNrdTAifQ.D1nRFjJRXUR7PMk5eDJzHQ

          image.enter().append("image")
            .attr("xlink:href", function(d) {
              return "https://api.mapbox.com/styles/v1/fenicento/ciskc3xy200dr2xp8s7wieg8d/tiles/256/" + d[2] + "/" + d[0] + "/" + d[1] + "?access_token=pk.eyJ1IjoiZmVuaWNlbnRvIiwiYSI6ImNpbmhsenNqeDAwMmd3ZGx5MXVmcjNrdTAifQ.D1nRFjJRXUR7PMk5eDJzHQ"; })
            .attr("x", function(d) {
              return d[0] * 256; })
            .attr("y", function(d) {
              return d[1] * 256; })
            .attr("width", 257)
            .attr("height", 257);

        }

        function stringify(scale, translate) {
          var k = scale / 256,
            r = scale % 1 ? Number : Math.round;
          return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
        }



        scope.$on("refresh", function() {
          getData();
          drawMap();
        })


        function getData() {

          //obj with nuts names
          var NUTSNames = {
            "BE10": "Région de Bruxelles-Capitale",
            "BE21": "Prov. Antwerpen",
            "BE22": "Prov. Limburg (BE)",
            "BE23": "Prov. Oost-Vlaanderen",
            "BE24": "Prov. Vlaams-Brabant",
            "BE25": "Prov. West-Vlaanderen",
            "BE31": "Prov. Brabant Wallon",
            "BE32": "Prov. Hainaut",
            "BE33": "Prov. Liège",
            "BE34": "Prov. Luxembourg (BE)",
            "BE35": "Prov. Namur",
            "BEZZ": "Extra-Regio NUTS 2",
            "BG31": "Северозападен (Severozapaden)",
            "BG32": "Северен централен (Severen tsentralen)",
            "BG33": "Североизточен (Severoiztochen)",
            "BG34": "Югоизточен (Yugoiztochen)",
            "BG41": "Югозападен (Yugozapaden)",
            "BG42": "Южен централен (Yuzhen tsentralen)",
            "BGZZ": "Extra-Regio NUTS 2",
            "CZ01": "Praha",
            "CZ02": "Střední Čechy",
            "CZ03": "Jihozápad",
            "CZ04": "Severozápad",
            "CZ05": "Severovýchod",
            "CZ06": "Jihovýchod",
            "CZ07": "Střední Morava",
            "CZ08": "Moravskoslezsko",
            "CZZZ": "Extra-Regio NUTS 2",
            "DK01": "Hovedstaden",
            "DK02": "Sjælland",
            "DK03": "Syddanmark",
            "DK04": "Midtjylland",
            "DK05": "Nordjylland",
            "DKZZ": "Extra-Regio NUTS 2",
            "DE11": "Stuttgart",
            "DE12": "Karlsruhe",
            "DE13": "Freiburg",
            "DE14": "Tübingen",
            "DE21": "Oberbayern",
            "DE22": "Niederbayern",
            "DE23": "Oberpfalz",
            "DE24": "Oberfranken",
            "DE25": "Mittelfranken",
            "DE26": "Unterfranken",
            "DE27": "Schwaben",
            "DE30": "Berlin",
            "DE40": "Brandenburg",
            "DE50": "Bremen",
            "DE60": "Hamburg",
            "DE71": "Darmstadt",
            "DE72": "Gießen",
            "DE73": "Kassel",
            "DE80": "Mecklenburg-Vorpommern",
            "DE91": "Braunschweig",
            "DE92": "Hannover",
            "DE93": "Lüneburg",
            "DE94": "Weser-Ems",
            "DEA1": "Düsseldorf",
            "DEA2": "Köln",
            "DEA3": "Münster",
            "DEA4": "Detmold",
            "DEA5": "Arnsberg",
            "DEB1": "Koblenz",
            "DEB2": "Trier",
            "DEB3": "Rheinhessen-Pfalz",
            "DEC0": "Saarland",
            "DED2": "Dresden",
            "DED4": "Chemnitz",
            "DED5": "Leipzig",
            "DEE0": "Sachsen-Anhalt",
            "DEF0": "Schleswig-Holstein",
            "DEG0": "Thüringen",
            "DEZZ": "Extra-Regio NUTS 2",
            "EE00": "Eesti",
            "EEZZ": "Extra-Regio NUTS 2",
            "IE01": "Border, Midland and Western",
            "IE02": "Southern and Eastern",
            "IEZZ": "Extra-Regio NUTS 2",
            "EL30": "Aττική (Attiki)",
            "EL41": "Βόρειο Αιγαίο (Voreio Aigaio)",
            "EL42": "Νότιο Αιγαίο (Notio Aigaio)",
            "EL43": "Κρήτη (Kriti)",
            "EL51": "Aνατολική Μακεδονία, Θράκη (Anatoliki Makedonia, Thraki)",
            "EL52": "Κεντρική Μακεδονία (Kentriki Makedonia)",
            "EL53": "Δυτική Μακεδονία (Dytiki Makedonia)",
            "EL54": "Ήπειρος (Ipeiros)",
            "EL61": "Θεσσαλία (Thessalia)",
            "EL62": "Ιόνια Νησιά (Ionia Nisia)",
            "EL63": "Δυτική Ελλάδα (Dytiki Ellada)",
            "EL64": "Στερεά Ελλάδα (Sterea Ellada)",
            "EL65": "Πελοπόννησος (Peloponnisos)",
            "ELZZ": "Extra-Regio NUTS 2",
            "ES11": "Galicia",
            "ES12": "Principado de Asturias",
            "ES13": "Cantabria",
            "ES21": "País Vasco",
            "ES22": "Comunidad Foral de Navarra",
            "ES23": "La Rioja",
            "ES24": "Aragón",
            "ES30": "Comunidad de Madrid",
            "ES41": "Castilla y León",
            "ES42": "Castilla-La Mancha",
            "ES43": "Extremadura",
            "ES51": "Cataluña",
            "ES52": "Comunidad Valenciana",
            "ES53": "Illes Balears",
            "ES61": "Andalucía",
            "ES62": "Región de Murcia",
            "ES63": "Ciudad Autónoma de Ceuta",
            "ES64": "Ciudad Autónoma de Melilla",
            "ES70": "Canarias",
            "ESZZ": "Extra-Regio NUTS 2",
            "FR10": "Île de France",
            "FR21": "Champagne-Ardenne",
            "FR22": "Picardie",
            "FR23": "Haute-Normandie",
            "FR24": "Centre",
            "FR25": "Basse-Normandie",
            "FR26": "Bourgogne",
            "FR30": "Nord - Pas-de-Calais",
            "FR41": "Lorraine",
            "FR42": "Alsace",
            "FR43": "Franche-Comté",
            "FR51": "Pays de la Loire",
            "FR52": "Bretagne",
            "FR53": "Poitou-Charentes",
            "FR61": "Aquitaine",
            "FR62": "Midi-Pyrénées",
            "FR63": "Limousin",
            "FR71": "Rhône-Alpes",
            "FR72": "Auvergne",
            "FR81": "Languedoc-Roussillon",
            "FR82": "Provence-Alpes-Côte d'Azur",
            "FR83": "Corse",
            "FRA1": "Guadeloupe",
            "FRA2": "Martinique",
            "FRA3": "Guyane",
            "FRA4": "La Réunion",
            "FRA5": "Mayotte",
            "FRZZ": "Extra-Regio NUTS 2",
            "HR03": "Jadranska Hrvatska",
            "HR04": "Kontinentalna Hrvatska",
            "HRZZ": "Extra-Regio NUTS 2",
            "ITC1": "Piemonte",
            "ITC2": "Valle d'Aosta/Vallée d'Aoste",
            "ITC3": "Liguria",
            "ITC4": "Lombardia",
            "ITF1": "Abruzzo",
            "ITF2": "Molise",
            "ITF3": "Campania",
            "ITF4": "Puglia",
            "ITF5": "Basilicata",
            "ITF6": "Calabria",
            "ITG1": "Sicilia",
            "ITG2": "Sardegna",
            "ITH1": "Provincia Autonoma di Bolzano/Bozen",
            "ITH2": "Provincia Autonoma di Trento",
            "ITH3": "Veneto",
            "ITH4": "Friuli-Venezia Giulia",
            "ITH5": "Emilia-Romagna",
            "ITI1": "Toscana",
            "ITI2": "Umbria",
            "ITI3": "Marche",
            "ITI4": "Lazio",
            "ITZZ": "Extra-Regio NUTS 2",
            "CY00": "Κύπρος (Kypros)",
            "CYZZ": "Extra-Regio NUTS 2",
            "LV00": "Latvija",
            "LVZZ": "Extra-Regio NUTS 2",
            "LT00": "Lietuva",
            "LTZZ": "Extra-Regio NUTS 2",
            "LU00": "Luxembourg",
            "LUZZ": "Extra-Regio NUTS 2",
            "HU10": "Közép-Magyarország",
            "HU21": "Közép-Dunántúl",
            "HU22": "Nyugat-Dunántúl",
            "HU23": "Dél-Dunántúl",
            "HU31": "Észak-Magyarország",
            "HU32": "Észak-Alföld",
            "HU33": "Dél-Alföld",
            "HUZZ": "Extra-Regio NUTS 2",
            "MT00": "Malta",
            "MTZZ": "Extra-Regio NUTS 2",
            "NL11": "Groningen",
            "NL12": "Friesland (NL)",
            "NL13": "Drenthe",
            "NL21": "Overijssel",
            "NL22": "Gelderland",
            "NL23": "Flevoland",
            "NL31": "Utrecht",
            "NL32": "Noord-Holland",
            "NL33": "Zuid-Holland",
            "NL34": "Zeeland",
            "NL41": "Noord-Brabant",
            "NL42": "Limburg (NL)",
            "NLZZ": "Extra-Regio NUTS 2",
            "AT11": "Burgenland ",
            "AT12": "Niederösterreich",
            "AT13": "Wien",
            "AT21": "Kärnten",
            "AT22": "Steiermark",
            "AT31": "Oberösterreich",
            "AT32": "Salzburg",
            "AT33": "Tirol",
            "AT34": "Vorarlberg",
            "ATZZ": "Extra-Regio NUTS 2",
            "PL11": "Łódzkie",
            "PL12": "Mazowieckie",
            "PL21": "Małopolskie",
            "PL22": "Śląskie",
            "PL31": "Lubelskie",
            "PL32": "Podkarpackie",
            "PL33": "Świętokrzyskie",
            "PL34": "Podlaskie",
            "PL41": "Wielkopolskie",
            "PL42": "Zachodniopomorskie",
            "PL43": "Lubuskie",
            "PL51": "Dolnośląskie",
            "PL52": "Opolskie",
            "PL61": "Kujawsko-pomorskie",
            "PL62": "Warmińsko-mazurskie",
            "PL63": "Pomorskie",
            "PLZZ": "Extra-Regio NUTS 2",
            "PT11": "Norte",
            "PT15": "Algarve",
            "PT16": "Centro (PT)",
            "PT17": "Área Metropolitana de Lisboa",
            "PT18": "Alentejo",
            "PT20": "Região Autónoma dos Açores",
            "PT30": "Região Autónoma da Madeira",
            "PTZZ": "Extra-Regio NUTS 2",
            "RO11": "Nord-Vest",
            "RO12": "Centru",
            "RO21": "Nord-Est",
            "RO22": "Sud-Est",
            "RO31": "Sud - Muntenia",
            "RO32": "Bucureşti - Ilfov",
            "RO41": "Sud-Vest Oltenia",
            "RO42": "Vest",
            "ROZZ": "Extra-Regio NUTS 2",
            "SI03": "Vzhodna Slovenija",
            "SI04": "Zahodna Slovenija",
            "SIZZ": "Extra-Regio NUTS 2",
            "SK01": "Bratislavský kraj",
            "SK02": "Západné Slovensko",
            "SK03": "Stredné Slovensko",
            "SK04": "Východné Slovensko",
            "SKZZ": "Extra-Regio NUTS 2",
            "FI19": "Länsi-Suomi",
            "FI1B": "Helsinki-Uusimaa",
            "FI1C": "Etelä-Suomi",
            "FI1D": "Pohjois- ja Itä-Suomi",
            "FI20": "Åland",
            "FIZZ": "Extra-Regio NUTS 2",
            "SE11": "Stockholm",
            "SE12": "Östra Mellansverige",
            "SE21": "Småland med öarna",
            "SE22": "Sydsverige",
            "SE23": "Västsverige",
            "SE31": "Norra Mellansverige",
            "SE32": "Mellersta Norrland",
            "SE33": "Övre Norrland",
            "SEZZ": "Extra-Regio NUTS 2",
            "UKC1": "Tees Valley and Durham",
            "UKC2": "Northumberland and Tyne and Wear",
            "UKD1": "Cumbria",
            "UKD3": "Greater Manchester",
            "UKD4": "Lancashire",
            "UKD6": "Cheshire",
            "UKD7": "Merseyside",
            "UKE1": "East Yorkshire and Northern Lincolnshire",
            "UKE2": "North Yorkshire",
            "UKE3": "South Yorkshire",
            "UKE4": "West Yorkshire",
            "UKF1": "Derbyshire and Nottinghamshire",
            "UKF2": "Leicestershire, Rutland and Northamptonshire",
            "UKF3": "Lincolnshire",
            "UKG1": "Herefordshire, Worcestershire and Warwickshire",
            "UKG2": "Shropshire and Staffordshire",
            "UKG3": "West Midlands",
            "UKH1": "East Anglia",
            "UKH2": "Bedfordshire and Hertfordshire",
            "UKH3": "Essex",
            "UKI3": "Inner London - West",
            "UKI4": "Inner London - East",
            "UKI5": "Outer London - East and North East",
            "UKI6": "Outer London - South",
            "UKI7": "Outer London - West and North West",
            "UKJ1": "Berkshire, Buckinghamshire and Oxfordshire",
            "UKJ2": "Surrey, East and West Sussex",
            "UKJ3": "Hampshire and Isle of Wight",
            "UKJ4": "Kent",
            "UKK1": "Gloucestershire, Wiltshire and Bristol/Bath area",
            "UKK2": "Dorset and Somerset",
            "UKK3": "Cornwall and Isles of Scilly",
            "UKK4": "Devon",
            "UKL1": "West Wales and The Valleys",
            "UKL2": "East Wales",
            "UKM2": "Eastern Scotland",
            "UKM3": "South Western Scotland",
            "UKM5": "North Eastern Scotland",
            "UKM6": "Highlands and Islands",
            "UKN0": "Northern Ireland",
            "UKZZ": "Extra-Regio NUTS 2"
          }

          scope.cityByCount = aggregation.group().reduce(

            function(a, d) {
              a.count++;
              //name of the dot
              if(aggregation == scope.seizByCity) {
                a.name = d["Seizure_ci"];
              } else if(aggregation == scope.seizByNUTS) {
                a.name = NUTSNames[d["NUTS_ID"]];
              }
              a.ids.push(d.Crime_ID);
              if (!a.lat) { a.lat = parseFloat(d['Y']);
                a.lon = parseFloat(d['X']) }
              if (!isNaN(parseInt(d["N. of fire"]))) { a.known++;
                a.seized += parseInt(d["N. of fire"]) }
              return a;
            },
            function(a, d) {
              a.count--;
              var pos = _.findIndex(a, function(e) {
                return e.Crime_ID == d.Crime_ID })
              a.ids.slice(pos, 1);
              if (!isNaN(parseInt(d["N. of fire"]))) { a.known--;
                a.seized -= parseInt(d["N. of fire"]) }

              return a;
            },
            function() {
              return { count: 0, known: 0, seized: 0, ids: [] };
            }

          ).all();
        }

        function drawMap() {

          var data = _.map(scope.cityByCount, "value").filter(function(d) {
            return d.count > 0 });

          var circles = svg.selectAll(".city").data(data, function(d) {
            return d.key })

          var newc = circles.enter().append("g")
            .attr("class", "city")

          newc.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", function(d) {
              return xscale(d.count) })
            .style("fill", function(d) {
              return colscale(d.seized) })
            .style("opacity", 0.8)
            .on("mouseover", function(d) {
              //get circle radius
              var radius = parseFloat(d3.select(this).attr('r'));

              tooltip.transition()
                .duration(200)
                .style("opacity", 1);
              tooltip.html("<span class='header'>Location:</span><br/><span class='content'>" + d.name+"</span><br/><span class='header'>Total seizures:</span><br/><span class='content'>" + d.count+"</span><br/><span class='header'>Seized firearms:</span><br/><span class='content'>" + d.seized +"</span>")
                .style("left", (d.posx+radius+5) + "px")
                .style("top", (d.posy-15) + "px");
            })
            .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            })
            .on("click", function(d) {
              console.log(d);
              scope.$emit("click", d["Country"], d.ids);
            });


          svg.selectAll(".city")
            .attr("transform", function(d) {
              d.posx = projection([d.lon, d.lat])[0];
              d.posy = projection([d.lon, d.lat])[1];
              return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")" })
            //.attr("cx",function(d){return projection([d.lon,d.lat])[0]})
            //.attr("cy",function(d){return projection([d.lon,d.lat])[1]})
            //.attr("r",function(d){return xscale(d.count)})
            //.style("fill",function(d){return colscale(d.seized)})
            //.style("opacity",0.7);

          circles.exit().remove();
        }
      }
    };
  });
