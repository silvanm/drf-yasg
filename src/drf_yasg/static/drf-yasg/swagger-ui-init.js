"use strict";
var currentPath = window.location.protocol + "//" + window.location.host + window.location.pathname;
var specURL = currentPath + '?format=openapi';

function patchSwaggerUi() {
    var authWrapper = document.querySelector('.auth-wrapper');
    var authorizeButton = document.querySelector('.auth-wrapper .authorize');
    var djangoSessionAuth = document.querySelector('#django-session-auth');
    if (document.querySelector('.auth-wrapper #django-session-auth')) {
        console.log("session auth already patched");
        return;
    }

    authWrapper.insertBefore(djangoSessionAuth, authorizeButton);
    djangoSessionAuth.classList.remove("hidden");

    var divider = document.createElement("div");
    divider.classList.add("divider");
    authWrapper.insertBefore(divider, authorizeButton);
}

function initSwaggerUi() {
    var swaggerConfig = {
        url: specURL,
        dom_id: '#swagger-ui',
        displayOperationId: true,
        displayRequestDuration: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        filter: true,
        requestInterceptor: function(request) {
            var headers = request.headers || {};
            var csrftoken = document.querySelector("[name=csrfmiddlewaretoken]");
            if (csrftoken) {
                headers["X-CSRFToken"] = csrftoken.value;
            }
            return request;
        }
    };

    var swaggerSettings = JSON.parse(document.getElementById('swagger-settings').innerHTML);

    console.log(swaggerSettings);
    for (var p in swaggerSettings) {
        if (swaggerSettings.hasOwnProperty(p)) {
            swaggerConfig[p] = swaggerSettings[p];
        }
    }
    window.ui = SwaggerUIBundle(swaggerConfig);
}

window.onload = function () {
    insertionQ('.auth-wrapper .authorize').every(patchSwaggerUi);
    initSwaggerUi();
};
