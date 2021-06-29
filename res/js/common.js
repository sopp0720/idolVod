HTMLElement.prototype.closestOne = function (_selector) {
    let start = this;
    while (parent) {
        // isMatch and isEqual?
        const cond1 = start.parentElement ? start.parentElement.querySelector(_selector) : null;
        const cond2 = start.matches(_selector);
        if (cond1 && cond2) return start;
        else if (!start.parentElement) return null;
        start = start.parentElement;
    }
    return null;
};
var webUI = (function() {
    var timeout;
    return {
        "getChildIndex": function(child) {
            var parent = child.parentNode;
            var children = parent.children;
            var i = children.length - 1;
            for (; i >= 0; i--) {
                if (child == children[i]) {
                    break;
                }
            }
            return i;
        },
        "debounce": function(func, wait, immediate) {
            var context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        },
		"easeInOutQuad" : function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		},
		"animatedScrollTo": function(element, to, duration) {
			var start = element.scrollLeft;
			var change = to - start;
			var currentTime = 0;
			var increment = 20;
			var animateScroll = function(callback) {
				currentTime += increment;
				var val = Math.floor(webUI.easeInOutQuad(currentTime, start, change, duration));
				element.scrollLeft = val;
				if (currentTime < duration) {
					window.requestAnimationFrame(animateScroll);
				} else {
					if (callback && typeof(callback) === 'function') {
						callback();
					}
				}
			}
			animateScroll();
		},
        "addListener": function(node, event, listener, useCapture) {
            if (!node || !event || !listener) return;

            if (node instanceof Node) {
                node.addEventListener(event, listener, (typeof useCapture === "undefined") ? false : useCapture);
            } else if (node instanceof NodeList) {
                if (node.length > 0) {
                    for (var i = 0, l = node.length; i < l; i++) {
                        node[i].addEventListener(event, listener, (typeof useCapture === "undefined") ? false : useCapture);
                    }
                }
            }
        },
        "addDelegate": function(node, event, selector, listener, useCapture) {
            if (!node || !event || !listener) return;

            webUI.addListener(node, event, function(e) {
                var target = e.target;
                if (typeof selector === "string") {
                    while (target.matches(selector) == false && target !== this) {
                        target = target.parentElement;
                    }
                    if (target.matches(selector)) {
                        listener.call(target, e);
                    }
                } else {
                    selector.call(this, e);
                }
            }, useCapture);
        }
    }
})();
/* 팝업 노출시 스크롤 고정 스크립트 */
var layerPopup = (function() {
	var html = undefined;
	var layer;
	var sctop;
    return {
		"show" : function(elem, container) {
			layer = document.querySelector(elem);
			if (container == null){
				html = (document.body.scrollTop == '0') ? document.documentElement : document.body;
			} else {
				html = container;
			}
			sctop = html.scrollTop;
			html.style.top = (0 - sctop) + "px";
			html.classList.add('noscroll');
			layer.style.display = 'block';
			setTimeout(function() {
				layer.classList.add('visible');
			}, 50);
		},
		"hide" : function(elem) {
			if (html == undefined){
				html = (document.body.scrollTop == '0') ? document.documentElement : document.body;
			}
			if (elem !== undefined){
				layer = document.querySelector(elem);
			}
			html.classList.remove("noscroll");
			html.scrollTop = sctop;
			html.style.top = "";
			layer.classList.remove('visible');
			setTimeout(function() {
				layer.style.display = 'none';
			}, 500);
		}
    };
}());

/* 터치 효과 더미 스크립트 개발시 삭제 */
document.addEventListener("DOMContentLoaded", function() {
    var hasTouchEvent = "ontouchstart" in document.documentElement,
        START_EV = hasTouchEvent ? "touchstart" : "mousedown",
        END_EV = hasTouchEvent ? "touchend" : "mouseup";
    var dragPoint = false;
    webUI.addDelegate(document.body, START_EV, ".usetap", function(e) {
        dragPoint = true;
        this.classList.add("active");
    });
    webUI.addDelegate(document.body, END_EV, ".usetap", function(e) {
        dragPoint = false;
        this.classList.remove("active");
    });
    webUI.addDelegate(document.body, "touchcancel", ".usetap", function(e) {
        dragPoint = false;
        this.classList.remove("active");
    });
    webUI.addDelegate(document.body, "mousemove", ".usetap", function(e) {
        if (dragPoint == true) {
            e.target.onmouseout = function() {
                this.classList.remove("active");
            }
        }
    });
});







