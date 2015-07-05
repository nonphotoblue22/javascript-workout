$(function() {
  'use strict';

  function ajaxData() {
    $.ajax({
      url: 'http://foundationphp.com/phpclinic/podata.php?&raw&callback=?',
      jsonpCallback: 'jsonReturnData',
      dataType: 'jsonp',
      data: {
        startDate: '20150301',
        endDate: '20150302',
        format: 'json'
      },
      success: function(data) {
        // abstract into some function

        for (var date in data) {
          console.log(data[date]);
          for (var props in data[date]) {
            var values = data[date][props];
            var totalValues = values.length;
            var numValues;
            var indValues;
            var orderedValue1 = (totalValues/2) - 1;
            var orderedValue2 = (totalValues/2) + 1;
            var sortedValues = [];
            var meanTotal = 0; // reset mean + medium counter
            console.log(props + ': ' + totalValues);

            for (var i = 0; i < totalValues; i++) {
              indValues = values.slice(i, (i+1));
              numValues = parseFloat(indValues);
              sortedValues.push(numValues);
              meanTotal += numValues;
            } // get mean
            console.log('mean: ' + (meanTotal/totalValues));

            // sort the array in order of smallest to largest
            sortedValues.sort();

            if (totalValues % 2 === 0) {
              // get the mean of two middle numbers
              console.log('medium(even): ' + ((orderedValue1 + orderedValue2)/2));
              // return (orderedValue1 + orderedValue2)/2;
            } else {
              // we odd
              console.log('medium(odd): ' + sortedValues.slice(orderedValue1, orderedValue2));
              // return sortedValues.slice(orderedValue1, orderedValue2);
            } // get medium

          }// loop through each object in date s. t. p.

        } // loop through json to get dates requested

      }
    });
  } // ajaxData



  //Lynda Solutions to mean + medium
  function loadChart() {
    $.ajax({
      url: 'http://foundationphp.com/phpclinic/podata.php?&raw&callback=?',
      jsonpCallback: 'jsonReturnData',
      dataType: 'jsonp',
      data: {
        startDate: '20150305',
        endDate: '20150326',
        format: 'json'
      },
      success: function(response){
        console.log(response);
        console.log(processData(response));
        generateChart(processData(response));
      }
    });
  } // ajaxin' stuff

  function getMean(myArray) {
    var mean = myArray.reduce(function(a,b){
      return a + b;
    })/myArray.length;
    return mean.toFixed(2);
  } // getMean

  function getMedian(myArray) {
    var median;
    var sorted = myArray.sort(myArray);
    var middleIndex = Math.floor(sorted.length/2)
    if (sorted.length % 2 === 0) {
      var medianA = sorted[middleIndex];
      var medianB = sorted[middleIndex - 1];
      median = (medianA + medianB)/2;
    } else {
      median = sorted[middleIndex];
    }

    return median.toFixed(2);
  } // getMedian

  function processData(data) {
    var myData = [];

    var myDates = ['x'];
    var meanTemps = ['Mean Temperature'];
    var medTemps = ['Median Temperature'];
    var meanPress = ['Mean Pressure'];
    var medPress = ['Median Pressure'];
    var meanSpeeds = ['Mean Speed'];
    var medSpeeds = ['Median Speed'];

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if ((data[key].t !== null) &&
        (data[key].p !== null) &&
        (data[key].s !== null)) {
          myDates.push(key);
          meanTemps.push(getMean(data[key].t));
          medTemps.push(getMedian(data[key].t));
          meanPress.push(getMean(data[key].p));
          medPress.push(getMedian(data[key].p));
          meanSpeeds.push(getMean(data[key].s));
          medSpeeds.push(getMedian(data[key].s));
        } // data is not null
      } // hasOwnProperty
    } // for key in data
    myData.push(myDates, meanTemps, medTemps, meanPress, medPress, meanSpeeds, medSpeeds);
    return myData;
  } // processData

  function generateChart(data) {
    var chart = c3.generate({

      data: {
        x: 'x',
        columns: data,
        type: 'bar',
        groups: [
          [
          'Mean Temperature',
          'Median Temperature',
          'Mean Pressure',
          'Median Pressure',
          'Mean Speed',
          'Median Speed'
          ]
        ]
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },
      axis: {
        x: {
          type: 'timeseries'
        }
      }, // axis
      subchart: {
        show: true
      }
    }); // chart
  } // generateChart

  // ajaxData();
  loadChart();
}); //page loaded
