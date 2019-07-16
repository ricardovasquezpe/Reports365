module.exports = function(app, jwt){
  var Boleta = require('../entity/boleta.js');

  app.post('/api/createboleta', function(req, res){
    req.check('serie', 'Invalid serie').notEmpty();
    
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    var newBoleta = Boleta(req.body);
    newBoleta.save(function(err) {
      if (err){
        if(err.code == 11000){
            res.json(
              {"status" : false,
               "data"   : "Boleta already created"}
            );
        }else{
          res.json(
              {"status" : false,
               "data"   : "Weird error"}
            );
        }
        return;
      }

      res.json(
        {"status" : true,
         "data"   : 'Boleta created!'}
      );
      return;

    });

  });

  app.get('/api/allboletas', function(req, res){
    Boleta.find({}, {'__v': 0}).sort({serie: -1, correlativo: -1}).exec(function(err, boletas) { 

        if (!boletas){
            res.json(
              {"status" : false,
               "data"   : "Boletas not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : boletas}
        );
      return;
     });
  });

}