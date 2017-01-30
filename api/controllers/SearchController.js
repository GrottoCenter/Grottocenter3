'use strict';
 module.exports = {

   findAll: function(req, res) {
     var parameters = {};
     if (req.param('name') !== undefined) {
       parameters.name = {
         'like': '%' + req.param('name') + '%'
       };
       sails.log.debug('Search > parameters ' + parameters.name.like);
     }

     // search for caves
     TCave.find(parameters).sort('id ASC').limit(50).exec(function(err, foundCave) {
         // search for entries
         TEntry.find(parameters).sort('id ASC').limit(50).exec(function(err, foundEntry) {
           // search for grottos
           TGrotto.find(parameters).sort('id ASC').limit(50).exec(function(err, foundGrotto) {
             var params = {};
             params.controllerMethod = 'SearchController.readAll';
             params.notFoundMessage = 'No items found.';
             return ControllerService.treat(err, foundCave.concat(foundEntry).concat(foundGrotto), params, res);
           });
         });
     });
   }
 };
