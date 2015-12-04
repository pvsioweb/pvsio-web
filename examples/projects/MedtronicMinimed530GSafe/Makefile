###---------------------------------------------------------------
#   Model: emucharts_MedtronicMinimed530GSafe_MisraC
#   Author: <author name>
#           <affiliation>
#           <contact>
#  ---------------------------------------------------------------##

NAME = emucharts_MedtronicMinimed530GSafe_MisraC
CC = gcc
CFLAGS = -Wall -O2 -Werror -Wmissing-noreturn -Wpacked -Wunreachable-code
HEAD = emucharts_MedtronicMinimed530GSafe_MisraC.h
SOURCES = emucharts_MedtronicMinimed530GSafe_MisraC.c
OBJ = $(SOURCES:.c=.o)

.PHONY : clean help install uninstall

%.o: %.c $(HEAD)
	@$(CC) $(CFLAGS) -c $< -o $@ 

build: $(NAME)

$(NAME): $(OBJ)
	#@$(CC) $(CFLAGS) $< -o $@
	@echo $(OBJ) "compiled successfully!"

install:
	-@cp ./$(OBJ) /usr/bin
	@echo "Installed"

uninstall:
	-@rm /usr/bin/$(OBJ)
	@echo "Uninstalled"

clean:
	-@rm -rf $(OBJ)
	@echo $(OBJ) "removed successfully!"

help:
	@echo
	@echo "Makefile"
	@echo
	@echo "make/make build  : build all"
	@echo "install          : install tool in the system. Root permission required"
	@echo "uninstall        : remove tool from system. Root permission required"
	@echo "clean            : remove all .o files and executable file"
	@echo "NAME=yourname    : change program name"
	@echo
	@echo  "-------------------------------------------------------------"
	@echo  "  Makefile generated using PVSio-web MisraCPrinter ver 0.1"
	@echo  "  Tool freely available at http:##www.pvsioweb.org"
	@echo  "-------------------------------------------------------------" 
	@echo


### ---------------------------------------------------------------
#   Makefile generated using PVSio-web MisraCPrinter ver 0.1
#   Tool freely available at http:##www.pvsioweb.org
#  --------------------------------------------------------------##

