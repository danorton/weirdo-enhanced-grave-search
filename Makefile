
.PHONY: all jslint jsdoc clean

all: jsdoc
	make -C ./crx/ $@
  
jslint:
	make -C ./common/js/ $@
	make -C ./crx/js/ $@
	make -C ./crx/ $@
 
jsdoc:
	make -C ./jsdoc/ $@
 
clean:
	make -C ./jsdoc/ $@
	make -C ./dox/ $@
	make -C ./crx/ $@

