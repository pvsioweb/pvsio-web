/**
 * @author hogfather
 * @date Feb 29, 2012
 * @project JSNumberEntry
 */
/**
 * Creates a timer object that can be easily used to manage timing functions
 * 
 * @param interval
 * @param repeatCount
 * @param mode
 *            can be either interval or timeout
 * @returns {Timer}
 */
define(['util/timerConstants','util/eventDispatcher'], function( timerConstants, eventDispatcher){
	//return a function for creating timers
	return function(interval, repeatCount, mode) {	
		var initialInterval = interval;
		var _interval = interval;
		var _repeatCount = repeatCount || Number.POSITIVE_INFINITY;
		var _mode = mode ? mode : timerConstants.Interval;
		var _currentCount = 0;
		var timerid = -1;
		var running = false;
		
		function timerTick() {
			if (!running)
				return;
	
			if (_currentCount < _repeatCount) {
				_currentCount++;
				var event = {
					type : timerConstants.TimerTicked,
					currentCount : _currentCount
				};
				res.fire(event);
				if (_currentCount < _repeatCount) {
					// recall the setTimeout method if the timer is in timeout mode
					if (_mode == timerConstants.Timeout)
						timerid = setTimeout(arguments.callee, _interval);
				} else {
					clearInterval(timerid);
					event = {
						type : timerConstants.TimerFinished,
						currentCount : _currentCount
					};
					res.fire(event);
				}
			} else {
				clearInterval(timerid);
				var event = {
					type : timerConstants.TimerFinished,
					currentCount : _currentCount
				};
				res.fire(event);
			}
		}
	
		
		function start(){
			if (!running) {
				switch (_mode) {
				case timerConstants.Interval:
					timerid = setInterval(timerTick, _interval);
					break;
				case timerConstants.Timeout:
					timerid = setTimeout(timerTick, _interval);
					break;
				}
				running = true;
			}
		}
		
		function changeInterval(val){
			if (_mode == timerConstants.Timeout) {
				_interval = _val;
				logger.log('interval changed to ' + _interval);
			}
		}
		
		function stop(){
			if (running) {
				running = false;
				clearInterval(timerid);
			}
		}
		
		
		var res = {
			getCurrentCount : function() {
				return _currentCount;
			},
	
			getInterval : function() {
				return _interval;
			},
	
			start : function() {
				start();
				return this;
			},
			/**
			 * This only has an effect in the timeout mode because the interval mode
			 * implies that events will be fired regularly
			 */
			changeInterval: function(_val) {
				changeInterval(_val);
				return this;
			},
	
			stop : function() {
				stop();
				return this;
			},
			reset : function() {
				stop();
				_currentCount = 0;
				_interval = initialInterval;
				return this;
			},
	
			restart : function() {
				stop();
				start();
				return this;
			}
			
		};
		eventDispatcher(res);
		return res;
	};
});
