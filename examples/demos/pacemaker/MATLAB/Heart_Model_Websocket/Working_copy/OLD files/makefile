all :
	gcc -c -I. websocket_server.c
	gcc -pthread websocket_server.o libwebsockets.dylib

clean:
	rm -f websocket_server.o

