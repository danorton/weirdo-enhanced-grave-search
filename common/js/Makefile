
JSLINT=gjslint
JSLINT_OPTS=--strict --max_line_length=90 --custom_jsdoc_tags=module

.PHONY: all jslint clean
SRCS=utils.js injection.js base.js

all: jslint

jslint: $(SRCS)
	$(JSLINT) $(JSLINT_OPTS) $(SRCS)
 
clean:
	true
