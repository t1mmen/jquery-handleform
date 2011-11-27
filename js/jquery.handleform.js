/*!
 * jQuery $.handleForm
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {


	var functions = {
		
		/************************************************
		 * Helper function: capitalization
		 ***********************************************/	
		 capitalize : function(form) {
		 
		 },
		 
		/************************************************
		 * Handles the submit button
		 ***********************************************/
		toggleButton : function(form) {

			// Find the submit button in the form			
			var $button = $(form).find('input[type=submit]');

			// What should the button say when loading? data- overwrites default
			if ($(form).attr('data-loading-text')) {
				//@todo
			}
						
			// Remember the text on the submit button..
			if (!$button.attr('data-default-text')) {
				//$button.data('default-text',$button.val()); // why .data no work?
				$button.attr('data-default-text', $button.val()); // but this works?
			}
			
		
			// If the button is disabled already
			if ($button.hasClass('disabled')) {
			
				// Enable the button
				//$button.removeClass('disabled').val($button.data('default-text')).removeAttr('disabled');
				$button.removeClass('disabled').val($button.attr('data-default-text')).removeAttr('disabled');
			
			// If button is disabled.
			} else {
			
				// Disable the button and set text as options.loadingText
				$button.addClass('disabled').val(handleFormOptions.loadingText).attr('disabled', 'disabled');
				
			}
									
		},
		/************************************************
		 * Validation errors function
		 ***********************************************/		
		handleValidationErrors : function(errors, form) {
		
			// Build our error template
			var tmpl = '<div class="alert-message block-message '+ handleFormOptions.errorClass +'">';
				tmpl += '<a href="#" class="close">×</a>';
				tmpl += '<p>';
				tmpl += '<strong>' + handleFormOptions.errorMessage + '</strong>'; //@todo if set.
				tmpl += '<ul>';
				
					// Loop through the errors 
					$.each(errors.validationErrors, function(i, value) { 
					
						// And add the error to the list.
						tmpl += '<li>' + value[0] + '</li>';
						
						/* @todo refractor this code.
						// Find the CakePHP's field names
						var $form_field = '#' + $model + i.functions.capitalize();
						
						// And add 'error' class to them
						$($form_field).addClass('form-error');
						*/
												
					});					
			
				tmpl += '</ul>';
				tmpl += '</p>';
				tmpl += '</div>';

      		// If the target block doesn't exist..
			if (!$(handleFormOptions.errorContainer).length) {
			
					// Create it.
      				$(form).prepend('<div class="' + handleFormOptions.errorContainer.substr(1) +'"></div>');
      		}
      		
      		// Empty any previous error messages, insert the new errors and slide it in to view.
      		$(handleFormOptions.errorContainer)
      			.empty()
      			.html(tmpl)
      			.slideDown(handleFormOptions.transitionTime);
			


			
		},
		/************************************************
		 * How to handle a successful request
		 ***********************************************/		
		handleSuccess : function(response, form) {	
		
		
			// If we're forwarding somewhere on success
			if (handleFormOptions.successUrl) {
				return location.href = handleFormOptions.successUrl;
			}
			
					
			// Do we want to close the modal?
			if (handleFormOptions.closeModal) {
				
				// If the .modal dom element exists,
				if ($('.modal').length) {
				
					// Hide it, ref: http://twitter.github.com/bootstrap/javascript.html#modal
					$(form).closest('.modal').modal('hide');
				}
				
			}
			
			// If we have a target set for the result
			if (handleFormOptions.target) {
				
				// If the container exists.
				if ($(handleFormOptions.target).length) {
					$(handleFormOptions.target).replaceWidth(data); //@todo options.targetMethod
				} else {
					console.log('No target container exists');
				}
				
				
			}
			
			
			 // Show success message
			if (!$(handleFormOptions.successContainer).length) {
					
					// Create it.
      				$(form).prepend('<div class="' + handleFormOptions.successContainer.substr(1) +'"></div>');
      		}
      		
      		
			// Build our error template
			var tmpl = '<div class="alert-message block-message info">';
				tmpl += '<p>';
				tmpl += '<strong>' + handleFormOptions.successMessage + '</strong>';
				tmpl += '</p>';
				tmpl += '</div>';
						
      		// Empty any previous error messages, insert the new errors and slide it in to view.
      		$(handleFormOptions.successContainer)
      			.empty()
      			.html(tmpl)
      			.slideDown(handleFormOptions.transitionTime);
			
		
		},	
	};
  

    // 
	/************************************************
	 * Plugin defaults.
	 ***********************************************/	    
    var pluginName = 'handleForm',
        defaults = {
            
            // When should the form submit? onBlur, etc
            trigger 		: 'submit', 
            
            // slide in/out errors how fast? in ms.
            transitionTime 	: 250,
            
        	// CakePHP's model, if submitting CakePHP FormHelper code.
            cakephpModel	: '', 
            
            // What should the submit button read while request is working?
            // can overwrite with data-loading-text="Please wait.." on submit button.
            loadingText 	: 'Saving…',
            
             // Which container to place this content in? id or .classname
            target 			: false,
            
            // prepend, append, etc. What happends to the target dom?
            targetMethod	: 'replaceWith', 
            
            // If set to true, will find $.closest .modal and close it
            closeModal 		: false, 
            
             // If we're forwarding on success
            successMessage 	: 'Great success!',  
            
            // Want to send the user somewhere on successfull request?
            successUrl 		: false,
			
			// Where do you want the good news?
			successContainer: '.success-message-container', 
			
			// @todo make a snippet that shows error messages too, based $.on(successContainer).('change'…
			
			
			// What should read above the validation errors?            
            errorMessage	: 'Uh oh, something went wrong skipper:', // @todo, new name for above
            
            // Which of the .alert-message substyles to use? NO PERIOD!
            errorClass		: 'warning',
            
            // Want to send the user somewhere on failed request?
            errorUrl : false, 
            
            // set to .classname or #id. Prepends to <form> if not existing. WITH PERIOD.
            errorContainer 	: '.error-message-container', 
            
            
            /**
             * Callbacks
             * 
             * Specify as functions. Takes data as param.
             * function(data) { alert(data); }
             */ 
            
            // Specify callback for any JSON response that isn't validationErrors
            onJsonSuccess 	: false, 
            
            // Spesicy _AN ADDITIONAL_ callback to run upon completion.
            onSuccess		: false,
            
            // Spesicy _AN ADDITIONAL_ callback to run if an error occours.
            onError			: false,
            
        };


    // The actual plugin constructor
    function Plugin( form, options ) {
        this.element = form;

        // merge defaults and options.
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();

        /**
         * Let's start the form request
         */
         
        $(form).on(this.options['trigger'], function(e) {

			// Don't follow the link as per usual.
			e.preventDefault();
				
			// Let's do the AJAX thing, baby:
			var jqxhr = $.ajax({
			
				// Where are we sending this?
				url: $(form).attr('action'),
				
				// data to send
				data : $(form).serialize(),
				
				// How are we sending this?
				type: $(form).attr('method'),
				
				// Before sending the request..
				beforeSend : function(jqXHR, settings) {
					
					// Handle the submit button states
					functions.toggleButton($(form));
					
					// Hide any errorContainers:
					$(handleFormOptions.errorContainer).slideUp(handleFormOptions.transitionTime);
					
					// Hide any successContainers:
					$(handleFormOptions.successContainer).slideUp(handleFormOptions.transitionTime);

				},
				
				// If request is successful:
				success : function(data, textStatus, jqXHR) {
					
					// Handle the submit button states
					functions.toggleButton($(form));
					
					// What sort of response are we getting from the server?
					var $responseHeader = jqxhr.getResponseHeader('Content-Type');
					
					/**
					 * Handle JSON responses
					 */
					if ($responseHeader == 'application/json') {
					
						// If we're getting errors:
						if (!jQuery.isEmptyObject(data.validationErrors)) {
						
							// Handle them exclusively
							return functions.handleValidationErrors(data, $(form));	
						}
						

						// Do we have a onJsonSuccess callback function? 
 						if($.isFunction(handleFormOptions.onJsonSuccess)){
 							
 							// Sweet, let's run it:
					    	handleFormOptions.onJsonSuccess.call(this, data);
					    }						    				
					    				    
						
					/**
					 * Any other type of response
					 */
					} else {
					
						// Do we have a callback function? 
 						if($.isFunction(handleFormOptions.onSuccess)){
 							
 							// Sweet, let's run it:
					    	handleFormOptions.onSuccess.call(this, data);
					    }		
											
					}
										
					// Take care of su
					return functions.handleSuccess(data, $(form));					
					
	
					
				},
				
				// If request failed:
				error : function(jqXHR, textStatus, errorThrown) {
				
					// Do we have a callback function? 
 					if($.isFunction(handleFormOptions.onError)){
 							
 						// Sweet, let's run it:
					   	handleFormOptions.onError.call(this, data);
					}	
				
				}
				
			});
				
		
		}); // end AJAXIfy   
        
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.options
        
        
        // Make options avail. to whole script.
        // @todo Am I doing this right?
        handleFormOptions = this.options;
        
        
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
        
    }

})( jQuery, window, document );