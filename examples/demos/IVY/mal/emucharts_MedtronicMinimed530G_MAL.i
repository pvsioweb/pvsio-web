# ---------------------------------------------------------------
#  MAL Model: emucharts_MedtronicMinimed530G_MAL
#  Author: <author name>
#          <affiliation>
#          <contact>
# ---------------------------------------------------------------

defines
 INT_MIN = -4
 INT_MAX = 4

types
 int = INT_MIN..INT_MAX
 nat = 0..INT_MAX
 MachineState = { off, on }

interactor main #emucharts_MedtronicMinimed530G_MAL
 attributes
  current_state: MachineState
  previous_state: MachineState
  display: real

 actions
  turn_on
  turn_off
  click_DOWN
  click_UP

 axioms
  [] previous_state = off & current_state = off

  (current_state=off) -> [turn_on] (current_state'=on)
  per(turn_on) -> ( current_state = off) 

  (current_state=on) -> [turn_off] (current_state'=off)
  per(turn_off) -> ( current_state = on) 

  (current_state=on) & (display>0) -> [click_DOWN] (current_state'=on) & (display'=display-0.1)
  (current_state=on) & (display=0) -> [click_DOWN] (current_state'=on) & (display'=10)
  per(click_DOWN) -> ( current_state = on) 

  (current_state=on) & (display<10) -> [click_UP] (current_state'=on) & (display'=display+0.1)
  (current_state=on) & (display=10) -> [click_UP] (current_state'=on) & (display'=0)
  per(click_UP) -> ( current_state = on) 



# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
