all :
	gcc -c -I. websocket_server.c
	gcc -pthread websocket_server.o libwebsockets.so.4.0.0

clean:
	rm -f websocket_server.o

