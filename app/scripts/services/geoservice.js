'use strict';

/**
 * @ngdoc service
 * @name fireInterfaceApp.geoservice
 * @description
 * # geoservice
 * Service in the fireInterfaceApp.
 */
angular.module('fireInterfaceApp')
  .factory('geoservice', function () {

    var countries = {

      "Andorra":  {
        "lat" : "42.546245",
        "lon" : "1.601554"
      },
      "Albania":  {
        "lat" : "41.153332",
        "lon" : "20.168331"
      },
      "Austria":  {
        "lat" : "47.516231",
        "lon" : "14.550072"
      },
      "Bosnia and Herzegovina":  {
        "lat" : "43.915886",
        "lon" : "17.679076"
      },
      "Belgium":  {
        "lat" : "50.503887",
        "lon" : "4.469936"
      },
      "Switzerland":  {
        "lat" : "46.818188",
        "lon" : "8.227512"
      },
      "Cyprus":  {
        "lat" : "35.126413",
        "lon" : "33.429859"
      },
      "Czech Republic":  {
        "lat" : "49.817492",
        "lon" : "15.472962"
      },
      "Germany":  {
        "lat" : "51.165691",
        "lon" : "10.451526"
      },
      "Denmark":  {
        "lat" : "56.26392",
        "lon" : "9.501785"
      },
      "Estonia":  {
        "lat" : "58.595272",
        "lon" : "25.013607"
      },
      "Spain":  {
        "lat" : "40.463667",
        "lon" : "-3.74922"
      },
      "Finland":  {
        "lat" : "61.92411",
        "lon" : "25.748151"
      },
      "France":  {
        "lat" : "46.227638",
        "lon" : "2.213749"
      },
      "United Kingdom":  {
        "lat" : "55.378051",
        "lon" : "-3.435973"
      },
      "Georgia":  {
        "lat" : "42.315407",
        "lon" : "43.356892"
      },
      "Gibraltar":  {
        "lat" : "36.137741",
        "lon" : "-5.345374"
      },
      "Greenland":  {
        "lat" : "71.706936",
        "lon" : "-42.604303"
      },
      "Greece":  {
        "lat" : "39.074208",
        "lon" : "21.824312"
      },
      "Croatia":  {
        "lat" : "45.1",
        "lon" : "15.2"
      },
      "Hungary":  {
        "lat" : "47.162494",
        "lon" : "19.503304"
      },
      "Ireland":  {
        "lat" : "53.41291",
        "lon" : "-8.24389"
      },
      "Iceland":  {
        "lat" : "64.963051",
        "lon" : "-19.020835"
      },
      "Italy":  {
        "lat" : "41.87194",
        "lon" : "12.56738"
      },
      "Liechtenstein":  {
        "lat" : "47.166",
        "lon" : "9.555373"
      },
      "Luxembourg":  {
        "lat" : "49.815273",
        "lon" : "6.129583"
      },
      "Latvia":  {
        "lat" : "56.879635",
        "lon" : "24.603189"
      },
      "Monaco":  {
        "lat" : "43.750298",
        "lon" : "7.412841"
      },
      "Moldova":  {
        "lat" : "47.411631",
        "lon" : "28.369885"
      },
      "Montenegro":  {
        "lat" : "42.708678",
        "lon" : "19.37439"
      },
      "Macedonia":  {
        "lat" : "41.608635",
        "lon" : "21.745275"
      },
      "Malta":  {
        "lat" : "35.937496",
        "lon" : "14.375416"
      },
      "Netherlands":  {
        "lat" : "52.132633",
        "lon" : "5.291266"
      },
      "Norway":  {
        "lat" : "60.472024",
        "lon" : "8.468946"
      },
      "Poland":  {
        "lat" : "51.919438",
        "lon" : "19.145136"
      },
      "Portugal":  {
        "lat" : "39.399872",
        "lon" : "-8.224454"
      },
      "Romania":  {
        "lat" : "45.943161",
        "lon" : "24.96676"
      },
      "Serbia":  {
        "lat" : "44.016521",
        "lon" : "21.005859"
      },
      "Russia":  {
        "lat" : "61.52401",
        "lon" : "105.318756"
      },
      "Sweden":  {
        "lat" : "60.128161",
        "lon" : "18.643501"
      },
      "Slovakia":  {
        "lat" : "48.669026",
        "lon" : "19.699024"
      },
      "San Marino":  {
        "lat" : "43.94236",
        "lon" : "12.457777"
      },
      "Turkey":  {
        "lat" : "38.963745",
        "lon" : "35.243322"
      },
      "Ukraine":  {
        "lat" : "48.379433",
        "lon" : "31.16558"
      },
      "Vatican City":  {
        "lat" : "41.902916",
        "lon" : "12.453389"
      },
      "Kosovo":  {
        "lat" : "42.602636",
        "lon" : "20.902977"
      }
    };

    return {
      getcoords: function (c) {

        return countries[c];


      }
    }


  });
