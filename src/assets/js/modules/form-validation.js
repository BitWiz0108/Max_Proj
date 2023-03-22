$('.js-validation').each((index, form) => {
	let $formHolder = $(form);
	let $form = $formHolder.find('form');
	let $fields = $formHolder.find('.js-validate-field');

	$fields.on('focusout', (e) => {
		let $this = $(e.currentTarget);
		validate($this) 
	})

	function validateEmail(email) {
		var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	let validate = (thisHolder) => {
		let $this = thisHolder;
		let $thisField = $this.find('input');
		let fieldText = $thisField.val();
		let fieldType = $thisField.attr('type');
		let fieldFirstPassVal = $formHolder.find('.js-pass').val();
		
		if ( fieldType == undefined && $this.find('select') ) { //if is Select 
	    	fieldType = 'select';
	    	$thisField = $this.find('select');
	    	fieldText = $thisField.val();
		}

	  	if ( fieldType == "email" && validateEmail(fieldText) ) {
	    	thisHolder.removeClass('validate--error');
	  	}else if ( ( fieldType == "text" || fieldType == "number" || fieldType == "password" || fieldType == "tel" ) && fieldText != "" && !$thisField.hasClass('js-re-pass') ){
	    	thisHolder.removeClass('validate--error');
	    	if ( $formHolder.find('.js-re-pass').length ) {
	    		$formHolder.find('.js-re-pass').trigger("focusout");
	    	}
	  	}else if ( ( fieldType == "password" && $thisField.hasClass('js-re-pass') ) && (fieldText === fieldFirstPassVal && fieldText != "") ){
	    	thisHolder.removeClass('validate--error');
		}else if ( fieldType == "select" && fieldText != "placeholder" ){
	    	thisHolder.removeClass('validate--error');
		}else {
	    	thisHolder.addClass('validate--error');
	  	}
	}

	$form.on('submit', (e) => {
		$fields.trigger("focusout")

		if ($formHolder.find(".validate--error").length > 0) {
			e.preventDefault();
		}
	})
})