angular.module('PaperUI.services.logging', []).config(function($provide) {
    var consoleAvailable = (console && console.error && console.warn);
    if (!Array.prototype.map) {
        if (consoleAvailable) {
            console.error('Missing map fn! Install polyfill or use newer browser.');
        }
        return;
    }
    if (!ErrorStackParser) {
        if (consoleAvailable) {
            console.error('Missing stacktrace.js!');
        }
        return;
    }

    return $.ajax('/rest/log/levels', {
        async : false
    }).done(function(levels) {
        console.log(levels); // TODO
        $provide.decorator('$log', function($delegate, backendLogger) {
            return backendLogger($delegate);
        });
    }).fail(function() {
        if (consoleAvailable) {
            console.warn('Could not get loglevels from backend. Maybe the REST Logging bundle is not loaded or activated.');
        }
    });

}).factory('backendLogger', function($window) {
    var slice = [].slice;

    return function backendLogger($delegate) {

        function myLog(severity) {
            var argsToLog = slice.call(arguments, 0);
            // Call the original $log function:
            $delegate[severity].apply(null, argsToLog);
            // Send also to backend:
            logToBackend.apply(null, argsToLog);
        }

        return {
            log : myLog.bind(null, 'info'), // Map log to info severity
            info : myLog.bind(null, 'info'),
            error : myLog.bind(null, 'error'),
            warn : myLog.bind(null, 'warn'),
            debug : myLog.bind(null, 'debug')
        }

        function logToBackend(severity) {
            try {
                var args = slice.call(arguments, 1);
                var parsedArgs = args.map(function(arg) {
                    if (arg instanceof Error) {
                        return ErrorStackParser.parse(arg).toString();
                    }
                    return arg;
                });
                // var errorMessage = parsedArgs.toString();
                // var stackTrace = stacktraceService.parse(exception).toString();
                $.ajax({
                    type : "POST",
                    url : "/rest/log",
                    contentType : "application/json",
                    data : angular.toJson({
                        severity : severity,
                        url : $window.location.toString(),
                        message : parsedArgs.toString(),
                    // stackTrace : stackTrace,
                    // cause : (cause || "")
                    })
                });
            } catch (loggingError) {
                $delegate.warn("Error sending log to backend");
                $delegate.log(loggingError);
            }
        }

    }
});

/*
 * .provider("$exceptionHandler", { $get : function(errorLogService) { return (errorLogService); } })
 */