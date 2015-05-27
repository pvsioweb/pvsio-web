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
 MachineState = { a, b }

interactor main #emucharts_defaultProject_MAL
 attributes
  current_state: MachineState
  previous_state: MachineState

 actions
  click

 axioms
  [] previous_state = a & current_state = a

  (current_state=a) & (con=true) -> [click] (current_state'=b)
  per(click) -> ( current_state = a & con=true ) 



# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
