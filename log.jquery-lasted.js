/**
 * jQuery LogEvent plugin
 *
 * @desc Catch dedicated datas and log it as soon as possible by sending ajax call with these informations
 * @author Hervé GOUCHET
 * @use jQuery 1.4.3+
 * @licenses Creative Commons BY-SA 2.0
 * @see https://github.com/rvflash/jQuery-LogEvent
 */
;
var Log =
{
    _available: true,
    _data: [],
    _fail: 0,
    defaults : {
        type: 'POST',
        url: '',
        interval: 1000,
        maxFail: 3
    },
    add: function (data)
    {
        this._data.push(data);
    },
    listen: function()
    {
        window.onbeforeunload = function()
        {
            Log._notify(true);
        };
        window.setInterval(function()
        {
            Log._notify(false);
        },
            Log.defaults.interval
        );
    },
    _notify: function(force)
    {
        if (
            'undefined' != typeof jQuery && '' != this.defaults.url && this._available && 0 < this._data.length &&
            (force || this._fail < this.defaults.maxFail)
        ) {
            var data = this._data;
            this._data = [];
            this._available = false;

            jQuery.ajax(
            {
               url: this.defaults.url,
               type: this.defaults.type,
               data: { d: data}
            }).fail(function()
            {
                jQuery.merge(Log._data, data);
                Log._fail ++;
            }).always(function()
            {
                Log._available = true;
            });
        }
    }
};

(function($)
{
    // Define log behavior and start listening
    $.log = function(settings)
    {
        $.extend(true, Log.defaults, settings);
        Log.listen();
    };

    // Add element to logger
    $.logIt = function(elem, data)
    {
        if ('undefined' == typeof data) {
            data = {};
        }
        Log.add($.extend(true, {}, data, $(elem).data()));
    };
})(jQuery);
