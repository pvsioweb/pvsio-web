/**---------------------------------------------------------------
*   Model: emucharts_defaultProject_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "Android_emucharts_defaultProject_MisraC.h"
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
/**
 * Global variables
 */

static UC_8 ac_connect;
static D_64 battery;
static D_64 elapse;
static D_64 elapsedtime;
static UC_8 infusing;
static D_64 infusionrate;
static UC_8 kvoflag;
static D_64 kvorate;
static UC_8 powered_on;
static UC_8 set_fitted;
static D_64 time;
static D_64 volumeinfused;
static D_64 vtbi;
static MachineState current_state;  //  Predefined variable for current state.
static MachineState previous_state;  //  Predefined variable for previous state.


/* definition of auxiliary functions */
void enter(const MachineState newStateLabel) {
#ifdef DEBUG
    debug_print("Entering state nr. '%u'.\n", newStateLabel);
#endif
    current_state = newStateLabel;
}
void leave(const MachineState currentStateLabel) {
#ifdef DEBUG    
    debug_print("Leaving state nr. '%u'.\n", currentStateLabel);
#endif    
    previous_state = currentStateLabel;
}

/* definition of initialisation function */
JNIEXPORT void JNICALL init(JNIEnv *env,jobject callingObject,jobject obj){
#ifdef DEBUG    
    debug_print("Initialisation of state variables.\n");
#endif    
    ac_connect = FALSE;
    battery = bat_max;
    elapse = 0.0f;
    elapsedtime = 0.0f;
    infusing = FALSE;
    infusionrate = 0.0f;
    kvoflag = FALSE;
    kvorate = 0.0f;
    powered_on = FALSE;
    set_fitted = TRUE;
    time = 0.0f;
    volumeinfused = 0.0f;
    vtbi = 0.0f;
    enter(OFF, st);
    
    assert ( current_state == OFF );
    return;
}

/* definition of transition functions */
JNIEXPORT void JNICALL on(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  OFF || current_state ==  ON );

    if ( (current_state == OFF) && (! st->powered_on) ) {
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
        assert( current_state == ON );
        return;
    }
    if ( (current_state == ON) && (st->powered_on) ) {
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
        assert( current_state == OFF );
        return;
    }
    return;
}

JNIEXPORT void JNICALL pause(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  INFUSING_BATT || current_state ==  INFUSING_MAINS );

    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->powered_on )) ) {
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
        assert( current_state == ON );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->powered_on )) ) {
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
        assert( current_state == ON );
        return;
    }
    return;
}

JNIEXPORT void JNICALL start(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  ON );

    if ( (current_state == ON) && (( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == ON) && (( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == ON) && (( ! st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == ON) && (( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == ON) && (( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == ON) && (( st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )) ) {
        leave(ON, st);
        st->infusing = TRUE;
#ifdef DEBUG        
        debug_print("Action st->infusing = TRUE issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == ON) && (( ! st->kvoflag ) && ( ( ( st->vtbi == 0 ) ) || ( ( st->infusionrate == 0 ) ) )) ) {
        leave(ON, st);
        st->infusing = FALSE;
#ifdef DEBUG        
        debug_print("Action st->infusing = FALSE issued.\n");
#endif       
        enter(ON, st);
        assert( current_state == ON );
        return;
    }
    return;
}

JNIEXPORT void JNICALL tick(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  INFUSING_MAINS || current_state ==  INFUSING_BATT );

    if ( (current_state == INFUSING_MAINS) && (! st->ac_connect) ) {
        leave(INFUSING_MAINS, st);      
        enter(INFUSING_BATT, st);
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (st->ac_connect) ) {
        leave(INFUSING_BATT, st);      
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime )) ) {
        leave(INFUSING_BATT, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime )) ) {
        leave(INFUSING_MAINS, st);
        st->time = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->time = 0.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->volumeinfused = st->volumeinfused + st->kvorate;
#ifdef DEBUG        
        debug_print("Action st->volumeinfused = st->volumeinfused + st->kvorate issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )) ) {
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
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )) ) {
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
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->elapsedtime = st->elapsedtime + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->elapsedtime = st->elapsedtime + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )) ) {
        leave(INFUSING_BATT, st);
        st->battery = st->battery - 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery - 1.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->battery = st->battery + 1.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = st->battery + 1.0f issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    if ( (current_state == INFUSING_BATT) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )) ) {
        leave(INFUSING_BATT, st);
        st->battery = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->battery = 0.0f issued.\n");
#endif       
        enter(INFUSING_BATT, st);
        assert( current_state == INFUSING_BATT );
        return;
    }
    if ( (current_state == INFUSING_MAINS) && (( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )) ) {
        leave(INFUSING_MAINS, st);
        st->battery = st->max_bat;
#ifdef DEBUG        
        debug_print("Action st->battery = st->max_bat issued.\n");
#endif       
        enter(INFUSING_MAINS, st);
        assert( current_state == INFUSING_MAINS );
        return;
    }
    return;
}


/* definition of permission function for transition functions */
JNIEXPORT jboolean JNICALL per_on(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  OFF ||  current_state ==  ON ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_pause(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  INFUSING_BATT ||  current_state ==  INFUSING_MAINS ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_start(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  ON ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_tick(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  INFUSING_MAINS ||  current_state ==  INFUSING_BATT ){
        return true;
    }
    return false;
}


/* definition of utility functions */
JNIEXPORT UC_8 JNICALL Get_1ac_connect(JNIEnv *env, jobject callingObject)
{
    return ac_connect;
}
JNIEXPORT D_64 JNICALL Get_1battery(JNIEnv *env, jobject callingObject)
{
    return battery;
}
JNIEXPORT D_64 JNICALL Get_1elapse(JNIEnv *env, jobject callingObject)
{
    return elapse;
}
JNIEXPORT D_64 JNICALL Get_1elapsedtime(JNIEnv *env, jobject callingObject)
{
    return elapsedtime;
}
JNIEXPORT UC_8 JNICALL Get_1infusing(JNIEnv *env, jobject callingObject)
{
    return infusing;
}
JNIEXPORT D_64 JNICALL Get_1infusionrate(JNIEnv *env, jobject callingObject)
{
    return infusionrate;
}
JNIEXPORT UC_8 JNICALL Get_1kvoflag(JNIEnv *env, jobject callingObject)
{
    return kvoflag;
}
JNIEXPORT D_64 JNICALL Get_1kvorate(JNIEnv *env, jobject callingObject)
{
    return kvorate;
}
JNIEXPORT UC_8 JNICALL Get_1powered_on(JNIEnv *env, jobject callingObject)
{
    return powered_on;
}
JNIEXPORT UC_8 JNICALL Get_1set_fitted(JNIEnv *env, jobject callingObject)
{
    return set_fitted;
}
JNIEXPORT D_64 JNICALL Get_1time(JNIEnv *env, jobject callingObject)
{
    return time;
}
JNIEXPORT D_64 JNICALL Get_1volumeinfused(JNIEnv *env, jobject callingObject)
{
    return volumeinfused;
}
JNIEXPORT D_64 JNICALL Get_1vtbi(JNIEnv *env, jobject callingObject)
{
    return vtbi;
}


/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

