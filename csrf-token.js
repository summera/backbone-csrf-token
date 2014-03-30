/*global define*/

define([
    'backbone'
], function (Backbone) {
    'use strict';

    var CsrfTokenModel = Backbone.Model.extend({
        defaults: {
            csrfEndpoint: null
        },

        getTokenFromCookie: function(){
            // OVERRIDE SYNC METHOD FOR CSRF TOKEN
    
            // Alias away the sync method 
            Backbone._sync = Backbone.sync;

            /* define a new sync method */
            Backbone.sync = function(method, model, options) {

                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
              
                /* only need a token for non-get requests */
                if (method == 'create' || method == 'update' || method == 'delete') {
                    var csrfToken = getCookie('csrftoken');

                    options.beforeSend = function(xhr){
                        xhr.setRequestHeader('X-CSRFToken', csrfToken);
                    };
                }

                /* proxy the call to the old sync method */
                return Backbone._sync(method, model, options);
            };
        },

        //TODO: add functionality for receiving token from endpoint
        getTokenFromEndpoint: function(){

        }
    });

    return CsrfTokenModel;
});
