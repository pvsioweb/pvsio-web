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

struct PACEMAKER_INPUT  pacemaker_input = { 0, 0, 0 };
struct PACEMAKER_OUTPUT pacemaker_output = { 0, 0 };

struct PACEMAKER {
    /* Input */
    double Aget;
    double Vget;
    
    /* Output */
    int SA;
    int AP;
    int VP;
} pacemaker = { 0, 0, 0, 0, 0 };


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
 * to check for new incoming messages from the heart
 */
int WebsocketServer(const double tick,
                    /* input variables */
                    const double Aget,
                    const double Vget,
                    /* output variables */
                    int* AP,
                    int* VP) {
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
    lwsl_notice("updating heart output signals...\n");
    lwsl_notice("Aget := %d, Vget := %d\n", Aget, Vget);
    /* update heart output signals */
    pacemaker.Aget = Aget;
    pacemaker.Vget = Vget;
    
    lwsl_notice("updating heart input signals...\n");
    /* forward pacemaker output signals */
    *AP = pacemaker.AP;
    *VP = pacemaker.VP;
    lwsl_notice("AP := %i, VP := %i\n\n", *AP, *VP);
    
    /**
     * schedule a callback to receive new events from the pacemaker
     * libwebsocket_service will process all waiting events with their
     * callback functions and then wait 512 ms.
     * (this is single threaded webserver and this will keep
     * our server from generating load while there is no
     * request to process)
     */
    if(!force_exit) { libwebsocket_service(context, 512); }
    else { close_websocket(); }
    
    /* always return the port used by the server */
    return port;
}



const int MAX_CMD_LEN = 128;
const int MAX_DIGITS = 8;
const int MAX_LEN = 1024;


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
    lwsl_notice("Field offset %d: \n",offset);
    char keys[] = "1234567890";
    int ans = (int)strtol(fld + strcspn(fld, keys), NULL, 10);
    lwsl_notice("Field %s: %i\n",field, ans);
    return ans;
}

/**
 * functions for websocket extension
 * pointer to `void *in` holds the incomming request
 */
static int callback_heart(struct libwebsocket_context *context,
                          struct libwebsocket *wsi,
                          enum libwebsocket_callback_reasons reason,
                          void *user, void *in, size_t len) {
    
    switch(reason) {
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
            lwsl_notice("Forwarding pacemaker signals to heart: %s\n", (char*) in);
            pacemaker.SA = (pacemaker.SA + 1) % 2;
            pacemaker.AP = parseState((char*) in, "AP");
            pacemaker.VP = parseState((char*) in, "VP");
            
            /* send heart signals to pacemaker */
            char Aget[MAX_DIGITS];
            memset(Aget, 0, MAX_DIGITS);
            snprintf(Aget, MAX_DIGITS, "%5.2f", pacemaker.Aget);
            char Vget[MAX_DIGITS];
            memset(Vget, 0, MAX_DIGITS);
            snprintf(Vget, MAX_DIGITS, "%5.2f", pacemaker.Vget);
            
            char response[MAX_LEN];
            memset(response, 0, MAX_LEN);
            strcat(response,"(# Aget := ");
            strcat(response, Aget);
            strcat(response,", Vget := ");
            strcat(response, Vget);
            strcat(response," #)");
            lwsl_notice("Sending heart signal to pacemaker...\n");
            libwebsocket_write(wsi, &response, MAX_LEN, LWS_WRITE_TEXT);
            
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
            lwsl_notice("LWS_CALLBACK_GET_THREAD_ID\n");
            break;
        }
        default : {
            lwsl_notice("\n\nWarning: Unmanaged Callback Reason! -> %i\n\n", reason);
            break;
        }
    }
    return 0;
}

/* list of supported protocols and callbacks */
static struct libwebsocket_protocols protocols[] = {
    {
        "pacemaker",        /* name */
        callback_heart,     /* callback */
        0,                  /* per_session_data_size */
        0,                  /* max frame size / rx buffer */
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
    //    info.extensions = libwebsocket_get_internal_extensions();
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


///* main function, for testing purposes */
//int main(void) {
//    const int max_attempts = 10;
//    int i = 0;
//    while(i < max_attempts && websocket_open == FALSE) {
//        port = initial_port;
//        websocket_open = open_websocket();
//        initial_port++; /* change port so that a new port can be tried at the next attempt */
//        i++;
//    }
//    
//    lwsl_notice("Websocket server started!\n");
//    
//    
//    /* dummy update local copy of controller bus to test the GPCA-UI with specific controller states */
//    pacemaker.SA = 5;
//    pacemaker.AP = 5;
//    pacemaker.VP = 5;
//    
//    signal(SIGINT, close_websocket);
//    
//    /* infinite loop, to end this server send SIGTERM. (CTRL+C) */
//    while (!force_exit) {
//        libwebsocket_service(context, 1000);
//        /* libwebsocket_service will process all waiting events with their
//         * callback functions and then wait 1000 ms.
//         * (this is a single threaded webserver and this will keep our server
//         * from generating load while there are not requests to process)
//         */
//    }
//    
//    close_websocket();
//    return 0;
//}



/**
 * Function "write_websocket" is used to send data back to the pacemaker
 *
 void write_websocket(struct libwebsocket* wsi, const char* heartOutput) {
 
    char response[MAX_LEN];
    memset(response, 0, MAX_LEN);
    strcpy(response, heartOutput);
    lwsl_notice("Sending heart signal to pacemaker...\n");
    /* send response to the connected client *
    libwebsocket_write(wsi, response, MAX_LEN, LWS_WRITE_TEXT);
 }*/
