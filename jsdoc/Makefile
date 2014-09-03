
JSDOC_CONF=./conf.json
JSDOC=jsdoc
JSDOC_OPT=-c $(JSDOC_CONF)

GJSDOC_OPT=-c=$(JSDOC_CONF)
GJSDOCDIR=~/src/jsdoc_toolkit
GJSDOC=sh $(GJSDOCDIR)/jsrun.sh

INSTALL_DIR=../../danorton.github.io/weirdo-enhanced-grave-search/jsdoc

.PHONY: all jsdoc clean install

all: jsdoc

jsdoc: ./out/index.html

./out/index.html:
	rm -fr ./out/
	$(JSDOC) $(JSDOC_OPT) -r .. ../README.md

clean:
	rm -fr ./out/

$(INSTALL_DIR)/index.html: ./out/index.html
	cp -pr out/* $(INSTALL_DIR)/

install: $(INSTALL_DIR)/index.html
