
JSLINT=gjslint
JSLINT_OPTS=--strict --max_line_length=90

.PHONY: all jslint clean
SRCS=hooks.js base.js icon.js

all: jslint

jslint: $(SRCS)
	$(JSLINT) $(JSLINT_OPTS) $(SRCS)

clean:
	true
