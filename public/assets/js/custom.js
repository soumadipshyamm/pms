// login page password
$(".toggle-eye").click(function () {

	$(this).toggleClass("fa-eye fa-eye-slash");
	var input = $($(this).attr("toggle"));
	if (input.attr("type") == "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});


$(document).ready(function () {
	//   data table (satff management page)
	
	// boostrap multiple select
	if ($('.select_box').length) {
		$('.select_box').multiselect({
			enableFiltering: true,
			includeSelectAllOption: true,
			maxHeight: '300',
		});

	}

//  Hierarchy Tree
$.fn.extend({
	treed: function () {
	  return this.each(function () {
		//initialize each of the top levels
		var tree = $(this);
		tree.addClass("tree");
		tree
		  .find("li")
		  .has("ul")
		  .each(function () {
			var branch = $(this); //li with children ul
			branch.prepend("<i class='indicator_hierbox fa-solid fa-plus'></i>");
			branch.addClass("branch");
			branch.on("click", function (e) {
			  if (this == e.target) {
				var icon = $(this).children("i:first");
				icon.toggleClass("fa-minus fa-plus");
				$(this).children().children().toggle();
			  }
			});
			branch.children().children().toggle();
		  });
		//fire event from the dynamically added icon
		$(".branch .indicator_hierbox").on("click", function () {
		  $(this).closest("li").click();
		});
		//fire event to open branch if the li contains an anchor instead of text
		$(".branch a").on("click", function (e) {
		  $(this).closest("li").click();
		  e.preventDefault();
		});
		//fire event to open branch if the li contains a paragraph instead of text
		$(".branch p").on("click", function (e) {
		  $(this).closest("li").click();
		  e.preventDefault();
		});
	  });
	}
  });
  
  $(".tree").treed();
   $(".branch .indicator_hierbox").trigger("click");

});

//   preloader
$(window).on('load',function () {
	$("#preloader").fadeOut(1000);
	});