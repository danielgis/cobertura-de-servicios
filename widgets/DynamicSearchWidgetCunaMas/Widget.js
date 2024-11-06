define(['dojo/_base/declare', 'jimu/BaseWidget', 'dijit/_WidgetsInTemplateMixin', "esri/tasks/QueryTask", "esri/tasks/query"], function (declare, BaseWidget, _WidgetsInTemplateMixin, QueryTask, Query) {
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'dynamic-search-widget-cuna-mas',

    postCreate: function postCreate() {
      this.inherited(arguments);
      // dojo.query().on('click', this.onClickGroup);
      // this.scdApCs.on('click', this.onClickGroup);
      // this.saApCs.on('click', this.onClickGroup);
      // console.log(this.scdApCs);
      // console.log('DynamicSearchWidgetCunaMas::postCreate');
    },
    onClickGroup: function onClickGroup(evt) {
      // console.log(evt.currentTarget);
      alert('Aqui se mostrar\xE1n los filtros para ' + evt.target.alt);
    },
    startup: function startup() {
      this.inherited(arguments);
      // console.log('DynamicSearchWidgetCunaMas::startup');
      // console.log(this.scdApCs);
      // this.scdApCs.on('click', this.onClickGroup.bind(this));
      // this.saApCs.on('click', this.onClickGroup.bind(this));
    },
    onOpen: function onOpen() {
      dojo.query(".groupCs").on('click', this.onClickGroup);
      // console.log('DynamicSearchWidgetCunaMas::onOpen');
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
