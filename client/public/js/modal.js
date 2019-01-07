define(['knockout'], function (ko) {
    return new function Modal() {
        ko.bindingHandlers.modal = {
            init: function (element, valueAccessor) {
                $(element).modal({
                    show: false
                });

                var value = valueAccessor();
                if (typeof value === 'function') {
                    $(element).on('hide.bs.modal', function () {
                        value(false);
                    });
                }
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).modal("destroy");
                });

            },
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                if (ko.utils.unwrapObservable(value)) {
                    $(element).modal('show');
                } else {
                    $(element).modal('hide');
                }
            }
        };

        
            var self = this;
            this.showDialog = ko.observable(false);

            this.submit = function () {
                self.showDialog(false);
            }
        
    }();
});