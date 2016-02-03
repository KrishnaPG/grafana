define([
  './vendor/juttle-jsdp',
  'angular',
  'lodash',
  'moment',
  './query_ctrl',
],
function (JSDP) {
  'use strict';

  /** @ngInject */
  function JuttleDatasource(instanceSettings, $q, backendSrv) {
    this.instanceSettings = instanceSettings;
    this.url = instanceSettings.url;

    // go-oleg TODO: remove this example
    console.log(JSDP.serialize({time: new Date(), value: 1}));

    function bundleJuttle(juttle, from, to) {
      var grafanaModule = 'export const from = Date.new("' + from.toISOString() + '");' +
        'export const to =  Date.new("' + to.toISOString() + '");';
      var juttlePrepend = 'import "grafana" as grafana;';

      return {
          program: juttlePrepend + juttle,
          modules: {
              grafana: grafanaModule
          }
      };
    }

    this.query = function(options) {
      var bundle = bundleJuttle(options.targets[0].query, options.range.from, options.range.to);
      return backendSrv.post(this.url + "/api/v0/jobs",{
        "bundle": bundle,
        "wait": true
      }).then(function(result) {
        var points = result.output.sink0.data
          .filter(function(dataItem) { return dataItem.type === "point";})
          .map(function(dataItem) {
            // go-oleg TODO: use JSDP
            return [dataItem.point.value, new Date(dataItem.point["time:date"]).getTime()];
          });
        console.log(points);
        return {data: [{target: "juttle", datapoints: points}]};
      });
    };

    this.annotationQuery = function(options) {
      var annotation = options.annotation;
      var bundle = bundleJuttle(options.annotation.query, options.range.from, options.range.to);
      return backendSrv.post(this.url + "/api/v0/jobs",{
        "bundle": bundle,
        "wait": true
      }).then(function(result) {
        var points = result.output.sink0.data
          .filter(function(dataItem) { return dataItem.type === "point";})
          .map(function(dataItem) {
            return {
                annotation: annotation,
                title: dataItem.point[annotation.titleField],
                text: dataItem.point[annotation.textField],
                tags: dataItem.point[annotation.tagsField],
                // go-oleg TODO: use JSDP
                time: new Date(dataItem.point["time:date"]).getTime()
            };
          });
        return points;
      });
    //   console.log(JSON.stringify(options));
    }

  }

  return JuttleDatasource;

});
