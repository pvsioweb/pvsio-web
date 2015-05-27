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
 MachineState = { X1, X2 }

interactor main #emucharts_defaultProject_MAL
 attributes
  current_state: MachineState
  previous_state: MachineState

 actions
  T1

 axioms
  [] previous_state = X1 & current_state = X1

  (current_state=X1) -> [T1] (current_state'=X2)
  per(T1) -> ( current_state = X1 ) 



# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
