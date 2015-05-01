(function( $ ){
    $.fn.qtySelector = function(options) {
        
        var self = this;
        var selectors;
        
        selectors = (self.is('.qty-selector')) ? self : $('.qty-selector', self); //TODO: check when self is []       
        
        $(selectors).each(function (key, selector) {
            
            var $selector = $(selector);
            
            selector.settings = $.extend({
                /* attributes */
                debug_mode: false,
                id:key,
                icon_minus:"glyphicon glyphicon-minus", 
                icon_plus:"glyphicon glyphicon-plus",
                max_value:100,
                min_value:0,
                name:"qty_selector[" + key + "]",
                value:0,
                width:"150px", //this should be css only... *1
                /* methods */
                onChange:onChange,
                onCreate:onCreate
            }, options);   
            
            selector.enable = enable;
            selector.disable = disable;
            //selector.toggle ??
            
            /* override with inline values if defined */
            selector.settings.id = $selector.attr('data-id') || selector.settings.id;
            selector.settings.name = $selector.attr('data-name') || selector.settings.name;
            selector.settings.value = $selector.attr('data-value') || selector.settings.value;
            
            $selector.css("width", selector.settings.width); //default should be stylesheet driven! *1
            
            
            render($selector, selector);
            
            setFocusInOut($selector); // when we do manual entry (should config if allowed)
            setClick($selector,selector);
            setChange($selector,selector);
            
            selector.settings.onCreate(selector);

        });
        
        
        function render($selector, selector) {

            var value = selector.settings.value;

            if (selector.settings.min_value > value) {

                value = selector.settings.min_value;

            } else if (selector.settings.max_value < value) {

                value = selector.settings.max_value;
            }

            var content = '<div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number" data-type="minus" data-field="' + selector.settings.name + '"><span class="' + selector.settings.icon_minus + '"></span></button></span><input type="text" name="' + selector.settings.name + '" class="form-control input-number" value="' + value + '"><span class="input-group-btn"><button type="button" class="btn btn-success btn-number" data-type="plus" data-field="' + selector.settings.name + '"><span class="' + selector.settings.icon_plus + '"></span></button></span></div>';

            $selector.html(content);
        }
        
        
        function setFocusInOut($selector){

            var input_number = $selector.find('.input-number');

            $(input_number).focusin(function(){

                var self = $(this);
                
                self.data('oldValue', self.val());
            });
            
            $(input_number).focusout(function(){
                
                var self = $(this);

                self.change();
            });
        }

        function setClick($selector, selector) {
            
            var btn_number = $selector.find('.btn-number');

            $(btn_number).click(function (e) {

                e.preventDefault();
                
                var self = $(this);

                var type = self.attr('data-type');
                var fieldName = $(btn_number).attr('data-field');
                var input = $selector.find("input[name='" + fieldName + "']");
                var currentVal = parseInt(input.val());

                if (!isNaN(currentVal)) { 
                    
                    if (type == 'minus') {

                        if (currentVal > selector.settings.min_value) {
                            input.val(currentVal - 1).change(); //do we need to invoke it?
                        }
                        
                        if (parseInt(input.val()) == selector.settings.min_value) {
                            self.attr('disabled', true);
                        }

                    } else if (type == 'plus') {

                        if (currentVal < selector.settings.max_value) {
                            input.val(currentVal + 1).change();
                        }
                        if (parseInt(input.val()) == selector.settings.max_value) {
                            self.attr('disabled', true);
                        }

                    }
                }                         
            });
        }        

        function setChange($selector, selector){

            var input_number = $selector.find('.input-number');

            $(input_number).change(function() {
                
                var self = $(this);

                var currentValue = self.val();

                if (!isNaN(currentValue)) {

                    var name = self.attr('name');

                    if(currentValue >= selector.settings.min_value) {

                        $selector.find(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled');
                    } else {
                        
                        self.val(self.data('oldValue') || selector.settings.min_value);
                    }

                    if(currentValue <= selector.settings.max_value) {

                        $selector.find(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled');
                    } else {

                        self.val(self.data('oldValue') || selector.settings.max_value);
                    }

                } else {

                    self.val(self.data('oldValue') || selector.settings.min_value);
                }  
                
                currentValue = self.val(); // can I do this better? inside if or something...
                
                if(currentValue != self.data('oldValue'))
                    selector.settings.onChange(currentValue,selector);
                
            });            

        }
        
        function enable(){
            
            var self = this;
            
            $('button', self).removeAttr('disabled')
        };
        
        function disable(){

            var self = this;
            
            $('button', self).attr('disabled', true)
        };



        function onChange(currentValue, selector){

            if (selector.settings.debug_mode){

                console.log('Current value: ' + currentValue + ' on ' + selector.settings.name);
            }
        }

        function onCreate(selector){

            if (selector.settings.debug_mode){

                console.log('Creating ' + selector.settings.name + ' with value: ' + selector.settings.value);
            }
        }	
        
        return self;
    }

})( jQuery );