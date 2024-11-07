define(['dojo/_base/declare', 'jimu/BaseWidget', 'dijit/_WidgetsInTemplateMixin', "jimu/WidgetManager", "esri/tasks/QueryTask", "esri/tasks/query", "dojo/Deferred", "esri/tasks/StatisticDefinition"], function (declare, BaseWidget, _WidgetsInTemplateMixin, WidgetManager, QueryTask, Query, Deferred, StatisticDefinition) {

  var fontAwesome = document.createElement('script');
  fontAwesome.src = 'https://use.fontawesome.com/releases/v5.3.1/js/all.js';
  document.head.appendChild(fontAwesome);

  var isFirstLoad = false;

  // To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'dynamic-search-widget-cuna-mas',

    postCreate: function postCreate() {
      this.inherited(arguments);
      this.map.on("update-end", this.executeZoomExtentInitial.bind(this));
    },
    onClickGroup: function onClickGroup(evt) {
      this.containerGroupsApCs.classList.toggle('active');
      this.containerFiltersApCs.classList.toggle('active');
      this.buildFormSearchCs();
    },
    onClickBack: function onClickBack(evt) {
      this.containerGroupsApCs.classList.toggle('active');
      this.containerFiltersApCs.classList.toggle('active');
      this.destroyFormSearchCs();
    },
    startup: function startup() {
      this.inherited(arguments);
    },
    onOpen: function onOpen() {
      dojo.query(".groupFilterClsCs").on('click', this.onClickGroup.bind(this));
      dojo.query(".backButtonClsCs").on('click', this.onClickBack.bind(this));
    },
    executeZoomExtentInitial: function executeZoomExtentInitial() {
      if (isFirstLoad) {
        return;
      }
      var homeWidget = WidgetManager.getInstance().getWidgetsByName("HomeButton");
      this.map.setExtent(homeWidget[0].homeDijit.extent);
      isFirstLoad = true;
    },
    buildFormSearchCs: function buildFormSearchCs() {
      var _this = this;

      var filters = this.config.groups[0].filters;
      filters.sort(function (a, b) {
        return a.index - b.index;
      });
      this.containerBodyApCs.innerHTML = '';

      var promise = Promise.resolve();

      filters.forEach(function (filter) {
        var label = document.createElement('p');
        label.classList.add('labelComboBoxClsCs');
        label.innerHTML = filter.label;
        _this.containerBodyApCs.appendChild(label);

        var select = document.createElement('select');
        select.classList.add('comboBoxClsCs');
        select.id = filter.codeField;
        // if filter.startupData == true; when execute get data by filter
        if (filter.startupData) {
          promise = promise.then(function () {
            return _this.getDataByFilter(filter.url, [filter.nameField, filter.nameField]);
          }).then(function (response) {
            response.features.forEach(function (feature) {
              var option = document.createElement('option');
              option.value = feature.attributes[filter.nameField];
              option.innerHTML = feature.attributes[filter.nameField];
              select.appendChild(option);
            });
          }).catch(function (err) {
            console.error('err', err);
          });
        };

        // select.addEventListener('change', this.onChangeFilter.bind(this));
        _this.containerBodyApCs.appendChild(select);
      });
    },
    getDataByFilter: function getDataByFilter(url, fields) {
      var where = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "1=1";

      var deferred = new Deferred();
      var queryTask = new QueryTask(url);
      var query = new Query();
      query.outFields = fields;
      query.where = where;

      query.returnDistinctValues = true;

      queryTask.execute(query).then(function (response) {
        console.log('response', response);
        deferred.resolve(response);
      }).catch(function (err) {
        console.error('err', err);
        deferred.reject(err);
      });
      return deferred.promise;
    },
    destroyFormSearchCs: function destroyFormSearchCs() {
      this.containerBodyApCs.innerHTML = '';
    }
  }
  // onClose(){
  //   console.log('DynamicSearchWidgetCunaMas::onClose');
  // },
  // onMinimize(){
  //   console.log('DynamicSearchWidgetCunaMas::onMinimize');
  // },
  // onMaximize(){
  //   console.log('DynamicSearchWidgetCunaMas::onMaximize');
  // },
  // onSignIn(credential){
  //   console.log('DynamicSearchWidgetCunaMas::onSignIn', credential);
  // },
  // onSignOut(){
  //   console.log('DynamicSearchWidgetCunaMas::onSignOut');
  // }
  // onPositionChange(){
  //   console.log('DynamicSearchWidgetCunaMas::onPositionChange');
  // },
  // resize(){
  //   console.log('DynamicSearchWidgetCunaMas::resize');
  // }
  );
});
//# sourceMappingURL=Widget.js.map
