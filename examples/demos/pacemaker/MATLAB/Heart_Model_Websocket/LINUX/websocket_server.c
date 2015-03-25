#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#include "websocket_server.h"
#include "signal.h"


#include "pacemaker.h"

/* the server url will be http://localhost:XXXX */
int port = 0;
int initial_port = 2317;

#define TRUE    1
#define FALSE   0
#define SUCCESS 1
#define FAIL    0

int websocket_open = FALSE;
struct libwebsocket_context *context;

enum libwebsocket_callback_reasons callback_reason;
void* callback_in;
struct libwebsocket* callback_wsi;


int force_exit = 0;

#define MAX_CMD_LEN 128
#define MAX_DIGITS 8
#define MAX_LEN 1024


/**
 * detecting whether base is starts with str
 */
bool startsWith (char* base, char* str) {
    return (strstr(base, str) - base) == 0;
}
/**
 * detecting whether base is ends with str
 */
bool endsWith (char* base, char* str) {
    int blen = (int)strlen(base);
    int slen = (int)strlen(str);
    return (blen >= slen) && (0 == strcmp(base + blen - slen, str));
}
/**
 * getting the first index of str in base
 */
int indexOf (char* base, char* str) {
    return indexOf_shift(base, str, 0);
}
int indexOf_shift (char* base, char* str, int startIndex) {
    int result;
    int baselen = (int)strlen(base);
    if (strlen(str) > baselen || startIndex > baselen) {
        result = -1;
    } else {
        if (startIndex < 0 ) {
            startIndex = 0;
        }
        char* pos = strstr(base+startIndex, str);
        if (pos == NULL) {
            result = -1;
        } else {
            result = (int)(pos - base);
        }
    }
    return result;
}
/**
 * use two index to search in two part to prevent the worst case
 * (assume search 'aaa' in 'aaaaaaaa', you cannot skip three char each time)
 */
int lastIndexOf (char* base, char* str) {
    int result;
    if (strlen(str) > strlen(base)) {
        result = -1;
    } else {
        int start = 0;
        int endinit = (int)(strlen(base) - strlen(str));
        int end = endinit;
        int endtmp = endinit;
        while(start != end) {
            start = indexOf_shift(base, str, start);
            end = indexOf_shift(base, str, end);
            
            /* not found from start */
            if (start == -1) {
                end = -1; /* then break; */
            } else if (end == -1) {
                /* found from start
                 * but not found from end
                 * move end to middle
                 */
                if (endtmp == (start+1)) {
                    end = start; /* then break; */
                } else {
                    end = endtmp - (endtmp - start) / 2;
                    if (end <= start) {
                        end = start+1;
                    }
                    endtmp = end;
                }
            } else {
                /* found from both start and end
                 * move start to end and
                 * move end to base - strlen(str)
                 */
                start = end;
                end = endinit;
            }
        }
        result = start;
    }
    return result;
}

int parseState(char* state, char* field) {
    int offset = indexOf(state, field);
    char* fld = state + offset;
    char keys[] = "1234567890";
    int ans = (int)strtol(fld + strcspn(fld, keys), NULL, 10);
    return ans;
}

void sighandler(int sig) {
    force_exit = 1;
}

/**
 * websocket callback function
 * functions for websocket extension
 * pointer to `void *in` holds the incomming request
 */
static int WebSocketCallback(struct libwebsocket_context *context,
                             struct libwebsocket *wsi,
                             enum libwebsocket_callback_reasons reason,
                             void *user, void *in, size_t len) {
    
    callback_reason = reason;
    callback_in = in;
    callback_wsi = wsi;
    
    return 0;
}

/* list of supported protocols and callbacks */
static struct libwebsocket_protocols protocols[] = {
    {
        "pacemaker",        /* name */
        WebSocketCallback,     /* callback */
        0,                  /* per_session_data_size */
        0,                  /* max frame size / rx buffer */
    },
    {
        NULL, NULL, 0, 0   /* End of list */
    }
};

int open_websocket(){
    
    const char *interface = NULL; /* NULL means "all interfaces" */
    
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

void close_websocket() {
    libwebsocket_context_destroy(context);
    websocket_open = FALSE;
    lwsl_notice("libwebsockets-test-echo exited cleanly\n");
}

/**
 * Periodically invoked by Simulink
 * to check for new incoming messages from the heart
 * Forwards: PVS_state -> Heart (AP, VP)
 * Update:   Heart -> PVS_state (Aget, Vget)
 */
int WebsocketServer(
                    /* input variables */
                    const double Aget,
                    const double Vget,
                    /* output variables */
                    int* AP,
                    int* VP) {
    
    lwsl_notice("\n\n~~~~~~ BLOCK STARTED ~~~~~~\n\n");
    
    /* Open Websocket */
    if(websocket_open == FALSE) {
        port = initial_port;
        websocket_open = open_websocket();
        if(websocket_open == FALSE) {
            initial_port++; /* change port so that a new port can be tried at the next attempt */
        }
        else {
            lwsl_notice("\n\n~~~~~~ WEBSOCKET OPENED, SENDING SIGINT ~~~~~~\n\n");
            signal(SIGINT, sighandler); /* allows a clean exit */
        }
        lwsl_notice("\n\n~~~~~~ RETURNING PORT ~~~~~~\n\n");
        return port;
    }
    
    /* Keep the websocket live */
    if(!force_exit) {
        lwsl_notice("\n\n~~~~~~ STARTING SERVICE ~~~~~~\n\n");
        libwebsocket_service(context, 10000);
        lwsl_notice("\n\n~~~~~~ RETURNING FROM SERVICE ~~~~~~\n\n");
        
        /* Callback */
        
        switch(callback_reason) {
                
            case LWS_CALLBACK_ESTABLISHED:{
                lwsl_notice("**********************************************\n");
                lwsl_notice("***          Pacemaker Connected!         ****\n");
                lwsl_notice("**********************************************\n");
                break;
            }
            case LWS_CALLBACK_CLOSED:{
                lwsl_notice("\n\nWarning: Pacemaker disconnected!\n\n");
                break;
            }
            case LWS_CALLBACK_RECEIVE: {
                lwsl_notice("\n\nLWS_CALLBACK_RECEIVE\n");
                
                if(startsWith(callback_in, "0")){
                    /* SENSING */
                    
                    /* send heart signals to pacemaker */
                    char Aget_c[MAX_DIGITS];
                    memset(Aget_c, 0, MAX_DIGITS);
                    snprintf(Aget_c, MAX_DIGITS, "%5.2f", Aget);
                    char Vget_c[MAX_DIGITS];
                    memset(Vget_c, 0, MAX_DIGITS);
                    snprintf(Vget_c, MAX_DIGITS, "%5.2f", Vget);
                    unsigned char response[MAX_LEN];
                    memset(response, 0, MAX_LEN);
                    strcat((char*)response,"(# Aget:= ");
                    strcat((char*)response, Aget_c);
                    strcat((char*)response,", Vget:= ");
                    strcat((char*)response, Vget_c);
                    strcat((char*)response," #)");
                    lwsl_notice("Sending real time heart signal to pacemaker...\n");
                    lwsl_notice("response := %s\n", response);
                    libwebsocket_write(callback_wsi, response, MAX_LEN, LWS_WRITE_TEXT);
                    
                }
                else{
                    /* PACING */
                    
                    lwsl_notice("Forwarding pacemaker signals to the heart: %s\n", (char*) callback_in);
                    *AP = parseState((char*) callback_in, "AP");
                    *VP = parseState((char*) callback_in, "VP");
                    lwsl_notice("Signals forwarded -> AP := %i, VP := %i\n\n", *AP, *VP);
                    
                }
                
                break;
            }
            case LWS_CALLBACK_HTTP:{
                lwsl_notice("LWS_CALLBACK_HTTP\n");
                break;
            }
            case LWS_CALLBACK_LOCK_POLL:{
                lwsl_notice("LWS_CALLBACK_LOCK_POLL\n");
                break;
            }
            case LWS_CALLBACK_ADD_POLL_FD:{
                lwsl_notice("LWS_CALLBACK_ADD_POLL_FD\n");
                break;
            }
            case LWS_CALLBACK_UNLOCK_POLL:{
                lwsl_notice("LWS_CALLBACK_UNLOCK_POLL\n");
                break;
            }
            case LWS_CALLBACK_PROTOCOL_INIT:{
                lwsl_notice("LWS_CALLBACK_PROTOCOL_INIT\n");
                break;
            }
            case LWS_CALLBACK_GET_THREAD_ID:{
                lwsl_notice("\n\n~~~~~~ TIMOUT ~~~~~~\n\n");
                lwsl_notice("LWS_CALLBACK_GET_THREAD_ID\n");
                break;
            }
            case LWS_CALLBACK_WSI_DESTROY:{
                lwsl_notice("\n\nTimeout Happened -> %i\nRestarting service\n\n", callback_reason);
                break;
            }
            default : {
                lwsl_notice("\n\nWarning: Unmanaged Callback Reason! -> %i\n\n", callback_reason);
                break;
            }
        }
        /* Restarting the service */

    }
    else {
        close_websocket();
    }
    lwsl_notice("\n\n~~~~~~ BLOCK END RETURNING PORT ~~~~~~\n\n");
    /* always return the port used by the server */
    return port;
}


/* main function, for testing purposes
int main(void) {
   const int max_attempts = 10;
   int i = 0;
   while(i < max_attempts && websocket_open == FALSE) {
       port = initial_port;
       websocket_open = open_websocket();
       initial_port++; 
       i++;
   }
   
   lwsl_notice("Websocket server started!\n");
   
   signal(SIGINT, close_websocket);
   
   while (!force_exit) {
       
       int a = 7;
       int b = 8;
       WebsocketServer(1,5,6,&a,&b,0);
       
   }
   
   close_websocket();
   return 0;
}
*/

