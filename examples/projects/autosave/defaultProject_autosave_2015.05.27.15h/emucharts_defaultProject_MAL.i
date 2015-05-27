# ---------------------------------------------------------------
#  MAL Model: emucharts_defaultProject_MAL
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
 MachineState = { A, B }

interactor main #emucharts_defaultProject_MAL
 attributes
  current_state: MachineState
  previous_state: MachineState

 actions
  c

 axioms
  [] previous_state = A & current_state = A

  (current_state=A) & (liht=on) -> [c] (current_state'=B)
  per(c) -> ( current_state = A & liht=on ) 



# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
