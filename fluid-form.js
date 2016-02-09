function FluidForm(wrapper, callback) {
	var self = this;

	if (typeof wrapper === 'undefined') throw new Error("No reference to a wrapper element passed.");
	if (typeof callback !== 'function') throw new Error("No submit callback function passed.");

	this.wrapper = wrapper;
	this.callback = callback;
	this.questions = this.wrapper.find('.fluid-form-question');
	this.inputFields = this.wrapper.find(FluidForm.inputFieldsSelector);
	this.requiredInputFields = this.inputFields.filter(FluidForm.requiredSelector);

	if (this.questions.length === 0) throw new Error("Wrapper element doesn't contain any child elements.");

	// next question events
	this.wrapper.find('.fluid-form-next-button').on('click', function(e) { 
		e.stopPropagation();
		// button click
		self.nextQuestion(); 
	});

	this.questions.find('.fluid-form-detect-enter-key').on('keyup change', function(e) {
		// enter key
		if (e.keyCode === 13) { // enter
			self.nextQuestion();
		}
	});

	this.questions.find(FluidForm.inputFieldsSelector).on('keyup change', function() {
		if ($(this).val()) {
			$(this).removeClass('missing');
		}
	});

	this.wrapper.find('.fluid-form-submit-button').on('click', function(e) { 
		self.submit(); 
	});

	this.questions.on('click', function() {
		var index = self.questions.index(this);
		if (index === -1 || self.activeIndex === index) return;

        // not working for questions which are higher than the screen size
		//self.scrollToIndex(index);
	});

	this.setQuestionIndex(0);

	$(window).on('scroll resize', function() { self.handleScrolling(); }).trigger('scroll');
}

FluidForm.scrollOffsetTop = 70;
FluidForm.scrollOffsetBottom = 70;
FluidForm.scrollPaddingTop = 50;

FluidForm.inputFieldsSelector = 'input[type=text], input[type=mail], input[type=number], textarea';
FluidForm.requiredSelector = '[required="required"]';

FluidForm.prototype.activeIndex = 0;
FluidForm.prototype.wrapper = null;
FluidForm.prototype.questions = [];

FluidForm.prototype.nextQuestion = function() {
    // check if all required fields are filled
	var invalidFieldFound = false;
	var inputFields = this.questions.eq(this.activeIndex).find(FluidForm.inputFieldsSelector).filter(FluidForm.requiredSelector);
	for (var i = 0; i < inputFields.length; i++) {
		if (!inputFields.eq(i).val()) {
			invalidFieldFound = true;
			inputFields.eq(i).addClass('missing');
		}
	}
	if (invalidFieldFound) return;

	// next question available
	if (this.questions.length - 1 > this.activeIndex) {
		this.scrollToIndex(this.activeIndex + 1);
	}
	else {
		throw new Error("No next question available. Use class .fluid-form-submit-button for the last button.");
	}
};

FluidForm.prototype.setQuestionIndex = function(index) {
	this.activeIndex = index;
	this.questions.removeClass('active');

	var newQuestion = this.questions.eq(index);
	newQuestion.addClass('active');
	newQuestion.find('.fluid-form-autofocus').eq(0).focus();
};

FluidForm.prototype.submit = function() {
	for (var i = 0; i < this.requiredInputFields.length; i++) {
		if (!this.requiredInputFields.eq(i).val()) {
			this.requiredInputFields.eq(i).focus().addClass('missing');
			return;
		}
	}

	this.callback();
};

FluidForm.prototype.handleScrolling = function() {
	var scrollTop = $(window).scrollTop(), screenHeight = $(window).height();
	for (var i = 0; i < this.questions.length; i++) {
        var screenMid = scrollTop + screenHeight / 2, 
            questionTop = this.questions.eq(i).offset().top, 
            questionBottom = questionTop + this.questions.eq(i).height();
        
        if (questionTop < screenMid && questionBottom > screenMid) {
			if (this.activeIndex !== i) {
				this.setQuestionIndex(i);
			}
			break;
		}
	}
};

FluidForm.prototype.scrollToIndex = function(index) {
	$('html, body').animate({ scrollTop: this.questions.eq(index).offset().top + FluidForm.scrollOffsetTop - $(window).height() / 2 }, 1000);
};

FluidForm.prototype.scrollToId = function(id) {
	$('html, body').animate({ scrollTop: $('#' + id).offset().top - FluidForm.scrollOffsetTop - FluidForm.scrollPaddingTop }, 1000);
};