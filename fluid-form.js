function FluidForm(wrapper, callback) {
	var self = this;

	if (typeof wrapper === 'undefined') throw new Error("No reference to a wrapper element passed.");
	if (typeof callback === 'undefined') callback = function() {};

	this.wrapper = wrapper;
	this.callback = callback;
	this.questions = this.wrapper.find('.fluid-form-question');
	this.inputFields = this.wrapper.find(FluidForm.inputFieldsSelector);
	this.requiredInputFields = this.inputFields.filter('[required="required"]');

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
		e.preventDefault();
		e.stopPropagation();
		self.submit(); 
	});

	this.questions.on('click', function() {
		var index = self.questions.index(this);
		if (index === -1) return;

		self.scrollToIndex(index);
	});

	this.setQuestionIndex(0);

	$(window).on('scroll', function() { self.handleScrolling(); }).trigger('scroll');
}

FluidForm.scrollOffsetTop = 70;
FluidForm.scrollPaddingTop = 50;

FluidForm.inputFieldsSelector = 'input[type=text], input[type=mail], input[type=number], textarea';

FluidForm.prototype.activeIndex = 0;
FluidForm.prototype.wrapper = null;
FluidForm.prototype.questions = [];

FluidForm.prototype.nextQuestion = function() {
	// check if all required fields are filled
	var invalidFieldFound = false;
	var inputFields = this.questions.eq(this.activeIndex).find(FluidForm.inputFieldsSelector);
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
			this.requiredInputFields.eq(i).focus();
			return;
		}
	}

	this.callback();
};

FluidForm.prototype.handleScrolling = function() {
	var scrollTop = $(window).scrollTop();
	for (var i = 0; i < this.questions.length; i++) {
		if (this.questions.eq(i).offset().top - scrollTop - FluidForm.scrollOffsetTop >= 0) {
			if (this.activeIndex !== i) {
				this.setQuestionIndex(i);
			}
			break;
		}
	}
};

FluidForm.prototype.scrollToIndex = function(index) {
	$('html, body').animate({ scrollTop: this.questions.eq(index).offset().top - FluidForm.scrollOffsetTop - FluidForm.scrollPaddingTop }, 1000);
};