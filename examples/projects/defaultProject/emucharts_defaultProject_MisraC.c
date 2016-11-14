/**---------------------------------------------------------------
*   Model: emucharts_defaultProject_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "emucharts_defaultProject_MisraC.h"
#include <assert.h>

#ifdef DEBUG
#include <stdio.h>
#define debug_print(fmt, args...) \
        do { fprintf(stderr, "%s:%d:%s(): " fmt, \
                __FILE__, __LINE__, __FUNCTION__, ##args); } while (0)
#endif
/* constants variables */
const D_64 bat_max = 2999.0f;
const D_64 bat_min = 2.0f;
const D_64 infusemin = 0.1f;
const D_64 maxinfuse = 3000.0f;
const D_64 maxrate = 1200.0f;
const D_64 maxtime = 3000.0f;
const D_64 shorttime = 20.0f;
const D_64 timeout = 200.0f;

/* definition of auxiliary functions */
void enter(MachineState newStateLabel, state *st) {
#ifdef DEBUG
    debug_print("Entering state nr. '%u'.\n", newStateLabel);
#endif
    st->current_state = newStateLabel;
}
void leave(MachineState currentStateLabel, state *st) {
#ifdef DEBUG    
    debug_print("Leaving state nr. '%u'.\n", currentStateLabel);
#endif    
    st->previous_state = currentStateLabel;
}

/* definition of initialisation function */
state init(state *st){
#ifdef DEBUG    
    debug_print("Initialisation of state variables.\n");
#endif    
    st->ac_connect = FALSE;
    st->battery = bat_max;
    st->elapse = 0.0f;
    st->elapsedtime = 0.0f;
    st->infusing = FALSE;
    st->infusionrate = 0.0f;
    st->kvoflag = FALSE;
    st->kvorate = 0.0f;
    st->powered_on = FALSE;
    st->set_fitted = TRUE;
    st->time = 0.0f;
    st->volumeinfused = 0.0f;
    st->vtbi = 0.0f;
    enter(OFF, st);
    
    assert ( st->current_state == OFF );
    return *st;
}

/* definition of transition functions */
state on(state *st) {
    assert( st->current_state ==  OFF || st->current_state ==  ON );

    if ( (st->current_state == OFF) && (! st->powered_on) ) {
        leave(OFF, st);
        st->powered_on = TRUE;
#ifdef DEBUG        
        debug_print("Action st->powered_on = TRUE issued.\n");
#endif 
        st->infusing = FALSE;
#ifdef DEBUG        
        debug_print("Action st->infusing = FALSE issued.\n");
#endif 
        st->elapse = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->elapse = 0.0f issued.\n");
#endif 
        st->kvoflag = FALSE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = FALSE issued.\n");
#endif       
        enter(ON, st);
        assert( st->current_state == ON );
        return *st;
    }
    if ( (st->current_state == ON) && (st->powered_on) ) {
        leave(ON, st);
        st->powered_on = FALSE;
#ifdef DEBUG        
        debug_print("Action st->powered_on = FALSE issued.\n");
#endif 
        st->infusing = FALSE;
#ifdef DEBUG        
        debug_print("Action st->infusing = FALSE issued.\n");
#endif       
        enter(OFF, st);
        assert( st->current_state == OFF );
        return *st;
    }
    return *st;
}

state pause(state *st) {
    assert( st->current_state ==  INFUSING_BATT || st->current_state ==  INFUSING_MAINS );

    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->powered_on )) ) {
        leave(INFUSING_BATT, st);
        st->infusing = FALSE;
#ifdef DEBUG        
        debug_print("Action st->infusing = FALSE issued.\n");
#endif 
        st->elapse = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->elapse = 0.0f issued.\n");
#endif       
        enter(ON, st);
        assert( st->current_state == ON );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->powered_on )) ) {
        leave(INFUSING_MAINS, st);
        st->infusing = FALSE;
#ifdef DEBUG        
        debug_print("Action st->infusing = FALSE issued.\n");
#endif 
        st->elapse = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->elapse = 0.0f issued.\n");
#endif       
        enter(ON, st);
        assert( st->current_state == ON );
        return *st;
    }
    return *st;
}

state start(state *st) {
    assert( st->current_state ==  ON );

    if ( (st->current_state == ON) && (( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif 
        st->kvoflag = FALSE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = FALSE issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == ON) && (( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == ON) && (( ! st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == ON) && (( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif 
        st->kvoflag = FALSE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = FALSE issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == ON) && (( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == ON) && (( st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == ON) && (( ! st->kvoflag ) && ( ( ( st->vtbi == 0 ) ) || ( ( st->infusionrate == 0 ) ) )) ) {
        leave(ON, st);
        st->infusing = FALSE;
#ifdef DEBUG        
        debug_print("Action st->infusing = FALSE issued.\n");
#endif       
        enter(ON, st);
        assert( st->current_state == ON );
        return *st;
    }
    return *st;
}

state tick(state *st) {
    assert( st->current_state ==  INFUSING_MAINS || st->current_state ==  INFUSING_BATT );

    if ( (st->current_state == INFUSING_MAINS) && (! st->ac_connect) ) {
        leave(INFUSING_MAINS, st);      
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (st->ac_connect) ) {
        leave(INFUSING_BATT, st);      
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime )) ) {
        leave(INFUSING_BATT, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime )) ) {
        leave(INFUSING_BATT, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime )) ) {
        leave(INFUSING_BATT, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime )) ) {
        leave(INFUSING_BATT, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime )) ) {
        leave(INFUSING_MAINS, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime )) ) {
        leave(INFUSING_MAINS, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime )) ) {
        leave(INFUSING_MAINS, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime )) ) {
        leave(INFUSING_MAINS, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->infusionrate issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = st->vtbi - st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->vtbi = st->vtbi - st->infusionrate issued.\n");
#endif 
        st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->volumeinfused = st->volumeinfused + st->vtbi;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->vtbi issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->kvorate = infusemin;
#ifdef DEBUG        
        debug_print("Action st->kvorate = infusemin issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
        leave(INFUSING_BATT, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->vtbi = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->vtbi = 0.0f issued.\n");
#endif 
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif 
        st->kvoflag = TRUE;
#ifdef DEBUG        
        debug_print("Action st->kvoflag = TRUE issued.\n");
#endif 
        st->kvorate = st->infusionrate;
#ifdef DEBUG        
        debug_print("Action st->kvorate = st->infusionrate issued.\n");
#endif 
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )) ) {
        leave(INFUSING_BATT, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )) ) {
        leave(INFUSING_BATT, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )) ) {
        leave(INFUSING_BATT, st);
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif 
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    if ( (st->current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )) ) {
        leave(INFUSING_BATT, st);
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( st->current_state == INFUSING_BATT );
        return *st;
    }
    if ( (st->current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( st->current_state == INFUSING_MAINS );
        return *st;
    }
    return *st;
}


/* definition of permission function for transition functions */
UC_8 per_on(const state *st) {
    if (st->current_state ==  OFF || st->current_state ==  ON ){
        return true;
    }
    return false;
}

UC_8 per_pause(const state *st) {
    if (st->current_state ==  INFUSING_BATT || st->current_state ==  INFUSING_MAINS ){
        return true;
    }
    return false;
}

UC_8 per_start(const state *st) {
    if (st->current_state ==  ON ){
        return true;
    }
    return false;
}

UC_8 per_tick(const state *st) {
    if (st->current_state ==  INFUSING_MAINS || st->current_state ==  INFUSING_BATT ){
        return true;
    }
    return false;
}


/**
 * \example emucharts_defaultProject_MisraC.c
 * \example main.c
 * An example to test the C code generated.
 */
 
/*! \page table_transitions Table of transitions
<table>
<tr><th>Transition name<th>Current state<th>Next state<th>Condition<th>Action
<tr><td rowspan="2">on<td>OFF<td>ON<td>! st->powered_on<td>st->powered_on = TRUE<br> st->infusing = FALSE<br> st->elapse = 0.0f<br> st->kvoflag = FALSE<br> 
<tr><td>ON<td>OFF<td>st->powered_on<td>st->powered_on = FALSE<br> st->infusing = FALSE<br> 
<tr><td rowspan="2">pause<td>INFUSING_BATT<td>ON<td>( st->infusing ) && ( st->powered_on )<td>st->infusing = FALSE<br> st->elapse = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>ON<td>( st->infusing ) && ( st->powered_on )<td>st->infusing = FALSE<br> st->elapse = 0.0f<br> 
<tr><td rowspan="7">start<td>ON<td>INFUSING_BATT<td>( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )<td>st->infusing = TRUE<br> st->kvoflag = FALSE<br> 
<tr><td>ON<td>INFUSING_BATT<td>( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )<td>st->infusing = TRUE<br> 
<tr><td>ON<td>INFUSING_BATT<td>( ! st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )<td>st->infusing = TRUE<br> 
<tr><td>ON<td>INFUSING_MAINS<td>( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )<td>st->infusing = TRUE<br> st->kvoflag = FALSE<br> 
<tr><td>ON<td>INFUSING_MAINS<td>( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )<td>st->infusing = TRUE<br> 
<tr><td>ON<td>INFUSING_MAINS<td>( st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )<td>st->infusing = TRUE<br> 
<tr><td>ON<td>ON<td>( ! st->kvoflag ) && ( ( ( st->vtbi == 0 ) ) || ( ( st->infusionrate == 0 ) ) )<td>st->infusing = FALSE<br> 
<tr><td rowspan="70">tick<td>INFUSING_MAINS<td>INFUSING_BATT<td>! st->ac_connect<td>
<tr><td>INFUSING_BATT<td>INFUSING_MAINS<td>st->ac_connect<td>
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime )<td>st->time = 0.0f<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime )<td>st->time = 0.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime )<td>st->time = 0.0f<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime )<td>st->time = 0.0f<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime )<td>st->time = 0.0f<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime )<td>st->time = 0.0f<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime )<td>st->time = 0.0f<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime )<td>st->time = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> st->volumeinfused = st->volumeinfused + st->infusionrate<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )<td>st->vtbi = st->vtbi - st->infusionrate<br> st->time = ( st->vtbi - st->infusionrate ) / st->infusionrate<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = st->infusionrate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = st->infusionrate<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = st->infusionrate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = st->infusionrate<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = infusemin<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = infusemin<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = infusemin<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->volumeinfused = st->volumeinfused + st->vtbi<br> st->kvorate = infusemin<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = st->infusionrate<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->kvorate = infusemin<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->kvorate = st->infusionrate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->kvorate = st->infusionrate<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->kvorate = st->infusionrate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )<td>st->vtbi = 0.0f<br> st->time = 0.0f<br> st->kvoflag = TRUE<br> st->kvorate = st->infusionrate<br> st->battery = st->max_bat<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )<td>st->volumeinfused = st->volumeinfused + st->kvorate<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )<td>st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )<td>st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )<td>st->elapsedtime = st->elapsedtime + 1.0f<br> st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )<td>st->elapsedtime = st->elapsedtime + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )<td>st->battery = st->battery - 1.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )<td>st->battery = st->battery + 1.0f<br> 
<tr><td>INFUSING_BATT<td>INFUSING_BATT<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )<td>st->battery = 0.0f<br> 
<tr><td>INFUSING_MAINS<td>INFUSING_MAINS<td>( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )<td>st->battery = st->max_bat<br> 

</table>
*/


/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

