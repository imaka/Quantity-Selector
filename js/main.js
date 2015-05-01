(function( $ ){
    $.fn.bootnumberspiner = function(options, callback) {
        
        var spinners = $('.qty-selector'); //this should come from caller, selector is caller

        $(spinners).each(function (key,spinner) {
            spinner.settings = $.extend({
                width:"150px",
                value:0,
                id:key,
                min_value:0,
                max_value:100,
                name:"quint",
                timeout: 0,
                minus_icon:"glyphicon glyphicon-minus", //make it customizable...
                plus_icon:"glyphicon glyphicon-plus",
                onChange:function(){},
                onCreate:function(){},
                defaultCallback:function(){console.log('action finished');} //do we need a default?
                // missing options for themes and actions: on click, otherwise callback makes no sense
                // maybe callback and action should be trough settings and not outside
            }, options);
            debugger;
            spinner.callback = callback || spinner.settings.defaultCallback;
            var $spinner = $(spinner);

            spinner.settings.value = $spinner.attr('data-value') || spinner.settings.value;
            spinner.settings.id = $spinner.attr('data-id') || spinner.settings.id;
            spinner.settings.name = $spinner.attr('data-name') || spinner.settings.name;
            spinner.settings.timeout = $spinner.attr('data-timeout') || spinner.settings.timeout;
            
            $spinner.css("width",spinner.settings.width); //default should be stylesheet driven!
            $spinner.html(get_content(spinner));

            bind_click($spinner,spinner);
            focusin($spinner,spinner); // when we do manual entry (should config if allowed)
            change($spinner,spinner);
            
            spinner.settings.onCreate(spinner);

        });



/* manual edit */
        function change($spinner,spinner){
            
            var input_number = $spinner.find('.input-number');

            $(input_number).change(function() {

                minValue =  parseInt($(this).attr('min'));
                maxValue =  parseInt($(this).attr('max'));
                valueCurrent = parseInt($(this).val());

                name = $(this).attr('name');
                if(valueCurrent >= minValue) {
                    $spinner.find(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled');
                } else {
                    alert('Sorry, the minimum value was reached');
                    $(this).val($(this).data('oldValue') || minValue);
                }
                if(valueCurrent <= maxValue) {
                    $spinner.find(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled');
                } else {
                    alert('Sorry, the maximum value was reached');
                    $(this).val($(this).data('oldValue') || maxValue);
                }

                spinner.settings.onChange(valueCurrent,spinner);
            });
        }

        function focusin($spinner,spinner){
            var input_number = $spinner.find('.input-number');

            $(input_number).focusin(function(){
                
                $(this).data('oldValue', $(this).val());
            });
        }
        
        /* manual edit */

        function bind_click($spinner, spinner) {
            var btn_number = $spinner.find('.btn-number');
            
            $(btn_number).click(function (e) {

                e.preventDefault();


                fieldName = $(btn_number).attr('data-field');
                type = $(this).attr('data-type');
                var input = $spinner.find("input[name='" + fieldName + "']");
                var currentVal = parseInt(input.val());

                if (!isNaN(currentVal)) {
                    if (type === 'minus') {

                        if (currentVal > input.attr('min')) {
                            input.val(currentVal - 1).change();
                        }
                        if (parseInt(input.val()) == input.attr('min')) {
                            $(this).attr('disabled', true);
                        }

                    } else if (type === 'plus') {

                        if (currentVal < input.attr('max')) {
                            input.val(currentVal + 1).change();
                        }
                        if (parseInt(input.val()) == input.attr('max')) {
                            $(this).attr('disabled', true);
                        }

                    }
                } else {
                    input.val(0);
                }

                //ONLY FOR demo purposes, this should act on callback or fixed timeout... yet to think about it
                
                if (spinner.settings.timeout > 0) {
                    $(btn_number).attr('disabled', 'disabled');

                    $('pre').show(200);
                }
                
                
                    setTimeout(function () {
                        $(btn_number).removeAttr('disabled');
                        $('pre').hide(200);
                        spinner.callback();
                    }, spinner.settings.timeout);
                
                //this is our server call, lol
                }
            );
        }

        function get_content(spinner){
            var content = "";
            var value = spinner.settings.value;

            if(spinner.settings.min_value > spinner.settings.value  )
            {
                value = spinner.settings.min_value;
            }else if(spinner.settings.max_value < spinner.settings.value){
                value = spinner.settings.max_value;	
            }
            
            content = '<div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number" data-type="minus" data-field="'+spinner.settings.name+'['+spinner.settings.id+']"><span class="'+spinner.settings.minus_icon+'"></span></button></span><input type="text" name="'+spinner.settings.name+'['+spinner.settings.id+']" class="form-control input-number" value="'+value+'" min="'+spinner.settings.min_value+'" max="'+spinner.settings.max_value+'"><span class="input-group-btn"><button type="button" class="btn btn-success btn-number" data-type="plus" data-field="'+spinner.settings.name+'['+spinner.settings.id+']"><span class="'+spinner.settings.plus_icon+'"></span></button></span></div>';
            
            return content;
        }
    };

})( jQuery );


$('.qty-selector:first').bootnumberspiner({
    onChange:function(valueCurrent,spinner){
        console.log('Current value: '+valueCurrent);
        console.log('Spinner: '+spinner.settings.id);
    },
    onCreate:function(spinner){
        console.log('Creating spinner with value: '+spinner.settings.value);
    }	
}, function(){console.log('this is a custom callback');});
