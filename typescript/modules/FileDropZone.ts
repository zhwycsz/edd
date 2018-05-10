import * as jQuery from "jquery"
import { Utl } from "./Utl"

export module FileDropZone {

    /**
     * Common handling code for Dropzone events in both the Overview and Lines (aka Experiment
     * Description) pages.
     */
    export class FileDropZoneHelpers {

        private pageRedirect: string;
        private actionPanelIsCopied: boolean;

        constructor(options?: any) {
            options = options || {};
            this.pageRedirect = options.pageRedirect || '';
            this.actionPanelIsCopied = false;
        }

        // This is called upon receiving a response from a file upload operation, and unlike
        // fileRead(), is passed a processed result from the server as a second argument,
        // rather than the raw contents of the file.
        fileReturnedFromServer(fileContainer, result): void {
            let base = Utl.relativeURL('../');
            let redirect = Utl.relativeURL(this.pageRedirect, base);
            let message = JSON.parse(result.xhr.response);
            $('<p>', {
                text: ['Success!', message['lines_created'], 'lines added!'].join(' '),
                style: 'margin:auto'
            }).appendTo('#linesAdded');
            $('#linesAdded').removeClass('off');
            this.successfulRedirect(redirect.pathname)
        }

        fileWarningReturnedFromServer(fileContainer, result): void {
            let newWarningAlert = $('.alert-warning').eq(0).clone();
            let base = Utl.relativeURL('../');
            let redirect = Utl.relativeURL(this.pageRedirect, base);

            this.copyActionButtons();

            $('#acceptWarnings').find('.acceptWarnings')
                .on('click', (ev:JQueryMouseEventObject): boolean => {
                    this.successfulRedirect(redirect.pathname);
                    return false;
                });

            $('<p>', {
                text: 'Success! ' + result['lines_created'] + ' lines added!',
                style: 'margin:auto'
            }).appendTo('#linesAdded');
            // display success message
            $('#linesAdded').removeClass('off');
            this.generateMessages('warnings', result.warnings);
            this.generateAcceptWarning();
        }

        private successfulRedirect(linesPathName): void {
            //redirect to lines page
            setTimeout(function () {
                window.location.pathname = linesPathName;
            }, 1000);
        };

        private copyActionButtons(): void {
            let original:JQuery, copy:JQuery, originalDismiss:JQuery, copyDismiss:JQuery,
                originalAcceptWarnings:JQuery, copyAcceptWarnings:JQuery;
            if (!this.actionPanelIsCopied) {
                original = $('#actionWarningBar');
                copy = original.clone().appendTo('#bottomBar').hide();
                // forward click events on copy to the original button
                copy.on('click', 'button', (e) => {
                    original.find('#' + e.target.id).trigger(e);
                });
                originalDismiss = $('#dismissAll').find('.dismissAll');
                copyDismiss = originalDismiss.clone().appendTo('#bottomBar').hide();
                // forward click events on copy to the original button
                copyDismiss.on('click', 'button', (e) => {
                    originalDismiss.trigger(e);
                });
                originalAcceptWarnings = $('#acceptWarnings').find('.acceptWarnings');
                copyAcceptWarnings = originalAcceptWarnings.clone().appendTo('#bottomBar').hide();
                // forward click events on copy to the original button
                copyAcceptWarnings.on('click', 'button', (e) => {
                    originalAcceptWarnings.trigger(e);
                });
                this.actionPanelIsCopied = true;
            }
        };

        // This is called upon receiving an error in a file upload operation, and
        // is passed an unprocessed result from the server as a second argument.

        fileErrorReturnedFromServer(dropZone: Utl.FileDropZone, file, msg, xhr): void {

            this.copyActionButtons();

            let parent: JQuery = $('#alert_placeholder'),
                dismissAll: JQuery = $('#dismissAll'),
                baseUrl: URL = Utl.relativeURL('../');
            // reset the drop zone here
            // parse xhr.response
            var obj, error, id, contentType;
            contentType = xhr.getResponseHeader('Content-Type');

            if (xhr.status === 504) {
                this.generate504Error();
            } else if (xhr.status === 413) {
                this.generate413Error();
            } else if(contentType === 'application/json') {
                let json = JSON.parse(xhr.response);
                if (json.errors) {
                    if (json.errors[0].category.indexOf('ICE') > -1) {
                        // first remove all files in upload
                        dropZone.dropzone.removeAllFiles();
                        file.status = undefined;
                        file.accepted = undefined;
                        // create alert notification
                        this.processICEerror(json.errors);

                        // click handler for omit strains
                        $('#alert_placeholder').find('.omitStrains').on('click', (ev): void => {
                            var parsedUrl: URL = new URL(
                                dropZone.dropzone.options.url,
                                window.location.toString()
                            );
                            $(ev.target).parent().remove();
                            parsedUrl.searchParams.append('IGNORE_ICE_ACCESS_ERRORS', 'true');
                            dropZone.dropzone.options.url = parsedUrl.toString();
                            dropZone.dropzone.addFile(file);
                        });
                    } else {
                        this.generateMessages('error', json.errors)
                    }
                }

                // Note: there may be warnings in addition to errors displayed above
                if (json.warnings) {
                    this.generateMessages('warnings', json.warnings)
                }
            } else {
                //if there is a back end or proxy error (likely html response), show this
                let defaultError = {
                    category: "",
                    summary: "There was an error",
                    details: "Please try again later or contact support."
                };
                this.alertError(defaultError);
            }

            // remove the unhelpful DZ default err message ("object")
            $('.dz-error-message').text('File errors (see above)');

            dismissAll.toggleClass('off', ($('.alert').length <= 2));

            //set up click handler events
            parent.find('.omitStrains').on('click', (ev:JQueryMouseEventObject): boolean => {
                ev.preventDefault();
                ev.stopPropagation();
                $('#iceError').hide();
                return false;
            });

            parent.find('.allowDuplicates').on('click', (ev:JQueryMouseEventObject): boolean => {
                let f = file.file,
                    targetUrl = new URL('describe', baseUrl.toString());
                ev.preventDefault();
                ev.stopPropagation();
                targetUrl.searchParams.append('ALLOW_DUPLICATE_NAMES', 'true');
                f.sendTo(targetUrl.toString());
                $('#duplicateError').hide();
                return false;
            });

            $('.noDuplicates, .noOmitStrains').on('click', (ev:JQueryMouseEventObject): boolean => {
                ev.preventDefault();
                ev.stopPropagation();
                window.location.reload();
                return false;
            });
            //dismiss all alerts
            dismissAll.on('click', '.dismissAll', (ev:JQueryMouseEventObject): boolean => {
                ev.preventDefault();
                ev.stopPropagation();
                parent.find('.close').click();
                window.location.reload();
                return false;
            });

            $('#acceptWarnings').find('.acceptWarnings').on('click', (ev): boolean => {
                let redirect = Utl.relativeURL('experiment-description/', baseUrl);
                ev.preventDefault();
                ev.stopPropagation();
                this.successfulRedirect(redirect.pathname);
                return false;
            });
        }

        private generateMessages(type, response) {
            var responseMessages = this.organizeMessages(response);
            for (var key in responseMessages) {
                let div;
                if (type === 'error') {
                    div = $('.alert-danger').eq(0).clone();
                } else {
                    div = $('.alert-warning').eq(0).clone();
                }
                this.alertMessage(key, responseMessages[key], div, type)
            }
        };

        private processICEerror(responses): void {
            $('.noDuplicates, .noOmitStrains').on('click', (ev): boolean => {
                ev.preventDefault();
                ev.stopPropagation();
                window.location.reload();
                return false;
            });
            for (var response of responses) {
                // create dismissible error alert
                this.alertIceWarning(response);
            }
        };


        private generateAcceptWarning(): void {
            var warningAlerts:JQuery, acceptWarningDiv:JQuery;
            warningAlerts = $('.alert-warning:visible');
            acceptWarningDiv = $('#acceptWarnings').find('.acceptWarnings');
            if (warningAlerts.length === 1) {
                $(warningAlerts).append(acceptWarningDiv)
            } else {
                $('#alert_placeholder').prepend(acceptWarningDiv)
            }
            acceptWarningDiv.show();
        };

        private organizeMessages(responses) {
            var obj = {};
            for (var response of responses) {
                var message = response.summary + ": " + response.details;

                if (obj.hasOwnProperty(response.category)) {
                    obj[response.category].push(message);
                } else {
                    obj[response.category] = [message]
                }
            };
            return obj;
        };

        private generate504Error(): void {
            let response = {
                category: "",
                summary: "EDD timed out",
                details: "Please reload page and re-upload file"
            };
            this.alertError(response);
        };

        private generate413Error(): void {
            let response = {
                category: "",
                summary: "File too large",
                details: "Please contact system administrators or break your file into parts."
            };
            this.alertError(response)
        }

        private alertIceWarning(response): void {
            let iceError = $('#iceError');
            response.category = "Warning! " + response.category;
            this.createAlertMessage(iceError, response);
        };

        private alertError(response): void {
            var newErrorAlert = $('.alert-danger').eq(0).clone();
            this.createAlertMessage(newErrorAlert, response);
            this.clearDropZone();
        };

        private createAlertMessage(alertClone, response) {
            $(alertClone).children('h4').text(response.category);
            $(alertClone).children('p').text(response.summary + ": " + response.details);
            $('#alert_placeholder').append(alertClone);
            $(alertClone).removeClass('off').show();
        };


        private alertMessage(subject, messages, newAlert, type): void {
            if (type === "warnings") {
                $(newAlert).children('h4').text("Warning! " + subject);
            } else {
                $(newAlert).children('h4').text("Error! " + subject);
                this.clearDropZone();
            }
            for (let m in messages) {
                var summary = $('<p>', {
                    text: messages[m],
                    class: 'alertWarning',
                });
                $(newAlert).append(summary)
            };
            $('#alert_placeholder').append(newAlert);
            $(newAlert).removeClass('off').show();
        };

        private clearDropZone(): void {
            $('#experimentDescDropZone').removeClass('off');
            $('#fileDropInfoIcon').addClass('off');
            $('#fileDropInfoName').addClass('off');
            $('#fileDropInfoSending').addClass('off');
            $(".linesDropZone").addClass('off');
        }
    }
}
