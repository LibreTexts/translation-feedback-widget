//
// LibreTexts Translation Feedback Widget
// index.js (entry point)
//

/* Semantic UI Scripts */
import "./semantic-ui/components/modal.min.js";
import "./semantic-ui/components/transition.min.js";
import "./semantic-ui/components/dimmer.min.js";
import "./semantic-ui/components/visibility.min.js";
import "./semantic-ui/components/checkbox.min.js";

/* Semantic UI Styles */
import "./semantic-ui/components/icon.min.css";
import "./semantic-ui/components/button.min.css";
import "./semantic-ui/components/modal.min.css";
import "./semantic-ui/components/form.min.css";
import "./semantic-ui/components/input.min.css";
import "./semantic-ui/components/transition.min.css";
import "./semantic-ui/components/dimmer.min.css";
import "./semantic-ui/components/menu.min.css";
import "./semantic-ui/components/checkbox.min.css";
import "./semantic-ui/components/divider.min.css";
import "./semantic-ui/components/header.min.css";
import "./semantic-ui/components/label.min.css";
import "./semantic-ui/components/table.min.css";

/* AJAX Library */
const axios = require('axios').default;

/* Helper Functions */
import { isEmptyString } from "./helpers.js";

/* HTML & CSS for bundle */
import "./index.css";
import html from "./index.html";


/**
 * This anonymous function is run on script load and
 * registers the window.libreTranslationFeedback namespace
 * and relevant functions.
 */
(function() {

    /**
     * Verifies that jQuery is available on the page.
     */
    function ensureJquery(readyCallback) {
        if (window.jQuery === undefined || parseFloat(window.jQuery.fn.jquery) < 2.2) {
            console.error("libreTranslationFeedback requires jQuery.");
        } else {
            readyCallback(window.jQuery);
        }
    }

    /**
     * Closes all Translation Feedback modals, resets the form,
     * and removes the Translation Feedback widget from the DOM.
     */
    function closeModal(jQuery) {
        resetFormErrors(jQuery);
        jQuery("#libreTranslationFeedbackModal").modal('hide');
        jQuery("#libreTF-success-modal").modal('hide');
        jQuery("#libreTF-error-modal").modal('hide');
        jQuery("#libreTranslationFeedbackModal").remove();
        jQuery("#libreTF-success-modal").remove();
        jQuery("#libreTF-error-modal").remove();
    }

    /**
     * Opens the main Translation Feedback modal.
     */
    function openModal(jQuery) {
        jQuery("#libreTranslationFeedbackModal").modal({
            closable: false,
            blurring: true
        }).modal('setting', 'duration', 300).modal('show');
    }

    /**
     * Opens the Translation Feedback Success modal.
     */
    function openSuccessModal(jQuery) {
        jQuery("#libreTF-success-modal").modal({
            closable: false,
            blurring: true
        }).modal('setting', 'duration', 300).modal('show');
    }

    /**
     * Opens the Translation Feedback Error modal.
     */
    function openErrorModal(jQuery, err) {
        jQuery("#libreTF-error-modal").modal({
            closable: false,
            blurring: true
        }).modal('setting', 'duration', 300).modal('show');
        jQuery("#libreTF-error-msg").text(err);
    }

    /**
     * Closes the Translation Feedback Error modal
     * and (re-)opens the main Adoption Report modal.
     */
    function closeErrorModal(jQuery) {
        jQuery("#libreTF-error-modal").modal('hide');
        jQuery("#libreTranslationFeedbackModal").modal('show');
    }

    /**
     * Shows/hides the relevant fields on change
     * to the "All terms were translated correctly" question.
     */
    function translationQualityChangeHandler() {
        let termsOk = window.jQuery('#libreTF-translation-quality').checkbox('is checked');
        if (!termsOk) {
            jQuery("#libreTF-term-feedback").show();
        } else {
            jQuery("#libreTF-term-feedback").hide();
        }
    }

    /**
     * Logs an error to the console and
     * activates the Translation Feedback Error modal
     * with the relevant message.
     */
    function handleErr(jQuery, err) {
        console.error(err);
        var message = "";
        if (err.response) {
            if (err.response.data.errMsg !== undefined) {
                message = err.response.data.errMsg;
            } else {
                message = "Error processing request.";
            }
            if (err.response.data.errors) {
                if (err.response.data.errors.length > 0) {
                    message = message.replace(/\./g, ': ');
                    err.response.data.errors.forEach((elem, idx) => {
                        if (elem.param) {
                            message += (String(elem.param).charAt(0).toUpperCase() + String(elem.param).slice(1));
                            if ((idx + 1) !== err.response.data.errors.length) {
                                message += ", ";
                            } else {
                                message += ".";
                            }
                        }
                    });
                }
            }
        } else if (err.name && err.message) {
            message = err.message;
        } else if (typeof(err) === 'string') {
            message = err;
        } else {
            message = err.toString();
        }
        openErrorModal(jQuery, message);
    }

    /**
     * Resets the form back to its original state
     * following the activation of error states.
     */
    function resetFormErrors(jQuery) {
        jQuery("#libreTF-language-field").removeClass('error');
    }

    /**
     * Validate the form data, return
     * 'false' if validation errors exists,
     * 'true' otherwise
     */
    function validateForm(jQuery) {
        var validForm = true;
        if (isEmptyString(jQuery("#libreTF-language-input").val())) {
            jQuery("#libreTF-language-field").addClass('error');
            validForm = false;
        }
        return validForm;
    }

    /**
     * Submits data via POST to the server, then
     * activates the Translation Feedback Success or
     * Error modals.
     */
    function submitFeedback(jQuery) {
        jQuery("#libreTF-submit-btn").addClass('loading');
        resetFormErrors(jQuery);
        if (validateForm(jQuery)) {
            let formData = {
                language: jQuery("#libreTF-language-input").val(),
                accurate: jQuery('#libreTF-translation-quality').checkbox('is checked'),
                page: window.location.href,
                feedback: []
            };
            if (formData.accurate === false) {
                var numFields = 4;
                for (let i = 0; i < numFields; i++) {
                    if (!isEmptyString(jQuery(`#libreTF-incorrect-term-${i+1}`).val())) {
                        if (!isEmptyString(jQuery(`#libreTF-incorrect-term-${i+1}`).val())) {
                            formData.feedback.push({
                                incorrect: jQuery(`#libreTF-incorrect-term-${i+1}`).val(),
                                corrected: jQuery(`#libreTF-corrected-term-${i+1}`).val()
                            });
                        } else {
                            formData.feedback.push({
                                incorrect: jQuery(`#libreTF-incorrect-term-${i+1}`).val(),
                                corrected: ''
                            });
                        }
                    }
                }
            }
            axios.post("https://commons.libretexts.org/api/v1/translationfeedback", formData, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            }).then(function(res) {
                if (!res.data.err) {
                    openSuccessModal(jQuery);
                } else {
                    var msg;
                    if (res.data.errMsg) {
                        msg = res.data.errMsg;
                    } else {
                        msg = "Sorry, we're having trouble completing your request.";
                    }
                    handleErr(jQuery, msg);
                }
            }).catch(function(err) {
                handleErr(jQuery, err);
            });
        }
        jQuery("#libreTF-submit-btn").removeClass('loading');
    }

    /**
     * Attaches the Translation Feedback Modal(s) to the DOM
     * and initializes interactive form components
     * from Semantic UI.
     */
    function libreTranslationFeedback(jQuery) {
        if (jQuery("#libreTranslationFeedbackModal").length == 0) { // attach Modal to DOM
            jQuery("body").append(html);
            jQuery("#libreTF-translation-quality").checkbox({
                onChange: translationQualityChangeHandler
            });
            jQuery("#libreTF-cancel-btn").click(function() {
                closeModal(jQuery);
            });
            jQuery("#libreTF-submit-btn").click(function() {
                submitFeedback(jQuery);
            });
            jQuery("#libreTF-success-done-btn").click(function() {
                closeModal(jQuery);
            });
            jQuery("#libreTF-err-done-btn").click(function() {
                closeErrorModal(jQuery);
            })
            openModal(jQuery);
        } else { // Modal is already attached to DOM
            openModal(jQuery);
        }
    }

    /**
     * Initialize the Translation Feedback Widget by
     * calling ensureJquery() with the internal init
     * function as a success callback.
     */
    function init() {
        ensureJquery(libreTranslationFeedback);
    }

    window.libreTranslationFeedback = {
        init: init
    }
})();
