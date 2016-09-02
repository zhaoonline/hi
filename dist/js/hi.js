/**
 * carousel
 */
;
(function($, window, document, undefined) {
    $.fn.carousel = function(options) {
        options = $.extend({}, $.fn.carousel.options, options);
        this.each(function() {
            var carouselBox = $(this).find('.carousel-content');
            var carousel = carouselBox.find('li');
            var count = carousel.length;
            var _this = this;
            var index = 0;
            var time = null;
            $(this).data('options', options);
            if (!options.showNav) {
                $(this).find('.nav-box').css('display', 'none');
            }
            // next
            $(this).find('.carousel-next').on('click', function() {
                if (options['isAnimate'] == true) {
                    return;
                }
                var old = index;
                if (index >= count - 1) {
                    index = 0;
                } else {
                    index++;
                }
                change.call(_this, index, old);
            });
            // prev
            $(this).find('.carousel-prev').on('click', function() {
                if (options['isAnimate'] == true) {
                    return;
                }
                var old = index;
                if (index <= 0) {
                    index = count - 1;
                } else {
                    index--;
                }
                change.call(_this, index, old);
            });
            $(this).find('.nav-box li').each(function(cindex) {
                $(this).on('click.carouselbox', function() {
                    change.call(_this, cindex, index);
                    index = cindex;
                });
            });
            $(this).find('.nav-box li').each(function(cindex) {
                $(this).on('mouseover.carouselbox', function() {
                    change.call(_this, cindex, index);
                    index = cindex;
                });
            });
            $(this).on('mouseover', function() {
                if (options.autoPlay) {
                    clearInterval(time);
                }
                $(this).find('.carousel-prev, .carousel-next').css({
                    opacity: 0.6
                });
            });
            $(this).on('mouseleave', function() {
                if (options.autoPlay) {
                    startAtuoPlay(options.interval);
                }
                $(this).find('.carousel-prev, .carousel-next').css({
                    opacity: 0.1
                });
            });
            startAtuoPlay(options.interval);

            function startAtuoPlay(inum) {
                if (options.autoPlay) {
                    time = setInterval(function() {
                        var old = index;
                        if (index >= count - 1) {
                            index = 0;
                        } else {
                            index++;
                        }
                        change.call(_this, index, old);
                    }, inum); //2秒
                }
            }
            var box = $(this).find('.nav-box');
            box.css({
                'margin-left': -(box.width() / 2)
            })
            switch (options.direction) {
                case "x":
                    options['width'] = $(this).width();
                    carouselBox.css({
                        'width': count * options['width']
                    });
                    carousel.css({
                        'float': 'left',
                        'position': 'relative',
                        'margin-left': '0px'
                    });
                    carouselBox.wrap('<div class="ck-carousel-direction"></div>');
                    carousel.show();
                    break;
                case "y":
                    options['height'] = $(this).height();
                    carouselBox.css({
                        'height': count * options['height']
                    });
                    carousel.css({
                        'float': 'left',
                        'position': 'relative',
                        'margin-top': '0px'
                    });
                    carouselBox.wrap('<div class="carousel-box"></div>');
                    carousel.show();
                    break;
            }
        });
    };

    function change(show, hide) {
        var options = $(this).data('options');
        if (options.direction == 'x') {
            var x = show * options['width'];
            $(this).find('.carousel-content').stop().animate({
                'margin-left': -x
            }, function() {
                options['isAnimate'] = false;
            });
            options['isAnimate'] = true;
        } else if (options.direction == 'y') {
            var y = show * options['height'];
            $(this).find('.carousel-content').stop().animate({
                'margin-top': -y
            }, function() {
                options['isAnimate'] = false;
            });
            options['isAnimate'] = true;
        } else {
            $(this).find('.carousel-content li').eq(hide).stop().animate({
                opacity: 0
            }, function() {
                $(this).css('display', 'none');
            });
            $(this).find('.carousel-content li').eq(show).show().css({
                opacity: 0
            }, function() {
                $(this).css('display', 'none');
            }).stop().animate({
                opacity: 1
            }, function() {
                $(this).css('display', 'block');
            });
        }
        $(this).find('.nav-box li').removeClass('active');
        $(this).find('.nav-box li').eq(show).addClass('active');
    }
    $.fn.carousel.options = {
        autoPlay: true,
        showNav: true,
        direction: null,
        isAnimate: false,
        interval: 2000
    };
})(window.jQuery, window, document);
/**
 * Hi Web Framework docs
 * @return void
 */
$(function() {
    console.log('hi');
    $("#test_slide").carousel();
    $("img[data-original]").lazyload({
        effect : "fadeIn"
    });
});
/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */
(function($, window, document, undefined) {
    var $window = $(window);
    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "original",
            skip_invisible: false,
            appear: null,
            load: null,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }
        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }
            $.extend(settings, options);
        }
        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined || settings.container === window) ? $window : $(settings.container);
        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, function() {
                return update();
            });
        }
        this.each(function() {
            var self = this;
            var $self = $(self);
            self.loaded = false;
            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }
            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />").one("load", function() {
                        var original = $self.attr("data-" + settings.data_attribute);
                        $self.hide();
                        if ($self.is("img")) {
                            $self.attr("src", original);
                        } else {
                            $self.css("background-image", "url('" + original + "')");
                        }
                        $self[settings.effect](settings.effect_speed);
                        self.loaded = true;
                        /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded;
                        });
                        elements = $(temp);
                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                    }).attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });
            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });
        /* Check if something appears when window is resized. */
        $window.on("resize", function() {
            update();
        });
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }
        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        return this;
    };
    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    $.belowthefold = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.rightoffold = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.abovethetop = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    $.leftofbegin = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */
    $.extend($.expr[":"], {
        "below-the-fold": function(a) {
            return $.belowthefold(a, {
                threshold: 0
            });
        },
        "above-the-top": function(a) {
            return !$.belowthefold(a, {
                threshold: 0
            });
        },
        "right-of-screen": function(a) {
            return $.rightoffold(a, {
                threshold: 0
            });
        },
        "left-of-screen": function(a) {
            return !$.rightoffold(a, {
                threshold: 0
            });
        },
        "in-viewport": function(a) {
            return $.inviewport(a, {
                threshold: 0
            });
        },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function(a) {
            return !$.belowthefold(a, {
                threshold: 0
            });
        },
        "right-of-fold": function(a) {
            return $.rightoffold(a, {
                threshold: 0
            });
        },
        "left-of-fold": function(a) {
            return !$.rightoffold(a, {
                threshold: 0
            });
        }
    });
})(window.jQuery, window, document);