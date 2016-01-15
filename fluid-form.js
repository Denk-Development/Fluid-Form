function FluidForm(wrapper) {
	var self = this;

	if (typeof wrapper === 'undefined') throw new Error("No reference to a wrapper element passed.");

	this.wrapper = wrapper;
	this.questions = this.wrapper.children();

	if (this.questions.length === 0) throw new Error("Wrapper element doesn't contain any child elements.");

	this.wrapper.find('.fluid-form-next-button').on('click', function() { self.nextQuestion(); });
	this.wrapper.find('.fluid-form-submit-button').on('click', function() { self.submit(); });

	this.setQuestionIndex(0);

	$(window).on('scroll', function() { self.handleScrolling(); });
}

FluidForm.prototype.activeIndex = 0;
FluidForm.prototype.wrapper = null;
FluidForm.prototype.questions = [];

FluidForm.prototype.nextQuestion = function() {
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
	this.questions.eq(index).addClass('active');
};

FluidForm.prototype.submit = function() {

};

FluidForm.prototype.handleScrolling = function() {
	var scrollTop = $(window).scrollTop();
	for (var i = 0; i < this.questions.length; i++) {
		if (this.questions.eq(i).offset().top - scrollTop >= 0) {
			if (this.activeIndex !== i) {
				this.setQuestionIndex(i);
			}
			break;
		}
	}
};

FluidForm.prototype.scrollToIndex = function(index) {
	$('html, body').animate({ scrollTop: this.questions.eq(index).offset().top }, 1000);
};