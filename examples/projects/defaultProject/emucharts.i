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
 MachineState = { X1, X2, X3 }

interactor emucharts
 attributes
  current_state: MachineState
  previous_state: MachineState

 actions
  A
  B

 [] previous_state = X1 & current_state = X1

 per(A) -> current_state = X1
 [A] -> previous_state' = X1 & current_state' = X2

 per(B) -> current_state = X2
 [B] -> previous_state' = X2 & current_state' = X3




# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
