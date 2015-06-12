
;;; loading packages, repos and custom files
;;; ****************************************


(require 'package)
(add-to-list 'package-archives
    '("marmalade" .
      "http://marmalade-repo.org/packages/"))
(package-initialize)

(add-to-list 'load-path (expand-file-name "~/.emacs.d/lisp"))
(load "~/.emacs.d/lisp/custom_nikki")


;; variables set with customize* system
;; ***************************

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(background-color "#fcf4dc")
 '(background-mode light)
 '(cursor-color "#52676f")
 '(custom-enabled-themes (quote (base16-chalk)))
 '(custom-safe-themes (quote ("be52c3b91044b3765d60cb0ac6a914f03b46e07d81238f0c37434ccaff7ca37c" "1e7e097ec8cb1f8c3a912d7e1e0331caeed49fef6cff220be63bd2a6ba4cc365" "fc5fcb6f1f1c1bc01305694c59a1a861b008c534cae8d0e48e4d5e81ad718bc6" default)))
 '(foreground-color "#52676f")

 '(custom-enabled-themes (quote (base16-chalk)))
 '(custom-safe-themes (quote ("be52c3b91044b3765d60cb0ac6a914f03b46e07d81238f0c37434ccaff7ca37c" "35fd261587b381d98c7ad693e4fc85a08b4769e5288c75b69e35e806f6c42574" "9bac44c2b4dfbb723906b8c491ec06801feb57aa60448d047dbfdbd1a8650897" "51bea7765ddaee2aac2983fac8099ec7d62dff47b708aa3595ad29899e9e9e44" default))) )


(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:inherit nil :stipple nil :inverse-video nil :box nil :strike-through nil :overline nil :underline nil :slant normal :weight normal :height 180 :width normal :family "Menlo"))))
 '(hl-line ((t (:inherit highlight :background "DeepSkyBlue4")))))


;;; C development
;;; *************************

(defun my-c-mode-common-hook ()
  (font-lock-add-keywords
   nil
   '((my-c-mode-font-lock-if0 (0 font-lock-comment-face prepend))) 'add-to-end))
(add-hook 'c-mode-common-hook 'my-c-mode-common-hook)

(setq-default c-basic-offset 4)



;; Javascript (es6), Coffeescript, Livescript, JSX
;; ***********************************************

(eval-after-load "coffee-mode"
  '(progn
     (define-key coffee-mode-map [(meta r)] 'coffee-compile-buffer)
     (define-key coffee-mode-map (kbd "C-j") 'coffee-newline-and-indent)))
(setq coffee-tab-width 4)
(setq coffee-args-compile (quote ("-c" "--bare")))

(require 'flymake-coffee)
(add-to-list 'load-path "~/.emacs.d/livescript-mode")
(add-hook 'coffee-mode-hook 'flymake-coffee-load)

(require 'flymake-jshint)
(add-hook 'js-mode-hook 'flymake-jshint-load)

(require 'livescript-mode)
(define-key livescript-mode-map "\C-c\C-l" 'livescript-compile-buffer)

(add-to-list 'auto-mode-alist '("\\.js\\'" . js2-mode))
(setq js2-global-externs (list "require" "it" "describe"))

(add-to-list 'auto-mode-alist '("\\.jsx\\'" . jsx-mode))
(autoload 'jsx-mode "jsx-mode" "JSX mode" t)


;; default setup for all languages..
;; ******************************************

(global-hl-line-mode 1)
(show-paren-mode 1)
(tool-bar-mode -1)

(set-face-attribute 'region nil :background "#66")
(setq-default indent-tabs-mode nil)
(setq-default tab-width 4)
(setq indent-line-function 'insert-tab)
(setq show-trailing-whitespace t)
(add-hook 'before-save-hook 'delete-trailing-whitespace)
(global-set-key (kbd "<escape>")      'keyboard-escape-quit)

(autoload 'smex "smex"
  "Smex is a M-x enhancement for Emacs, it provides a convenient interface to
your recently and most frequently used commands.")

(global-set-key (kbd "M-x") 'smex)

(setq org-completion-use-ido t)
(setq make-backup-files nil) ; stop creating those backup~ files
(setq auto-save-default nil) ; stop creating those #autosave# files


;; setting PATH
(when (memq window-system '(mac ns))
  (exec-path-from-shell-initialize))

;; setting default directory
(setq command-line-default-directory "~/")

;; markdown
(add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))

;; cider / clojurescript
(add-hook 'cider-mode-hook 'cider-turn-on-eldoc-mode)

;; ido
(setq ido-enable-flex-matching t)
(setq ido-everywhere t)
(ido-mode 1)

;;uniquify
(require 'uniquify)
(setq uniquify-buffer-name-style 'forward)

(require 'idomenu)
