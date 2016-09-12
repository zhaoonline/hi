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
    $('[data-toggle="tooltip"]').tooltip();
});