var sampleData = require('./sample_data')();
var CONSTANTS = require('./constants');

function unsubscribeAll(mediator) {
  mediator.remove(CONSTANTS.WORKFLOWS.CREATE);
  mediator.remove(CONSTANTS.WORKFLOWS.READ);
  mediator.remove(CONSTANTS.WORKFLOWS.UPDATE);
  mediator.remove(CONSTANTS.WORKFLOWS.DELETE);
  mediator.remove(CONSTANTS.WORKFLOWS.LIST);
  mediator.remove(CONSTANTS.WORKORDERS.LIST);
  mediator.remove(CONSTANTS.RESULTS.LIST);
  mediator.remove(CONSTANTS.APPFORMS.LIST);
}
//Mock Subscribers for workflow mediator topics
function setupSubscribers(mediator, $scope) {
  // Workflow CRUDL subscribers
  mediator.subscribe(CONSTANTS.WORKFLOWS.CREATE, function(data) {
    data.workflowToCreate = JSON.parse(angular.toJson(data.workflowToCreate));
    data.workflowToCreate.id = data.topicUid;
    sampleData.push(data.workflowToCreate);
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.CREATE + ':' + data.topicUid, data.workflowToCreate);
  });

  mediator.subscribeForScope(CONSTANTS.WORKFLOWS.READ, $scope,function(data) {
    var obj = _.find(sampleData, function(obj) {
      return obj.id == data.topicUid;
    });
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.READ + ':' + data.topicUid, obj)
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.UPDATE, function(data) {
    sampleData.forEach(function(obj) {
      if(obj.id === data.topicUid) {
        obj = data.workflowToUpdate;
      }
    });
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.UPDATE + ':' + data.topicUid, data.workflowToUpdate);
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.DELETE, function(data) {
    sampleData = sampleData.filter(function(obj) {
      return obj.id !== data.topicUid;
    });
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.DELETE + ':'+ data.topicUid, data.topicUid);
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.LIST, function() {
    console.log('>>>>>>>data', sampleData);
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.LIST, sampleData)
  });


  //Subscribers for results, workorders and appforms
  mediator.subscribe(CONSTANTS.RESULTS.LIST, function() {
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.RESULTS.LIST, ['a', '2', 'c'])
  });

  mediator.subscribe(CONSTANTS.WORKORDERS.LIST, function() {
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKORDERS.LIST, [{}, {}, {}]);
  });

  mediator.subscribe(CONSTANTS.APPFORMS.LIST, function() {
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.APPFORMS.LIST, [{}]);
  });

}

module.exports = {
  unsubscribeAll: unsubscribeAll,
  setupSubscribers: setupSubscribers
};