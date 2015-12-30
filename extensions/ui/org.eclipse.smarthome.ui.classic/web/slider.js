'use strict';

(function ClassicUISlider(document, WA) {

	var CMD_SERVLET = 'CMD';
    var initDebounceTimeout;

	function Slider(item) {
		var _style = document.defaultView.getComputedStyle(item, null);

		this.el = item;
		this.opt = item.parentNode;
		this.progress = item.querySelector('.iSliderProgress');
		this.handle = item.querySelector('.iSlider');
		this.valueEl = this.opt.parentNode.querySelector('.iValue');
		this.max = 100;
		this.min = 0;
		this.dragState = undefined;
		this.interval = undefined;
		this.computedOffset = parseInt(_style
				.getPropertyValue('border-top-left-radius'), 10)
				* 2
				+ parseInt(_style.getPropertyValue('border-top-width'), 10)
				* 2;

        // Set marker to not re-initialize the slider
		this.el.setAttribute('data-slider', 'true');

		// Read data-attributes
        var idx, templateAttrs = ['state', 'item', 'freq', 'switch'];
        for(idx=0; idx<templateAttrs.length; idx++) {
            var attrName = templateAttrs[idx];
            this[attrName] = this.el.getAttribute('data-'+attrName) || '';
        }

		this.state = this.state == 'Uninitialized' ? 0 : this.state;
		this.oldState = this.state;

		// Display value specified in data-attribute
		this.displayValue(this.state);

        this.dragHandler = this.drag.bind(this);
        this.startDragHandler = this.startDrag.bind(this);
        this.stopDragHandler = this.stopDrag.bind(this);

		this.opt.addEventListener('touchstart', this.startDragHandler);
		this.opt.addEventListener('mousedown', this.startDragHandler);

		this.opt.addEventListener('mouseup', this.stopDragHandler);
		this.opt.addEventListener('mouseleave', this.stopDragHandler);

		this.opt.addEventListener('touchend', this.stopDragHandler);
		this.opt.addEventListener('touchcancel', this.stopDragHandler);
		this.opt.addEventListener('touchleave', this.stopDragHandler);
	}

	Slider.prototype.getPosition = function(event) {
		if (-1 === event.type.indexOf('touch')) {
			return event.clientX - this.el.offsetLeft - this.computedOffset;
		} else {
			return event.touches[0].clientX - this.el.offsetLeft
					- this.computedOffset;
		}
	};

    Slider.prototype.startDrag = function(event) {
        var width = this.el.offsetWidth;
        var pos = this.getPosition(event);
        var val = this.getValue(pos / width);

        this.dragState = true;
        this.displayValue(val);

        handleSliderEvent({
            item : this.item,
            value : this.state,
            type : 'start'
        });

        this.interval = setInterval(this.sendValue.bind(this), this.freq);

        this.opt.addEventListener('touchmove', this.dragHandler);
        this.opt.addEventListener('mousemove', this.dragHandler);
    };

    Slider.prototype.stopDrag = function() {
        if (!this.dragState) {
            return;
        }

        this.dragState = false;

        clearInterval(this.interval);

        handleSliderEvent({
            item : this.item,
            value : this.state,
            type : 'end'
        });

        this.opt.removeEventListener('touchmove', this.dragHandler);
        this.opt.removeEventListener('mousemove', this.dragHandler);
    };

    Slider.prototype.drag = function(event) {
        var width = this.el.offsetWidth;
        var pos = this.getPosition(event);
        var val = this.getValue(pos / width);

        this.displayValue(val);
    };

    Slider.prototype.sendValue = function() {
        if (!this.dragState) {
            clearInterval(this.interval);
            return;
        }

        if (this.state !== this.oldState) {
            this.oldState = this.state;
            handleSliderEvent({
                item : this.item,
                value : this.state,
                type : 'move'
            });
        }

    };

    Slider.prototype.getValue = function(value) {
        value = value > 1 ? 1 : value;
        value = value < 0 ? 0 : value;
        value = this.min + ((this.max - this.min) * value);
        value = Math.round(value);

        this.state = value;

        return value;
    };

    Slider.prototype.displayValue = function(value) {
        this.handle.style.left = value + '%';
        this.progress.style.width = value + '%';
        this.valueEl.innerHTML = value + '&nbsp;' + '%';
    };

	/**
	 * On drag start, abort polling request, start it after dragging ends.
	 * @param data Object of drag event
	 */
	function handleSliderEvent(data) {
		var ESH = getESH();

        if (data.type === 'start') {
            if (ESH.pollingRequest) {
                var pollRequest = ESH.pollingRequest;
                pollRequest.onreadystatechange = null;
                pollRequest.abort();
                ESH.pollingRequest = null;
            }
        } else if (data.type === 'end') {
            setTimeout(function () {
                WA.Request(ESH.pollURL, null, -1, true, null);
            }, 100);

        }

        var cmdUrl = CMD_SERVLET + '?' + data.item + '=' + data.value;
        WA.Request(cmdUrl, null, null, true, null);
	}

    /**
     * Initialize a slider on each element with class iSliderContainer.
     */
    function InitSlider() {
        if (initDebounceTimeout) clearTimeout(initDebounceTimeout);
        initDebounceTimeout = setTimeout(function InnerInitSlider() {
            console.log('Initializing sliders');
            var i, alreadyInitialized, items = document.querySelectorAll('.iSliderContainer');
            for (i = 0; i < items.length; i++) {
                alreadyInitialized = items[i].getAttribute('data-slider') === 'true';
                if (!alreadyInitialized) {
                    new Slider(items[i]);
                }
            }
        }, 120);
    }

	/**
	 * Return document.ESH or create it.
	 * @returns {{}|*}
	 */
	function getESH() {
		if (!document.ESH) {
			document.ESH = {};
		}
		return document.ESH;
	}

    // Initialize on first load
	InitSlider();

    // Initialize new sliders after navigation
	WA.AddEventListener('endslide', InitSlider);

    // Need to reinitialize after each async request.
    // This is because if any value on the current page changes, the complete
    // page content is replaces and has uninitialized sliders.
	WA.AddEventListener('endasync', InitSlider);


    observeDOM(document.getElementById('iGroup'), InitSlider);

}(document, WA));
