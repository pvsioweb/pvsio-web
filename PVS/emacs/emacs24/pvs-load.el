;;;;;;;;;;;;;;;;;;;;;;;;;;; -*- Mode: Emacs-Lisp -*- ;;;;;;;;;;;;;;;;;;;;;;;;;;
;; pvs-load.el -- Loads all the relevant PVS emacs files, and invokes the
;;                PVS image.  Displays the PVS Welcome buffer when done.
;; Author          : Sam Owre
;; Created On      : Fri Dec 17 13:32:31 1993
;; Last Modified By: Sam Owre
;; Last Modified On: Thu May 20 22:44:54 2004
;; Update Count    : 61
;; Status          : Stable
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; --------------------------------------------------------------------
;; PVS
;; Copyright (C) 2006, SRI International.  All Rights Reserved.

;; This program is free software; you can redistribute it and/or
;; modify it under the terms of the GNU General Public License
;; as published by the Free Software Foundation; either version 2
;; of the License, or (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program; if not, write to the Free Software
;; Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
;; --------------------------------------------------------------------

(eval-and-compile (require 'pvs-macros))
(require 'pvs-utils)

;;(find-file-noselect "~/PVS Log" t)
(pvs-log-message 'LOG "Started loading Emacs files")

;; Batch mode ignores the kill-emacs-hook, so there's no chance to save the
;; context using it; but defadvice still seems to work.  No need for this
;; outside of batch mode (noninteractive is set to 't' in that case).
(when noninteractive
  (defadvice kill-emacs (before pvs-batch-control activate protect)
    (exit-pvs-process)))

(if (pvs-getenv "PVSIMAGE")
    (defconst pvs-image (pvs-getenv "PVSIMAGE")
      "The name of the pvs binary image.  Set in pvs-load.el to reflect
       the environment variable PVSIMAGE, set by the pvs shell script")
    (error "PVSIMAGE environment variable must be set"))

(require 'cl)
(require 'comint)
(setq comint-log t)

(unless (fboundp 'comint-mem)
  (fset 'comint-mem 'member))

(load "ilisp" nil noninteractive)
(load "pvs-ilisp" nil noninteractive)
(load "pvs-mode" nil noninteractive)
(load "pvs-view" nil noninteractive)
(load "pvs-file-list" nil noninteractive)
(load "pvs-browser" nil noninteractive)
(load "pvs-utils" nil noninteractive)
(load "pvs-cmds" nil noninteractive)
(condition-case ()
    (load "pvs-prelude-files-and-regions" nil noninteractive)
  (error 0))
(load "pvs-print" nil noninteractive)
(load "pvs-prover" nil noninteractive)
(load "pvs-abbreviations" nil noninteractive)
(if (or (and (not (featurep 'xemacs))
	     (boundp 'emacs-major-version)
	     (or (>= emacs-major-version 20)
		 (and (= emacs-major-version 19)
		      (>= emacs-minor-version 29))))
	(and (featurep 'xemacs)
	     (boundp 'emacs-major-version)
	     (or (>= emacs-major-version 20)
		 (and (= emacs-major-version 19)
		      (>= emacs-minor-version 12)))))
    (load "pvs-menu" nil noninteractive))
(load "pvs-tcl" nil noninteractive)
(load "pvs-prover-helps" nil noninteractive)
(load "pvs-eval" nil noninteractive)
(load "pvs-pvsio" nil noninteractive)
(load "pvs-prover-manip" nil noninteractive) ; Manip
(load "manip-debug-utils" nil noninteractive) ; Manip
;; No Field Emacs extensions
(load "prooflite" nil noninteractive) ; ProofLite

(or (let ((load-path pvs-original-load-path))
      (load "newcomment" t noninteractive))
    (load "newcomment" nil noninteractive))
(put 'comment-region 'pvs-command 'editing)
(global-set-key "\C-c;" 'comment-region)

(defvar pvs-library-path nil)
(if (pvs-getenv "PVS_LIBRARY_PATH")
    (let ((dirs (mapcar '(lambda (dir)
			   (if (= (aref dir (1- (length dir))) ?/)
			       (substring dir 0 (1- (length dir)))
			       dir))
		  (string-split ?: (pvs-getenv "PVS_LIBRARY_PATH")))))
      (setq pvs-library-path dirs)
      (setq load-path
	    (cons (car load-path) (append dirs (cdr load-path))))))

(defpvs report-pvs-bug help ()
  "Sets up mail buffer for reporting PVS bugs."
  (interactive)
  (mail)
  (mail-to) (insert "pvs-bugs@csl.sri.com")
  (mail-subject))

; fancy PVS logo for Emacs startup

(when (and (not (featurep 'xemacs))
	   (boundp 'emacs-major-version)
	   (>= emacs-major-version 20)
	   (boundp 'image-types)
	   (memq 'xpm image-types))
  (setq pvs-logo (create-image (concat pvs-path "/emacs/emacs-src/pvs.xpm"))))

(when (and (featurep 'xemacs)
	   (boundp 'emacs-major-version)
	   (>= emacs-major-version 20)
	   (valid-image-instantiator-format-p 'xpm))
  (push (concat pvs-path "/emacs/emacs-src") x-bitmap-file-path)
  (setq pvs-logo
        (make-glyph (make-image-specifier `[xpm :file "pvs.xpm"])
		    'buffer)))

(defun pvs-welcome (&optional display)
  (let ((cbuf (current-buffer))
	(buf (get-buffer-create "PVS Welcome"))
	(cdir pvs-current-directory)
	(vers (get-pvs-version-information))
	(cpoint (point-min)))
    (set-buffer buf)
    (setq fill-column (window-width))
    (if buffer-read-only (toggle-read-only))    
    (erase-buffer)
    (if (boundp 'pvs-logo)
	(progn
	  (insert "\n\n")
	  (cond ((featurep 'xemacs)
		 (indent-to (startup-center-spaces pvs-logo))
		 (set-extent-begin-glyph (make-extent (point) (point)) pvs-logo))
		(t (insert "           ")
		   (insert-image pvs-logo)
		   (setq cpoint (1+ (point)))))
	  (insert "\n"))
        (progn
	  (insert "\n\nSRI International\nComputer Science Laboratory")
          (insert "\n\n
            +----------------------------------------+
            |                                        |
            |  PPPPPPPP    VVV     VVV    SSSSSSSS   |
	    |  PPPPPPPPP   VVV     VVV   SSSSSSSSSS  |
	    |  PPP    PPP  VVV     VVV   SSS     SS  |
	    |  PPP    PPP  VVV     VVV   SSS         |
	    |  PPP    PPP  VVV     VVV   SSS         |
	    |  PPP    PPP  VVV     VVV   SSS         |
	    |  PPPPPPPPP   VVV     VVV   SSSSSSSSS   |
	    |  PPPPPPPP    VVV     VVV    SSSSSSSSS  |
	    |  PPP         VVV     VVV          SSS  |
	    |  PPP         VVV     VVV          SSS  |
	    |  PPP          VVV   VVV           SSS  |
	    |  PPP           VVV VVV     SS     SSS  |
	    |  PPP            VVVVV      SSSSSSSSSS  |
	    |  PPP             VVV        SSSSSSSS   |
            |                                        |
            +----------------------------------------+")
          (insert "\n\nWelcome to the PVS\nSpecification and Verification System")))
    (setq pvs-welcome-point (point))
    (insert "\n\nType C-c h for a summary of the commands.")
    (put-text-property pvs-welcome-point (point) 'face 'blue)
    (setq pvs-welcome-point (point))
    (insert "\n\nYour current working context is\n" cdir)
    (put-text-property pvs-welcome-point (point) 'face 'red)
    (setq pvs-welcome-point (point))
    (insert "\n\nUse M-x change-context to move to a different context.")
    (insert "\n\n-----------------------------------------------------------------")
    (insert "\n\n" (pvs-version-string))
    (put-text-property pvs-welcome-point (point) 'face 'blue)
    (insert "\n\nPlease check our website periodically for news of later versions")
    (insert "\nat http://pvs.csl.sri.com/")
    (insert "\n\n" (cadr (cdddr vers)) "\n" (cadr (cddddr vers)))
    (insert "
   ----------
   Bug reports and suggestions for improvement should be sent to
   pvs-bugs@csl.sri.com
   ----------
   Questions may be sent to pvs-help@csl.sri.com; for details send
   a message to pvs-help-request@csl.sri.com with Subject: help
   ----------
   If you wish to get on the PVS mailing list, send a request to
   pvs-request@csl.sri.com")
    (insert "\n\n-----------------------------------------------------------------")
    (insert "\n
    Use of PVS(TM)  (Prototype Verification System) is subject to the
   terms and conditions of the Software License Agreement between SRI
   and the user of the Software.  Note in particular that PVS IS
   PROVIDED ``AS IS'', AND SRI EXPRESSLY DISCLAIMS ALL REPRESENTATIONS
   AND WARRANTIES REGARDING THE SOFTWARE AND DOCUMENTATION, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY OF NONINFRINGEMENT,
   MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE.")
    (put-text-property pvs-welcome-point (point) 'face 'blue)
    (setq pvs-welcome-point (point))
    (condition-case ()
	(center-region cpoint (point))
      (error nil))
    (set-buffer-modified-p nil)
    (text-mode)
    (cd cdir)
    (toggle-read-only)
    (goto-char (point-min))
    (if display
       (switch-to-buffer buf)
       (set-buffer cbuf))
    buf))

(defun dont-kill-pvs-buffer ()
  (if (yes-or-no-p "Killing the *pvs* buffer causes PVS to die.  Really kill? ")
      (message "Type M-x pvs to restart PVS")
      (keyboard-quit)))

(defpvs pvs environment ()
  "Starts the PVS process

The pvs command starts the pvs lisp process.  This is useful if the Lisp
process has died for some reason, and you wish to keep using the same
Emacs session.  Note that you will still need to retypecheck your files to
get to the same state."
  (interactive)
  (if (and ilisp-buffer
	   (get-buffer ilisp-buffer)
	   (ilisp-process))
      (error "PVS is already running")
      (setq debug-on-error t)
      (setq window-min-height 2)
      (when current-prefix-arg
	(let ((num (prefix-numeric-value current-prefix-arg)))
	  (if (and (<= 0 num) (<= num 3))
	      (setenv "PVSPATCHLEVEL" num)
	      (message "Illegal patchlevel number - %s" num)))
	(setq current-prefix-arg nil))
      (save-excursion
	(set-buffer (get-buffer-create "PVS Log"))
	(pvs-view-mode))
      (unless noninteractive
	(message "Initializing PVS: please wait..."))
      (save-excursion
	(setq pvs-initialized nil)
	(pvs-init)
	(while (and (not (equal (simple-status-pvs) "Done"))
		    (equal (process-status (ilisp-process)) 'run))
	  (accept-process-output (ilisp-process))))
      (unless (equal (process-status (ilisp-process)) 'run)
	(switch-to-buffer "*pvs*")
	(error "Could not run PVS"))
      (save-excursion
	(set-buffer (get-buffer "*pvs*"))
	(make-local-variable 'kill-buffer-hook)
	(setq kill-buffer-hook (list 'dont-kill-pvs-buffer))
	(set-syntax-table pvs-mode-syntax-table)
	(goto-char (point-min))
	(let ((errst (re-search-forward "^Error executing \\(.*\\):$" nil t)))
	  (when errst
	    (switch-to-buffer "*pvs*")
	    (message "Problem in loading user lisp files or evaluating forms"))))
      (load (format "patch%d" (pvs-major-version-number)) t t)
      (setq debug-on-error nil)
      (setq *pvs-version-information* nil)
      ;; sets pvs-current-directory and pops up the welcome buffer
      (condition-case ()
	  (init-change-context pvs-current-directory)
	(quit nil))
      (setq pvs-in-checker nil)
      (setq pvs-in-evaluator nil)
      (unless noninteractive
	(pvs-auto-set-linelength (selected-frame))
	(pvs-welcome (equal (buffer-name) "*scratch*")))
      (when (boundp 'save-options-file)
	(setq save-options-file "~/.pvsxemacs-options")
	(setq save-options-init-file "~/.pvsemacs"))
      (when (and (file-exists-p "~/.pvsemacs")
		 (not (pvs-getenv "PVSMINUSQ")))
	(load "~/.pvsemacs"))
      (run-hooks 'change-context-hook)
      (if (pvs-buffer-file-name)
	  (pvs-mode)
	  (unless noninteractive
	    (if (equal (buffer-name) "*pvs*")
		(goto-char (point-max))
		(switch-to-buffer (get-buffer-create "PVS Welcome")))))
      (unless noninteractive
	(message "Ready"))))

(pvs)
