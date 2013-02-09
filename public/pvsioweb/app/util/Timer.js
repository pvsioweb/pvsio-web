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
	return function(i, repeatCount, mode) {	
		var initialInterval = i;
		var _interval = i;
		var _repeatCount = repeatCount || Number.POSITIVE_INFINITY;
		var _mode = mode ? mode : timerConstants.Interval;
		var _currentCount = 0;
		var timerid = -1;
		var running = false;
		var event = {};
		
		function timerTick() {
			if (!running)
				return;
	
			if (_currentCount < _repeatCount) {
				_currentCount++;
				event = {
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
				event = {
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
		
		function interval(val){
			if(val !== undefined){
				_interval = val;
				return this;
			}
			return _interval;
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
			start : function() {
				start();
				return this;
			},
			interval:interval,
	
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
