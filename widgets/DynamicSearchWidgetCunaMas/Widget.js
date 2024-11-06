define(['dojo/_base/declare', 'jimu/BaseWidget'], function (declare, BaseWidget) {
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'dynamic-search-widget-cuna-mas',

    postCreate: function postCreate() {
      this.inherited(arguments);
      console.log('DynamicSearchWidgetCunaMas::postCreate');
    }
  }
  // startup() {
  //   this.inherited(arguments);
  //   console.log('DynamicSearchWidgetCunaMas::startup');
  // },
  // onOpen() {
  //   console.log('DynamicSearchWidgetCunaMas::onOpen');
  // },
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
