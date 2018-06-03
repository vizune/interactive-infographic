
    (function ($) {
        // addClass shim
        var addClass = $.fn.addClass;
        $.fn.addClass = function (value) {
            var orig = addClass.apply(this, arguments);

            var elem,
                i = 0,
                len = this.length;

            for (; i < len; i++) {
                elem = this[i];
                if (elem instanceof SVGElement) {
                    var classes = $(elem).attr('class');
                    if (classes) {
                        var index = classes.indexOf(value);
                        if (index === -1) {
                            classes = classes + " " + value;
                            $(elem).attr('class', classes);
                        }
                    } else {
                        $(elem).attr('class', value);
                    }
                }
            }
            return orig;
        };

        // removeClass shim
        var removeClass = $.fn.removeClass;
        $.fn.removeClass = function (value) {
            var orig = removeClass.apply(this, arguments);

            var elem,
                i = 0,
                len = this.length;

            for (; i < len; i++) {
                elem = this[i];
                if (elem instanceof SVGElement) {
                    var classes = $(elem).attr('class');
                    if (classes) {
                        var index = classes.indexOf(value);
                        if (index !== -1) {
                            classes = classes.substring(0, index) + classes.substring((index + value.length), classes.length);
                            $(elem).attr('class', classes);
                        }
                    }
                }
            }
            return orig;
        };

        // hasClass shim
        var hasClass = $.fn.hasClass;
        $.fn.hasClass = function (value) {
            var orig = hasClass.apply(this, arguments);

            var elem,
                i = 0,
                len = this.length;

            for (; i < len; i++) {
                elem = this[i];
                if (elem instanceof SVGElement) {
                    var classes = $(elem).attr('class');

                    if (classes) {
                        if (classes.indexOf(value) === -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            }
            return orig;
        };
    })(jQuery);

    /*
     * jQuery shuffle
     *
     * Copyright (c) 2008 Ca-Phun Ung <caphun at yelotofu dot com>
     * Dual licensed under the MIT (MIT-LICENSE.txt)
     * and GPL (GPL-LICENSE.txt) licenses.
     *
     * http://yelotofu.com/labs/jquery/snippets/shuffle/
     *
     * Shuffles an array or the children of a element container.
     * This uses the Fisher-Yates shuffle algorithm <http://jsfromhell.com/array/shuffle [v1.0]>
     */

    (function ($) {

        $.fn.shuffle = function () {
            return this.each(function () {
                var items = $(this).children().clone(true);
                return (items.length) ? $(this).html($.shuffle(items)) : this;
            });
        }

        $.shuffle = function (arr) {
            for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
            return arr;
        }

    })(jQuery);

    $(function () {

        var timer = false;
        var hoverCircle = true,
            touchOnly = false;


        // Disable hover functionality for mobile / tablet portrait
        if (window.matchMedia('(max-width: 769px)').matches) {
            touchOnly = true;
        }


        function ifSelected() {
                hoverCircle = false;

                $('html, .infographic-panel-close').unbind('click.noSticky');

                var selector = '.infographic-panel-close';

                if (!window.matchMedia('(max-width: 769px)').matches) {

                    selector += ', html';
                } 

                $(selector).bind('click.noSticky', function (e) {
                    e.stopPropagation();
                    hideIfSticky();
                })
        }

        function hideIfSticky() {
            $('#Data_Possibilities').find('.selected').removeClass('selected');
            timer = setTimeout(function () {
                hidePanel()
            }, 200);

            hoverCircle = true;
        }


        $('#Data_Possibilities').find('g').click(function (e) {
            if ($(this).is('.selected')) {
                hideIfSticky();
            } else {


                if (timer) {
                    clearTimeout(timer);
                }

                // Scroll to infographic when clicked
                $('html, body').stop(true, false).animate({
                    scrollTop: $('#infographic-wrapper').offset().top
                }, 500);


                var el = this;
                showContent(el);

                // Position & height of circles
                var circleOffset = $(this).offset();
                var wrapperOffset = $('#infographic-wrapper').offset();
                var panelContainerOffset = $('#infographic-panel-container').offset();

                var circleHeight = this.getBoundingClientRect().height || 170;
                var circleWidth = this.getBoundingClientRect().width || 170;

                if (!window.matchMedia('(max-width: 769px)').matches) {
                    // Transition and animated triggers if a panel is already visible
                    $('.infographic-panel-arrow').stop(true, false).animate({
                        'left': circleOffset.left - panelContainerOffset.left + (circleWidth / 2)
                    }, 250);
                    $('#infographic-panel').stop(true, false).animate({
                        'top': circleOffset.top - wrapperOffset.top + circleHeight + 13
                    }, 250);
                }

                // Show panel content
                $('#infographic-panel').css('display', 'block').fadeTo(250, 1);
                $('.infographic-panel-close').addClass('infographic-panel-active');

                // Color transition depending on petal selected
                var circleColor = $(this).find('circle').attr('fill');
                $('#infographic-panel').css('background', circleColor);
                $('#infographic-arrow').attr('fill', circleColor);


                $("#Data_Possibilities").find('g').removeClass('infographic-panel-active selected');
                $(this).addClass('infographic-panel-active selected');

                ifSelected();
                event.stopPropagation();
            }
        });
       
        
            $("#Data_Possibilities").find("g") 
                .mouseenter(function (e) {
                    if(touchOnly || !hoverCircle) return;
                   

                        if (timer) {
                            clearTimeout(timer);
                        }

                        var isVisible = !!$('#infographic-panel').is(':visible');

                        // Position & height of circles
                        var circleOffset = $(this).offset();
                        var wrapperOffset = $('#infographic-wrapper').offset();
                        var panelContainerOffset = $('#infographic-panel-container').offset();

                        var circleHeight = this.getBoundingClientRect().height || 170;
                        var circleWidth = this.getBoundingClientRect().width || 170;

                        // Show content of corresponding panels
                        var el = this;
                        showContent(el);

                        if (!window.matchMedia('(max-width: 769px)').matches) {

                            if (isVisible) {
                                // Transition and animated triggers if a panel is already visible
                                $('.infographic-panel-arrow').stop(true, false).animate({
                                    'left': circleOffset.left - panelContainerOffset.left + (circleWidth / 2)
                                }, 250);
                                $('#infographic-panel').stop(true, false).animate({
                                    'top': circleOffset.top - wrapperOffset.top + circleHeight + 13
                                }, 250);

                            } else {
                                // Transition and animation is not triggered if there are currently no panels visible
                                $('.infographic-panel-arrow').stop(true, false).css({
                                    'left': circleOffset.left - panelContainerOffset.left + (circleWidth / 2)
                                });
                                $('#infographic-panel').css({
                                    'top': circleOffset.top - wrapperOffset.top + circleHeight + 13
                                });

                                $('.infographic-panel-close').removeClass('infographic-panel-active ');
                            }
                        }
                        // Color transition depending on petal selected
                        var circleColor = $(this).find('circle').attr('fill');
                        $('#infographic-panel').css('background', circleColor);
                        $('#infographic-arrow').attr('fill', circleColor);

                        $('#infographic-panel').css('display', 'block').fadeTo(250, 1);
                        $("#Data_Possibilities").find('g').removeClass('infographic-panel-active ');
                        $(this).addClass('infographic-panel-active');


            })
                .mouseleave(function (e) {

                    if (touchOnly || !hoverCircle) return;
                        timer = setTimeout(function () {
                            hidePanel()
                        }, 500);
                });

        function showContent(el) {
            var $el = $(el);

            // Gets number from circle ID and displays panel with corresponding ID i.e. circle1 will display panel1
            var currentPanelId = $el.attr('id').slice(-1);
            var currentPanelDiv = $('.infographic-panel-content' + currentPanelId);

            // Height of panel adjusts to the height of the content selected
            var currentPanelHeight = currentPanelDiv.height();

            $('#infographic-panel .infographic-panel-content').removeClass('infographic-panel-active');

            currentPanelDiv.addClass('infographic-panel-active');
        }
        $('#infographic-panel').mouseenter(function () {
            if (timer) {
                clearTimeout(timer);
            }
        });

        function hidePanel() {
            $('#infographic-panel').stop(true, false).fadeTo(200, 0, function () {
                $(this).hide();
                $("#Data_Possibilities").find('g').removeClass('infographic-panel-active');
                $('.infographic-panel-close').removeClass('infographic-panel-active');
            });
        }

    });
    $(function () {
        var animated = $("#Data_Possibilities").find("g");
        var winheight = $(window).height();
        var fullheight = $(document).height();


        $(window).bind('scroll.startAnim',function () {
            startAnimation();
        });

        var arr = [];
        var items = $('#Data_Possibilities').find('g');

        
        items.each(function () {
            arr.push(this.id);
        });

        arr = $.shuffle(arr);
        
        var petalNum = 0;
        var random_petals_init = false;

        function randomisePetal() {
            $('#' + arr[petalNum]).addClass('animated');
            petalNum++;
            if (petalNum >= arr.length) clearInterval(random_petals_init)
        }


        function startAnimation() {
            var winTop = $(window).scrollTop();
            var winHeight = $(window).height();

            svg = $('#Data_Possibilities');
            topcoords = svg.offset().top;


            if (winTop + (winHeight * .6) > topcoords) {
                 random_petals_init = setInterval(randomisePetal, 100);
                    $(window).unbind('scroll.startAnim');
                }
        }
    });