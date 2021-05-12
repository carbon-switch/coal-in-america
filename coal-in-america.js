
function runStuff() {

  enterView({
  	selector: '.bar-outer',
  	enter: function(el) {
  		el.classList.add('entered');
  	},
    exit: function(el) {
		el.classList.remove('entered');
    },
    offset: 0.4,
  });

}

runStuff()
