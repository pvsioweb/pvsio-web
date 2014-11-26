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

# closed--> opening
{"identifier":{"type":"identifier","val":"rcButton"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[]}}
# opening--> open
{"identifier":{"type":"identifier","val":"opSensor"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[]}}
# open--> closing
{"identifier":{"type":"identifier","val":"rcButton"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[]}}
# closing--> closed
{"identifier":{"type":"identifier","val":"clSensor"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[]}}
# closing--> stopped
{"identifier":{"type":"identifier","val":"rcButton"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[{"type":"assignment","val":{"identifier":{"type":"identifier","val":"memory"},"binop":{"type":"binop","val":":="},"expression":{"type":"expression","val":[{"type":"identifier","val":"opening"}]}}}]}}
# closing--> opening
{"identifier":{"type":"identifier","val":"sfSensor"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[]}}
# stopped--> opening
{"identifier":{"type":"identifier","val":"rcButton"},"cond":{"type":"expression","val":[{"type":"identifier","val":"memory"},{"type":"binop","val":"=="},{"type":"identifier","val":"opening"}]},"actions":{"type":"actions","val":[]}}
# stopped--> closing
{"identifier":{"type":"identifier","val":"rcButton"},"cond":{"type":"expression","val":[{"type":"identifier","val":"memory"},{"type":"binop","val":"=="},{"type":"identifier","val":"closing"}]},"actions":{"type":"actions","val":[]}}
# opening--> stopped
{"identifier":{"type":"identifier","val":"rcSensor"},"cond":{"type":"expression","val":[]},"actions":{"type":"actions","val":[{"type":"assignment","val":{"identifier":{"type":"identifier","val":"memory"},"binop":{"type":"binop","val":":="},"expression":{"type":"expression","val":[{"type":"identifier","val":"closing"}]}}}]}}
# closed--> opening
{"identifier":{"type":"identifier","val":"click_on"},"cond":{"type":"expression","val":[{"type":"identifier","val":"display"},{"type":"binop","val":"=="},{"type":"number","val":"100"}]},"actions":{"type":"actions","val":[{"type":"assignment","val":{"identifier":{"type":"identifier","val":"display"},"binop":{"type":"binop","val":":="},"expression":{"type":"expression","val":[{"type":"identifier","val":"display"},{"type":"binop","val":"+"},{"type":"number","val":"1"}]}}}]}}
result:
rcButton
opSensor
clSensor
sfSensor
rcSensor
click_on


# ---------------------------------------------------------------
#  MAL model generated using PVSio-web MALPrinter2 ver 0.1
#  Tool freely available at http://www.pvsioweb.org
# ---------------------------------------------------------------
