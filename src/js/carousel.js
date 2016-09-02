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