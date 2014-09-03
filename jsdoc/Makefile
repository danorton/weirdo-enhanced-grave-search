
JSDOC_CONF=./conf.json
JSDOC=jsdoc
JSDOC_OPT=-c $(JSDOC_CONF)

GJSDOC_OPT=-c=$(JSDOC_CONF)
GJSDOCDIR=~/src/jsdoc_toolkit
GJSDOC=sh $(GJSDOCDIR)/jsrun.sh

.PHONY: all jsdoc clean help test

all: jsdoc

jsdoc:
	rm -fr ./out/
	$(JSDOC) $(JSDOC_OPT) -r .. ../README.md

clean:
	rm -fr ./out/
