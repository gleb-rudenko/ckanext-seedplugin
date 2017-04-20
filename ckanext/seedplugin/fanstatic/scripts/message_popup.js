// Enable JavaScript's strict mode. Strict mode catches some common
// programming errors and throws exceptions, prevents some unsafe actions from
// being taken, and disables some confusing and bad JavaScript features.
"use strict";

ckan.module('message_popup', function ($, _) {
  return {
    initialize: function () {
      $.proxyAll(this, /_on/);
      this.el.modal({title: "Test", remote:true, show:false});
      this.el.on('click', this._onClick);

    },

    _snippetReceived: false,

    _onClick: function(event) {
        if (!this._snippetReceived) {
            this.sandbox.client.getTemplate('message_popup.html',
                                            this.options,
                                            this._onReceiveSnippet);
            this._snippetReceived = true;
        }

    },

    _onReceiveSnippet: function(html) {
      this.el.modal('destroy');
      this.el.modal({title: "Test", remote:true, show:false});
      this.el.modal('show');

    },

  };
});
