# ---------------------------------------------------------------
#  MAL Model: emucharts
#  Author: Paolo Masci
#          Queen Mary University of London, United Kingdom
#          http://www.eecs.qmul.ac.uk/~masci/
# ---------------------------------------------------------------

defines
 INT_MIN = -4
 INT_MAX = 4

types
 int = INT_MIN..INT_MAX
 nat = 0..INT_MAX
 MachineState = { closed, opening, closing, open, stopped }

interactor main #emucharts
 attributes
  current_state: MachineState
  previous_state: MachineState
memory: {opening, closing, open, closed, stopped}

 actions
  rcButton
  opSensor
  clSensor
  sfSensor
  rcSensor
  click_on

 [] previous_state = closed & current_state = closed

(current_state=stopped) & (memory=opening) -> [rcButton] (current_state'=opening)
(current_state=stopped) & (memory=closing) -> [rcButton] (current_state'=closing)
(current_state=opening) -> [opSensor] (current_state'=open)
(current_state=closing) -> [clSensor] (current_state'=closed)
(current_state=closing) -> [sfSensor] (current_state'=opening)
(current_state=opening) -> [rcSensor] (current_state'=stopped) & (memory:=closing)
(current_state=closed) & (display=100) -> [click_on] (current_state'=opening) & (display:=display+1)


# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
