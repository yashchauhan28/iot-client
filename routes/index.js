var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');


var client  = mqtt.connect("mqtt://localhost:1883");
// console.log(client);
//subscriptions
var sub1 = client.subscribe("/led/status/1");
var sub2 = client.subscribe("/led/change/1");
var sub3 = client.subscribe("/led/status/2");
var sub4 = client.subscribe("/led/change/2");


// client.on("message", function(topic, payload) {
// console.log([topic, payload].join(": "));
// client.end();
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  var dict={};
  dict['title'] = "MQTT client";
  dict['led1Status'] = "no status";
  dict['led2Status'] = "no status";

  client.publish("/led/status/1","send");
  client.publish("/led/status/2","send");

  client.on("message", function(topic, payload) {
  console.log([topic, payload].join(": "));
    if(topic=="/led/status/1"){
      if(payload.toString()=="ON" || payload.toString()=="OFF"){
        dict['led1Status'] = payload.toString();
      }
    }
    if(topic=="/led/status/2"){
      if(payload.toString()=="ON" || payload.toString()=="OFF"){
        dict['led2Status'] = payload.toString();
      }
    }
  });

  res.render('index',dict);
});

router.get('/change1',function(req,res,next){
  console.log("Changing status led1...");
  client.publish("/led/change/1","OFF");
  res.redirect('/');
});

router.get('/change2',function(req,res,next){
  console.log("Changing status led2...");
  client.publish("/led/change/2","ON");
  res.redirect('/');
});

module.exports = router;
