define([
  './datasource',
],
function (JuttleDatasource) {
  'use strict';

  function metricsQueryEditor() {
    return {controller: 'JuttleQueryCtrl', templateUrl: 'app/plugins/datasource/juttle/partials/query.editor.html'};
  }

  function metricsQueryOptions() {
    return {templateUrl: 'app/plugins/datasource/juttle/partials/query.options.html'};
  }

  function annotationsQueryEditor() {
    return {templateUrl: 'app/plugins/datasource/juttle/partials/annotations.editor.html'};
  }

  function configView() {
    return {templateUrl: 'app/plugins/datasource/juttle/partials/config.html'};
  }

  return {
    Datasource: JuttleDatasource,
    configView: configView,
    annotationsQueryEditor: annotationsQueryEditor,
    metricsQueryEditor: metricsQueryEditor,
    metricsQueryOptions: metricsQueryOptions,
  };
});
