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

+rcButton
 +stopped
  +opening
   +memory=opening
  +closing
   +memory=closing
+opSensor
 +opening
  +open
   +
+clSensor
 +closing
  +closed
   +
+sfSensor
 +closing
  +opening
   +
+rcSensor
 +opening
  +stopped
   +
+click_on
 +closed
  +opening
   +display=100


# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
