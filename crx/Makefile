# © 2014 Weirdosoft

COPYRIGHT_NOTICE=© 2014 Daniel Norton d/b/a Weirdosoft
 

DCODEIO_CLOSURE_COMPILER=${HOME}/node_modules/closurecompiler
GOOG_CLOSURE_COMPILER=${HOME}/git/github/google/closure-compiler
JAVA=$(DCODEIO_CLOSURE_COMPILER)/jre/bin/java
PYTHON=python

DCODEIO_CLOSURE_COMPILER_BIN=$(DCODEIO_CLOSURE_COMPILER)/bin/ccjs
DCODEIO_CLOSURE_COMPILER_JAR=$(DCODEIO_CLOSURE_COMPILER)/compiler/compiler.jar

GOOG_CLOSURE_LIB=${HOME}/git/github/google/closure-library

CCJS=$(JAVA) -jar $(DCODEIO_CLOSURE_COMPILER_JAR)

GOOG_CLOSURE_BUILDER=$(PYTHON) $(GOOG_CLOSURE_LIB)/closure/bin/build/closurebuilder.py

GOOG_CLOSURE_LIB_JS=$(GOOG_CLOSURE_LIB)/closure/goog
GOOG_CLOSURE_LIB_JS_THIRD_PARTY=$(GOOG_CLOSURE_LIB)/third_party/closure/goog

GOOG_CLOSURE_BUILDER_OPTS=\
  --root=./js \
  --root=../common/js \
  --root=$(GOOG_CLOSURE_LIB_JS_THIRD_PARTY) \
  --root=$(GOOG_CLOSURE_LIB_JS)

CCJS_OPTS=\
  --language_in=ECMASCRIPT5_STRICT \
  --compilation_level=ADVANCED
CCJS_OPTS:=$(CCJS_OPTS) --externs=externs.js
CCJS_OPTS:=$(CCJS_OPTS) --externs=$(GOOG_CLOSURE_COMPILER)/contrib/externs/chrome_extensions.js
CCJS_OPTS:=$(CCJS_OPTS) --externs=$(GOOG_CLOSURE_COMPILER)/contrib/externs/w3c_eventsource.js
CCJS_OPTS:=$(CCJS_OPTS) -D=WEIRD_NOCONSOLE=1
CCJS_OPTS:=$(CCJS_OPTS) -D=goog.DEBUG=1
#CCJS_OPTS:=$(CCJS_OPTS) --formatting=PRETTY_PRINT

CCJS_OPTS_UNCOMPRESSED=$(CCJS_OPTS) --formatting=PRETTY_PRINT --compilation_level=WHITESPACE_ONLY
ICONS=\
  19px-icon.png \
  19px-icon-disabled.png \
  24px-icon.png \
  24px-icon-disabled.png \
  32px-icon.png \
  38px-icon.png \
  38px-icon-disabled.png \
  48px-icon.png \
  128px-icon.png

CRX_FILES=\
  $(ICONS) \
  popup.html \
  popup.js \
  injection.js \
  manifest.json \
  background.js \
  128px-icon.png \
  19px-icon.png

JSLINT=gjslint
JSLINT_OPTS=--strict

BACKGROUND_SRC=globals.js
BACKGROUND_SRC:=$(BACKGROUND_SRC) $(shell $(GOOG_CLOSURE_BUILDER) $(GOOG_CLOSURE_BUILDER_OPTS) --namespace=weird.EnhancedGravesBackground)

INJECTION_SRC=globals.js
INJECTION_SRC:=$(INJECTION_SRC) $(shell $(GOOG_CLOSURE_BUILDER) $(GOOG_CLOSURE_BUILDER_OPTS) --namespace=weird.EnhancedGravesInjection)

POPUP_SRC=globals.js
POPUP_SRC:=$(POPUP_SRC) $(shell $(GOOG_CLOSURE_BUILDER) $(GOOG_CLOSURE_BUILDER_OPTS) --namespace=weird.EnhancedGravesPopup)


DEBUG_FILES=\
  injection.uncompressed.js injection.cat.js \
  background.uncompressed.js background.cat.js \
  popup.uncompressed.js popup.cat.js


.PHONY: all clean debug crx ccjs-help jslint zip testzip

all: crx zip debug testzip

clean:
	rm -vf *.zip injection*.js popup*.js background*.js *.png *.tmp *.html
	rm -fr tmp/

jslint: globals.js externs.js
	$(JSLINT) $(JSLINT_OPTS) globals.js externs.js
	make -C js $@
	make -C ../common/js $@

ccjs-help:
	$(CCJS) --help 2>&1 | less

zip: crx.enhanced-grave-search.zip

debug: $(DEBUG_FILES)

crx: $(CRX_FILES)

crx.enhanced-grave-search.zip: $(CRX_FILES)
	zip $@ $(CRX_FILES)

injection.compressed.js: $(INJECTION_SRC) jslint
	test "$(INJECTION_SRC)" # INJECTION_SRC
	$(CCJS) $(INJECTION_SRC) $(CCJS_OPTS) > $@.tmp
	test -s $@.tmp || rm -f $@.tmp
	test -s $@.tmp
	echo "// $(COPYRIGHT_NOTICE)" > $@
	cat $@.tmp >> $@
	rm $@.tmp
 
injection.uncompressed.js: $(INJECTION_SRC) jslint
	test "$(INJECTION_SRC)" # INJECTION_SRC
	$(CCJS) $(INJECTION_SRC) $(CCJS_OPTS_UNCOMPRESSED) > $@.tmp
	test -s $@.tmp || rm -f $@.tmp
	test -s $@.tmp
	echo "// $(COPYRIGHT_NOTICE)" > $@
	cat $@.tmp >> $@
	rm $@.tmp
 
injection.cat.js: $(INJECTION_SRC) jslint
	test "$(INJECTION_SRC)" # INJECTION_SRC
	cat $(INJECTION_SRC) > $@
 
#injection.js: injection.cat.js
#injection.js: injection.uncompressed.js
injection.js: injection.compressed.js
	test -s $<
	cp $< $@

background.compressed.js: $(BACKGROUND_SRC) externs.js jslint
	test "$(BACKGROUND_SRC)" # BACKGROUND_SRC
	$(CCJS) $(BACKGROUND_SRC) $(CCJS_OPTS) > $@.tmp
	test -s $@.tmp || rm -f $@.tmp
	test -s $@.tmp
	echo "// $(COPYRIGHT_NOTICE)" > $@
	cat $@.tmp >> $@
	rm $@.tmp
 
background.uncompressed.js: $(BACKGROUND_SRC) externs.js jslint
	test "$(BACKGROUND_SRC)" # BACKGROUND_SRC
	$(CCJS) $(BACKGROUND_SRC) $(CCJS_OPTS_UNCOMPRESSED) > $@.tmp
	test -s $@.tmp || rm -f $@.tmp
	test -s $@.tmp
	echo "// $(COPYRIGHT_NOTICE)" > $@
	cat $@.tmp >> $@
	rm $@.tmp
 
background.cat.js: $(BACKGROUND_SRC) jslint
	test "$(BACKGROUND_SRC)" # BACKGROUND_SRC
	cat $(BACKGROUND_SRC) > $@
 
#background.js: background.cat.js
#background.js: background.uncompressed.js
background.js: background.compressed.js
	test -s $<
	cp $< $@

19px-icon.png: ../assets/19px-blank_headstone.png
	cp $^ $@

19px-icon-disabled.png: ../assets/19px-blank_headstone_gray.png
	cp $^ $@

24px-icon.png: ../assets/24px-blank_headstone.png
	cp $^ $@

24px-icon-disabled.png: ../assets/24px-blank_headstone_gray.png
	cp $^ $@

32px-icon.png: ../assets/32px-blank_headstone.png
	cp $^ $@

38px-icon.png: ../assets/38px-blank_headstone.png
	cp $^ $@

38px-icon-disabled.png: ../assets/38px-blank_headstone_gray.png
	cp $^ $@

48px-icon.png: ../assets/48px-blank_headstone.png
	cp $^ $@

128px-icon.png: ../assets/128px-blank_headstone_trim.png
	cp $^ $@


popup.html: html/popup.html
	cp $^ $@

popup.compressed.js: $(POPUP_SRC) jslint
	test "$(POPUP_SRC)" # POPUP_SRC
	$(CCJS) $(POPUP_SRC) $(CCJS_OPTS) > $@.tmp
	test -s $@.tmp || rm -f $@.tmp
	test -s $@.tmp
	echo "// $(COPYRIGHT_NOTICE)" > $@
	cat $@.tmp >> $@
	rm $@.tmp
 
popup.uncompressed.js: $(POPUP_SRC) jslint
	test "$(POPUP_SRC)" # POPUP_SRC
	$(CCJS) $(POPUP_SRC) $(CCJS_OPTS_UNCOMPRESSED) > $@.tmp
	test -s $@.tmp || rm -f $@.tmp
	test -s $@.tmp
	echo "// $(COPYRIGHT_NOTICE)" > $@
	cat $@.tmp >> $@
	rm $@.tmp
 
popup.cat.js: $(POPUP_SRC) jslint
	test "$(POPUP_SRC)" # POPUP_SRC
	cat $(POPUP_SRC) > $@
 
#popup.js: popup.cat.js
#popup.js: popup.uncompressed.js
popup.js: popup.compressed.js
	test -s $<
	cp $< $@

testzip: crx.enhanced-grave-search.zip
	rm -fr tmp/testzip
	mkdir -p tmp/testzip
	( cd tmp/testzip ; unzip ../../$< )
