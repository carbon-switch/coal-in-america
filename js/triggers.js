
function triggerMap() {

  enterView({
  	selector: '#map-wrapper',
  	enter: function(el) {
  		console.log("hi")
    },
    offset: 0.4,
    once: true,
  });

}

triggerMap()
