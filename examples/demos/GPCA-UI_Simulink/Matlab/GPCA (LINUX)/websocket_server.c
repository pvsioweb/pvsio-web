#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "websocket_server.h"
#include "signal.h"

#include "InfusionParameters.h"
#include "PVS_GPCAUI_BUS.h"

/* the server url will be http://localhost:XXXX */
int port = 0;
int initial_port = 2317;

/* uncomment the following line to enable the compilation of main() */
#define DBG
#define def LWS_NO_EXTENSIONS



#define TRUE    1
#define FALSE   0
#define SUCCESS 1
#define FAIL    0

#define MAX_CMD_LEN 128
#define MAX_DIGITS 8
#define MAX_LEN 1024

int websocket_open = FALSE;
struct libwebsocket_context *context;

struct PVS_GPCAUI_BUS gpcauiBus = { E_NULL, 0.0, 0.0 };

struct CONTROLLER_BUS {
    int    controller_state;
    int    isBolusInProgress;
    double totalVolumeInfused;
    double remainingVolumeInReservoir;
} controllerBus = { CTRL_NULL, FALSE, 0.0, 0.0 };


int force_exit = 0;

void sighandler(int sig) {
	force_exit = 1;
}

void close_websocket() {
    libwebsocket_context_destroy(context);
    websocket_open = FALSE;
   	lwsl_notice("libwebsockets-test-echo exited cleanly\n");
}

/** 
 * WebSocket Server (WSServer) is periodically invoked by Simulink 
 * to check for new incoming messages from the GPCA-UI and from the controller
 */
int WebsocketServer(/* input variables */
                    const double tick, 
                    const int controller_state, 
                    const int isBolusInProgress, 
                    const double totalVolumeInfused, 
                    const double remainingVolumeInReservoir,
                    /* output variables */
                    int* eventID, 
                    double* programmedVTBI, 
                    double* programmedDoseRate) {
     if(websocket_open == FALSE) {
        port = initial_port;
        websocket_open = open_websocket();
		if(websocket_open == FALSE) {
	        initial_port++; /* change port so that a new port can be tried at the next attempt */
		}
		else {
			signal(SIGINT, sighandler); /* allows a clean exit */
		}
        return port;
     }
     /* update local copy of controller bus */
    controllerBus.controller_state    = controller_state;
    controllerBus.isBolusInProgress   = isBolusInProgress;
    controllerBus.totalVolumeInfused  = totalVolumeInfused;
    controllerBus.remainingVolumeInReservoir = remainingVolumeInReservoir;

     /* update output variables with the value of gpcaui bus */    
    *eventID            = gpcauiBus.event;
    *programmedVTBI     = gpcauiBus.programmedVTBI;
    *programmedDoseRate = gpcauiBus.programmedDoseRate;
    
     /**
       * schedule a callback to receive new events from the gpcaui
       * libwebsocket_service will process all waiting events with their
       * callback functions and then wait 1000 ms.
       * (this is single threaded webserver and this will keep
       * our server from generating load while there are not
       * requests to process) 
       */
	if(!force_exit) { libwebsocket_service(context, 512); }
	else { close_websocket(); }
    
    /* always return the port used by the server */
    return port;
}



char controllerState[49][128] = {
    "CTRL_NULL",
    "PowerOff",
    "CONFIRM_POWER_DOWN",
    "POWER_ON_SELF_TEST",
    "POST_FAILED",
    "CHECK_ADMIN_SET",
    "INCORRECT_ADMIN_SETUP",
    "CHECK_PRIME",
    "PRIME_FAILED", 
    "DISPLAY_DRUG_INFORMATION",
    "CHECK_DRUG_TYPE",
    "UNKNOWN_DRUG",    
    "CHECK_DOSE_UNIT",
    "INCORRECT_DOSE_UNIT",
    "CHECK_CONCENTRATION",
    "CONC_HARD_LIMITS_VIOLATED",
    "CONC_SOFT_LIMITS_VIOLATED",
    "STATE17", /* where is state 17? */
    "DISPLAY_PATIENT_PROFILE",
    "DISPLAY_VTBI",   
    "CHANGE_VTBI",
    "CHECK_VTBI",
    "VTBI_HARD_LIMITS_VIOLATED",
    "DISPLAY_DOSE_RATE",
    "CHANGE_DOSE_RATE",
    "CHECK_DOSE_RATE",
    "DOSE_RATE_HARD_LIMITS_VIOLATED",
    "DISPLAY_SETTINGS",
    "INFUSION_NORMAL_OPERATION",
    "BOLUS_REQUEST",
    "CHANGE_DOSE_RATE_WHEN_INFUSING",
    "CHECK_NEW_DOSE_RATE",
    "NEW_DOSE_RATE_OUT_OF_BOUNDS",
    "STOP_PAUSE",
    "CONFIRM_PAUSE",
    "CONFIRM_STOP",
    "INFUSION_PAUSED",
    "INFUSION_PAUSED_TOO_LONG",
    "PAUSED_STOP_CONFIRM",
    "INFUSION_STOPPED",
    "EMPTY_RESERVOIR",
    "CHECK_DRUG_WHEN_INFUSING",
    "WRONG_DRUG_DURING_INFUSION",
    "HARDWARE_FAILURE_LEVEL_ONE",
    "FAILURE_LEVEL_TWO",  
    "POST_SUCCESSFUL",  
    "VTBI_SOFT_LIMITS_VIOLATED",
    "DOSE_RATE_SOFT_LIMITS_VIOLATED",
    "READY_TO_START"
};

char* decodeControllerState(int stateID) {
    if(stateID > 0 && stateID <= 48) { return controllerState[stateID]; }
    return controllerState[0];
}

/* Function "write_websocket" is used to send data back to the gpcaui.
 * The function translates double, integer and boolean values 
 * into their string representation
 */
void write_websocket(struct libwebsocket* wsi, 
                     int controller_state, 
                     int isBolusInProgress, 
                     double totalVolumeInfused,
                     double remainingVolumeInReservoir) {
    
	char* string_controller_state = decodeControllerState(controller_state);
    
	char* string_isBolusInProgress = isBolusInProgress ? "TRUE": "FALSE";  
    
	char string_totalVolumeInfused[MAX_DIGITS];
	memset(string_totalVolumeInfused, 0, MAX_DIGITS);
	snprintf(string_totalVolumeInfused, MAX_DIGITS, "%5.2f", totalVolumeInfused);
    
	char string_remainingVolumeInReservoir[MAX_DIGITS];
	memset(string_remainingVolumeInReservoir, 0, MAX_DIGITS);
	snprintf(string_remainingVolumeInReservoir, MAX_DIGITS, "%5.2f", remainingVolumeInReservoir);
    
	char response[MAX_LEN];
	memset(response, 0, MAX_LEN);
	strcat(response,"(# controller_state := ");
	strcat(response,string_controller_state);
	strcat(response,", isBolusInProgress := ");
	strcat(response,string_isBolusInProgress);
	strcat(response,", totalVolumeInfused := ");
	strcat(response,string_totalVolumeInfused);
	strcat(response,", remainingVolumeInReservoir := ");
	strcat(response,string_remainingVolumeInReservoir);
	strcat(response," #)");
	lwsl_notice("Writing response...\n");
	/* send response to the connected client */
	libwebsocket_write(wsi, response, MAX_LEN, LWS_WRITE_TEXT);
}

int decode_GPCAUI_Command(const char* in) {
	if(strcmp(in, "PowerButton") == 0) { return E_PowerButton; }
	else if(strcmp(in, "StartNewInfusion") == 0) { return E_StartNewInfusion; }
	else if(strcmp(in, "CheckAdminSet") == 0) { return E_CheckAdminSet; }
	else if(strcmp(in, "PrimePump") == 0) { return E_PrimePump; }
	else if(strcmp(in, "CheckDrug") == 0) { return E_CheckDrug; }
	else if(strcmp(in, "ConfigureInfusionProgram") == 0) { return E_ConfigureInfusionProgram; }
	else if(strcmp(in, "ConfigureConcentration") == 0) { return E_ConfigureConcentration; }
    else if(strncmp(in, "ConfirmDoseRate", strlen("ConfirmDoseRate")) == 0) { return E_ConfirmDoseRate; }
    else if(strncmp(in, "ConfirmVTBI", strlen("ConfirmVTBI")) == 0) { return E_ConfirmVTBI; }
	else if(strcmp(in, "StartInfusion") == 0) { return E_StartInfusion; }
	else if(strcmp(in, "ChangeDoseRate") == 0) { return E_ChangeDoseRate; }
	else if(strcmp(in, "ChangeVTBI") == 0) { return E_ChangeVTBI; }
	else if(strcmp(in, "PauseInfusion") == 0) { return E_PauseInfusion; }
	else if(strcmp(in, "ConfirmPauseInfusion") == 0) { return E_ConfirmPauseInfusion; }
	else if(strcmp(in, "StopInfusion") == 0) { return E_StopInfusion; }
	else if(strcmp(in, "ConfirmStopInfusion") == 0) { return E_ConfirmStopInfusion; }
	else if(strcmp(in, "RequestBolus") == 0) { return E_RequestBolus; }
	else if(strcmp(in, "ClearAlarm") == 0) { return E_ClearAlarm; }
	else if(strcmp(in, "ClearAlarm") == 0) { return E_ClearAlarm; }
	else if(strcmp(in, "ConfirmPowerDown") == 0) { return E_ConfirmPowerDown; }
	else if(strcmp(in, "Cancel") == 0) { return E_Cancel; }
	return E_NULL;
}

/**
 * functions for websocket extension
 * pointer to `void *in` holds the incomming request
 */
static int callback_GIP(struct libwebsocket_context *context,
                 	struct libwebsocket *wsi,
                 	enum libwebsocket_callback_reasons reason, void *user,
                 	void *in, size_t len) {

    switch(reason) {
      case LWS_CALLBACK_ESTABLISHED:{
        lwsl_notice("\n\nWebsocket connection established\n\n");
        lwsl_notice("**********************************************\n");
        lwsl_notice("***              (GPCA Protocol)          ****\n");
        lwsl_notice("**********************************************\n");
        break;
      }
      case LWS_CALLBACK_CLOSED:{
        lwsl_notice("\n\nWebsocket connection closed\n\n");
        break;
      }
      case LWS_CALLBACK_RECEIVE: {
        lwsl_notice("\n\nLWS_CALLBACK_RECEIVE\n");
        lwsl_notice("Received command from GPCAUI: %s\n", (char*) in);
        /* receive message from the gpcaui */
        gpcauiBus.event = decode_GPCAUI_Command((char*) in);
        if(gpcauiBus.event == E_ConfirmVTBI) { 
            gpcauiBus.programmedVTBI = strtod(((char*) in) + strlen("ConfirmVTBI("), NULL); 
            lwsl_notice("\nprogrammedVTBI = %f\n", strtod(((char*) in) + strlen("ConfirmVTBI("), NULL));
        }
        if(gpcauiBus.event == E_ConfirmDoseRate) { 
            gpcauiBus.programmedDoseRate = strtod(((char*) in) + strlen("ConfirmDoseRate("), NULL); 
        }
        /* send controller state to the gpcaui */
        write_websocket(wsi, 
                        controllerBus.controller_state, 
                        controllerBus.isBolusInProgress, 
                        controllerBus.totalVolumeInfused,
                        controllerBus.remainingVolumeInReservoir);
        lwsl_notice("Callback: %s\n", (char*) in);
        break;
      }
      case LWS_CALLBACK_HTTP:{
        lwsl_notice("LWS_CALLBACK_HTTP\n");
        break;
      }
    }
    return 0;
}

/* list of supported protocols and callbacks */
static struct libwebsocket_protocols protocols[] = {
    {
        "GIP", 		/* name */
	callback_GIP,  /* callback */
	0,     		/* per_session_data_size */
	0,			/* max frame size / rx buffer */
    },
    {
        NULL, NULL, 0, 0   /* End of list */
    }    
};

int open_websocket(){

    const char *interface = NULL; /* NULL means "all interfaces" */

    /**
      *  create libwebsocket context representing this server
      *  this was good for websockets 0.0.3
    context = libwebsocket_create_context(port, interface, protocols,
                                          libwebsocket_internal_extensions,
                                          cert_path, key_path, -1, -1, opts);
	*/
	/* -- websockets 4.0.0 */

	lwsl_notice("libwebsockets test server - "
			"(C) Copyright 2010-2013 Andy Green <andy@warmcat.com> - "
						    "licensed under LGPL2.1\n");

	struct lws_context_creation_info info;
	memset(&info, 0, sizeof(info));
	info.port = port;
	info.iface = interface;
	info.protocols = protocols;
	
	info.ssl_cert_filepath = NULL;
	info.ssl_private_key_filepath = NULL;
	info.gid = -1;
	info.uid = -1;
	info.options = 0;

	context = libwebsocket_create_context(&info);

    
    if (context == NULL) {
        lwsl_notice("libwebsocket init failed\n");
        return FAIL;
    }
    
    lwsl_notice("\n\nStarting Websocket Server on port %i...\n\n", port);
    return SUCCESS;
}


#ifdef DBG
/* main function, for testing purposes */
int main(void) {
     const int max_attempts = 10;
     int i = 0;
     while(i<max_attempts && websocket_open == FALSE) {
        port = initial_port;
        websocket_open = open_websocket();
        initial_port++; /* change port so that a new port can be tried at the next attempt */
	i++;
     }
   
    lwsl_notice("Websocket server started!\n");


     /* dummy update local copy of controller bus to test the GPCA-UI with specific controller states */
    controllerBus.controller_state    = CHANGE_VTBI;
    controllerBus.isBolusInProgress   = 0;
    controllerBus.totalVolumeInfused  = 0;
    controllerBus.remainingVolumeInReservoir = 0;

	signal(SIGINT, close_websocket);
   
    /* infinite loop, to end this server send SIGTERM. (CTRL+C) */
    while (!force_exit) {
        libwebsocket_service(context, 1000);
        /* libwebsocket_service will process all waiting events with their
         * callback functions and then wait 1000 ms.
         * (this is a single threaded webserver and this will keep our server
         * from generating load while there are not requests to process)
	 */
    }
   
    close_websocket();
    return 0;
}
#endif
