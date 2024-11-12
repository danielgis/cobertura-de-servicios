define(['dojo/_base/declare', 'jimu/BaseWidget', 'dijit/_WidgetsInTemplateMixin', "jimu/WidgetManager", "esri/tasks/QueryTask", "esri/tasks/query", "dojo/Deferred"], function (declare, BaseWidget, _WidgetsInTemplateMixin, WidgetManager, QueryTask, Query, Deferred) {
  // import StatisticDefinition from "esri/tasks/StatisticDefinition"

  var fontAwesome = document.createElement('script');
  fontAwesome.src = 'https://use.fontawesome.com/releases/v5.3.1/js/all.js';
  document.head.appendChild(fontAwesome);

  var isFirstLoad = false;

  // To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'dynamic-search-widget-cuna-mas',
    groupSelected: null,

    postCreate: function postCreate() {
      this.inherited(arguments);
      this.buildMainMenuCs();
      this.map.on("update-end", this.executeZoomExtentInitial.bind(this));
    },
    onClickGroup: function onClickGroup(evt) {
      var indexGroupSelected = Array.from(evt.target.parentNode.children).indexOf(evt.target);
      // search group by property index
      this.groupSelected = this.config.groups.find(function (group) {
        return group.index === indexGroupSelected;
      });
      // console.log('indexGroupSelected', this.indexGroupSelected);
      this.buildFormSearchCs();
      this.buildHeaderSearchCs();
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
    buildMainMenuCs: function buildMainMenuCs() {
      var _this = this;

      this.config.groups.sort(function (a, b) {
        return a.index - b.index;
      });
      this.containerGridApCs.innerHTML = '';
      this.config.groups.forEach(function (group) {
        var img = document.createElement('img');
        img.src = group.logo;
        img.alt = group.name;
        img.classList.add('groupFilterClsCs', 'groupCs');
        img.setAttribute('data-dojo-attach-point', 'scdApCs');
        _this.containerGridApCs.appendChild(img);
      });
    },
    buildHeaderSearchCs: function buildHeaderSearchCs() {
      dojo.query('#nameSelectedCs')[0].innerHTML = this.groupSelected.label;
      dojo.query('#descSelectedCs')[0].innerHTML = this.groupSelected.description;
      var img = document.createElement('img');
      img.src = this.groupSelected.logo;
      img.alt = this.groupSelected.name;
      img.classList.add('groupFilterClsCs', 'groupCs');
      img.setAttribute('data-dojo-attach-point', 'scdApCs');
      this.containerImgSelectedApCs.innerHTML = '';
      this.containerImgSelectedApCs.appendChild(img);
    },
    buildFormSearchCs: function buildFormSearchCs() {
      var _this2 = this;

      var filters = this.groupSelected.filters;
      filters.sort(function (a, b) {
        return a.index - b.index;
      });
      this.containerBodyApCs.innerHTML = '';
      filters.forEach(function (filter, index) {
        var label = document.createElement('p');
        label.classList.add('labelComboBoxClsCs');
        label.innerHTML = filter.label;
        _this2.containerBodyApCs.appendChild(label);

        var select = document.createElement('select');
        select.classList.add('comboBoxClsCs');
        select.id = filter.codeField;
        if (filter.startupData) {
          _this2.getDataByFilter(filter.url, [filter.codeField, filter.nameField]).then(function (response) {
            _this2.makeOptionCs(response.features, select, filter.codeField, filter.nameField);
          }).catch(function (err) {
            console.error('err', err);
          });
        };
        select.addEventListener('change', function (event) {
          return _this2.onChangeFilterCs(event, index);
        });
        _this2.containerBodyApCs.appendChild(select);
      });
    },
    getDataByFilter: function getDataByFilter(url, fields) {
      var where = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "1=1";
      var distinctValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var deferred = new Deferred();
      var queryTask = new QueryTask(url);
      var query = new Query();
      query.outFields = fields;
      query.where = where;

      query.returnGeometry = distinctValues ? false : true;
      query.returnDistinctValues = distinctValues;

      queryTask.execute(query).then(function (response) {
        deferred.resolve(response);
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    setExtentByFilter: function setExtentByFilter(url, where) {
      var self = this;
      var deferred = new Deferred();
      var queryTask = new QueryTask(url);
      var query = new Query();
      query.where = where;
      query.returnGeometry = true;

      queryTask.executeForExtent(query).then(function (response) {
        self.map.setExtent(response.extent.expand(1.1), true);
        deferred.resolve(response);
      }).catch(function (err) {
        console.error('err', err);
        deferred.reject(err);
      });
      return deferred.promise;
    },
    destroyFormSearchCs: function destroyFormSearchCs() {
      this.containerBodyApCs.innerHTML = '';
    },
    makeOptionCs: function makeOptionCs(options, selectControl, valueField, labelField) {
      options.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.value = option.attributes[valueField];
        optionElement.innerHTML = option.attributes[labelField];
        selectControl.appendChild(optionElement);
      });
    },
    onChangeFilterCs: function onChangeFilterCs(evt, currentFilterIndex) {
      var _this3 = this;

      var selectedIndex = evt.target.selectedIndex;
      var selectedValue = evt.target.options[selectedIndex].value;
      var currentFilter = this.groupSelected.filters[currentFilterIndex];

      var fields = [currentFilter.codeField, currentFilter.nameField];
      var where = currentFilter.codeField + ' = \'' + selectedValue + '\'';

      var responseFilter = void 0;

      return this.getDataByFilter(currentFilter.url, fields, where, false).then(function (response) {
        responseFilter = response;
        if (!currentFilter.isZoom) {
          return null;
        }
        if (responseFilter.features.length === 1 && responseFilter.features[0].geometry.type === 'point') {
          return _this3.map.centerAndZoom(responseFilter.features[0].geometry, 17);
        }
        return _this3.setExtentByFilter(currentFilter.url, where);
      }).then(function () {
        if (!currentFilter.filterAffected) {
          return;
        }
        currentFilter.filterAffected.forEach(function (affectedIndex) {
          var affectedFilter = _this3.groupSelected.filters[affectedIndex];
          var affectedSelect = document.getElementById(affectedFilter.codeField);
          affectedSelect.innerHTML = '';
          var defaultOption = document.createElement('option');
          defaultOption.text = affectedFilter.firstOption;
          defaultOption.value = '';
          affectedSelect.appendChild(defaultOption);
          _this3.getDataByFilter(affectedFilter.url, [affectedFilter.codeField, affectedFilter.nameField], currentFilter.codeField + ' = \'' + selectedValue + '\'').then(function (data) {
            _this3.makeOptionCs(data.features, affectedSelect, affectedFilter.codeField, affectedFilter.nameField);
          }).catch(function (err) {
            console.error('Error al actualizar el filtro ' + affectedFilter.label + ':', err);
          });
        });
      }).catch(function (err) {
        console.error('err', err);
      });
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
