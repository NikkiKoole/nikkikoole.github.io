;; This is a function copied from stackoverflow to facify #if 0/#else/#endif keywords.
;; The comments are added by myself to make it understandable.
(defun my-c-mode-font-lock-if0 (limit)
  (save-restriction
    (widen)
    (save-excursion
      (goto-char (point-min))
      (let ((depth 0) str start start-depth)
	;; Search #if/#else/#endif using regular expression.
        (while (re-search-forward "^\\s-*#\\s-*\\(if\\|else\\|endif\\)" limit 'move)
          (setq str (match-string 1))
	  ;; Handle #if.
          (if (string= str "if")
              (progn
                (setq depth (1+ depth))
		;; Handle neariest 0.
                (when (and (null start) (looking-at "\\s-+0"))
                  (setq start (match-end 0)
                        start-depth depth)))
	    ;; Handle #else, here we can decorate #if 0->#else block using 'font-lock-comment-face'.
            (when (and start (= depth start-depth))
              (c-put-font-lock-face start (match-beginning 0) 'font-lock-comment-face)
              (setq start nil))
	    ;; Handle #endif, return to upper block if possible.
            (when (string= str "endif")
              (setq depth (1- depth)))))
	;; Corner case when there are only #if 0 (May be you are coding now:))
        (when (and start (> depth 0))
          (c-put-font-lock-face start (point) 'font-lock-comment-face)))))
  nil)
