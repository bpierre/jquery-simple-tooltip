;(function($){
	// simpletooltip
	$.fn.simpletooltip = function(settings) {
		
		var options = $.extend({
			hideOnLeave: true,
			margin: 5,
			showEffect: false,
			hideEffect: false,
			click: false,
			hideDelay: 0,
			showDelay: .1,
			showCallback: function(){},
			hideCallback: function(){},
			customTooltip: false,
			customTooltipCache: true
		}, settings);
		
		this.each(function () {
			
			// Get and hide tooltip
			if (! $.isFunction(options.customTooltip)) {
				$(this).data("$tooltip", getTooltip(this).hide());
			}
			
			if (options.click) {
				$(this).bind("click", {"options": options, "target": this}, openTooltip);
			}
			else {
				var tipTimeOut;
				
				$(this)
				// On mouseenter, init delay
				.bind("mouseenter", {"options": options, "target": this}, function(e) {
					var mouseEvent = e;
					
					tipTimeOut = window.setTimeout(function() {
						openTooltip(mouseEvent);
					}, (options.showDelay * 1000));
				})
				// On mouseleave, reset delay
				.bind("mouseleave", function() {
					window.clearTimeout(tipTimeOut);
				});
			}
			
		});
		
		return this;
	};
	
	function getTooltip(target) {
		
		// Anchor only
		var currentHrefMatch = $(target).attr("href").match(/#.+/);
		if (!!currentHrefMatch){
			var $tooltip = $(currentHrefMatch[0]);
		}
		
		return $tooltip;
	};
	
	function initTooltip($tooltip) {
		
		$tooltip
		
		// Append to body
		.appendTo(document.body)
		
		// Store dimensions
		.data("width", $tooltip.outerWidth())
		.data("height", $tooltip.outerHeight())
		
		// Set CSS
		.css({"position": "absolute", "zIndex": "9998", "display": "none"})
		
		// Close tooltip btn
		.find("a[rel=close]").click(function (e) {
			e.preventDefault();
			$tooltip.trigger("hide");
		}).end()
		
		// Init ok.
		.data("init", true);
	};
	
	function openTooltip(e){
		
		if (e.type == "click") {
			e.preventDefault();
		}
		
		var opts = e.data.options;
		
		var $target = $(e.data.target);
		
		// Custom tooltip
		if (!opts.customTooltipCache && $target.data("$tooltip")) {
			$target.data("$tooltip").remove();
			$target.data("$tooltip", false);
		}
		
		if (!$target.data("$tooltip")) {
			$target.data("$tooltip", $(opts.customTooltip($target.get(0))));
		}
		
		var $tooltip = $target.data("$tooltip");
		
		if (!$tooltip.data("init")) {
			initTooltip($tooltip);
		}
		
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		var winOffsetY = $(window).scrollTop();
		var winOffsetX = $(window).scrollLeft();
		
		// Remove show / hide triggers
		$tooltip.unbind("show").unbind("hide");
		
		// Show
		if (opts.showEffect && ( opts.showEffect.match(/^fadeIn|slideDown|show$/) ) ) {
			$tooltip.bind("show", function(){
				$tooltip[opts.showEffect](200);
				opts.showCallback($target[0], this);
			});
		}
		else {
			$tooltip.bind("show", function(){
				$tooltip.show();
				opts.showCallback($target[0], this);
			});
		}
		
		// Hide
		if (opts.hideEffect && ( opts.hideEffect.match(/^fadeOut|slideUp|hide$/) ) ) {
			$tooltip.bind("hide", function(){
				opts.hideCallback($target[0], this);
				$tooltip[opts.hideEffect](200);
			});
		}
		else {
			$tooltip.bind("hide", function(){
				opts.hideCallback($target[0], this);
				$tooltip.hide();
			});
		}
		
		// Initial tooltip position
		var tooltipPosX = e.pageX - ($tooltip.data("width")/2);
		var tooltipPosY = e.pageY - ($tooltip.data("height")/2);
		
		// Replace tooltip position
		if (tooltipPosX < winOffsetX + opts.margin) { // Left
			tooltipPosX = winOffsetX + opts.margin;
		} else if (tooltipPosX + $tooltip.data("width") > (winOffsetX + winWidth - opts.margin)) { // Right
			tooltipPosX = winOffsetX + winWidth - $tooltip.data("width") - opts.margin;
		}
		
		if (tooltipPosY < winOffsetY + opts.margin) { // Top
			tooltipPosY = winOffsetY + opts.margin;
		} else if (tooltipPosY + $tooltip.data("height") > (winOffsetY + winHeight - opts.margin)) { // Bottom
			tooltipPosY = winOffsetY + winHeight - $tooltip.data("height") - opts.margin;
		}
		
		// Delay
		if (opts.hideDelay > 0 && opts.hideOnLeave) {
			var timer;
			$tooltip.hover(
				function(){
					window.clearTimeout(timer);
				},
				function(){
					timer = window.setTimeout(function(){
						$tooltip.trigger("hide").unbind("mouseenter, mouseleave");
					}, opts.hideDelay * 1000);
				}
			);
		}
		
		// No delay
		else if (opts.hideOnLeave){
			$tooltip.bind("mouseleave", function(){
				$tooltip.trigger("hide").unbind("mouseleave");
			});
		}
		
		// Apply CSS and show
		$tooltip
			.css({"left": tooltipPosX + "px", "top": tooltipPosY + "px"})
			.trigger("show");
		
	};
})(jQuery);