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
      this.buildFormSearchCs();
      this.containerGroupsApCs.classList.toggle('active');
      this.containerFiltersApCs.classList.toggle('active');
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

      filters.forEach(function (filter, index) {
        var label = document.createElement('p');
        label.classList.add('labelComboBoxClsCs');
        label.innerHTML = filter.label;
        _this.containerBodyApCs.appendChild(label);

        var select = document.createElement('select');
        select.classList.add('comboBoxClsCs');
        select.id = filter.nameField;
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

        select.addEventListener('change', function (event) {
          return _this.onChangeFilterCs(event, index);
        });
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
    onChangeFilterCs: function onChangeFilterCs(evt, currentFilterIndex) {
      var _this2 = this;

      var selectedIndex = evt.target.selectedIndex;
      var selectedValue = evt.target.options[selectedIndex].value;
      var currentFilter = this.config.groups[0].filters[currentFilterIndex];

      var promise = Promise.resolve();

      if (currentFilter.isZoom) {
        promise = promise.then(function () {
          return _this2.setExtentByPoint(currentFilter.url, currentFilter.nameField + ' = \'' + selectedValue + '\'');
        }).catch(function (err) {
          console.error('err', err);
        });
      }

      if (!currentFilter.filterAffected) {
        return;
      }

      // this.clearDependentCombos(currentFilterIndex);

      // Procesa cada índice en `filterAffected`
      currentFilter.filterAffected.forEach(function (affectedIndex) {
        var affectedFilter = _this2.config.groups[0].filters[affectedIndex];
        var affectedSelect = document.getElementById(affectedFilter.nameField);

        // Limpia las opciones anteriores
        affectedSelect.innerHTML = '';
        var defaultOption = document.createElement('option');
        defaultOption.text = affectedFilter.firstOption;
        defaultOption.value = '';
        affectedSelect.appendChild(defaultOption);

        // Obtiene los datos filtrados y actualiza el combobox afectado
        _this2.getDataByFilter(affectedFilter.url, [affectedFilter.nameField, affectedFilter.nameField], currentFilter.nameField + ' = \'' + selectedValue + '\'').then(function (data) {
          data.features.forEach(function (feature) {
            var option = document.createElement('option');
            option.value = feature.attributes[affectedFilter.nameField];
            option.text = feature.attributes[affectedFilter.nameField];
            affectedSelect.appendChild(option);
          });
        }).catch(function (err) {
          console.error('Error al actualizar el filtro ' + affectedFilter.label + ':', err);
        });
      });
    },
    setExtentByPoint: function setExtentByPoint(url, where) {
      self = this;
      var deferred = new Deferred();
      var queryTask = new QueryTask(url);
      var query = new Query();
      query.where = where;
      query.returnGeometry = true;
      // query.outSpatialReference = this.map.spatialReference;
      // query.returnExtentOnly = true;

      queryTask.executeForExtent(query).then(function (response) {
        console.log('response', response);
        self.map.setExtent(response.extent);
        // if (response.features.length === 1) {
        // console
        // return self.map.centerAndZoom(response.features[0].geometry, 15)
        // } else {

        // }
      }).then(function (response) {
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
