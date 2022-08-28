$(function() { // on DOM ready register the events
  $("#twittercon").hover(function(event){
    // stop the out event
    $("#tf animate").get(1).endElement();
    // start the in one
    $("#tf animate").get(0).beginElement();
  }, function(event){
    $("#tf animate").get(0).endElement();
    $("#tf animate").get(1).beginElement();
  });
});



$(function() { // on DOM ready register the events
  $("#youtubecon").hover(function(event){
    // stop the out event
    $("#yf animate").get(1).endElement();
    // start the in one
    $("#yf animate").get(0).beginElement();
  }, function(event){
    $("#yf animate").get(0).endElement();
    $("#yf animate").get(1).beginElement();
  });
});

$(function() { // on DOM ready register the events
  $("#githugcon").hover(function(event){
    // stop the out event
    $("#gf animate").get(1).endElement();
    // start the in one
    $("#gf animate").get(0).beginElement();
  }, function(event){
    $("#gf animate").get(0).endElement();
    $("#gf animate").get(1).beginElement();
  });
});
