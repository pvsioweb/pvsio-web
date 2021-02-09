all:
	npm install
	make build

pvsioweb: build

compile:
	npm run build

build:
	make compile
	make copy
	make bundle

bundle:
	npm run webpack

devel:
	npm run devel
	make copy

copy:
	-cp src/client/*.html dist/client
	-cp src/client/*.ico dist/client
	-cp src/client/*.json dist/client

	-cp -r src/client/app/plugins/*.json dist/client/app/plugins/

	make copy-css
	make copy-handlebars
	make examples
	-cd dist/client && npm install

examples:
	rsync -av --exclude='*.ts' src/examples dist/

copy-css:
	-cp -r src/client/css dist/client
	-cp src/client/app/plugins/graphbuilder/*.css dist/client/app/plugins/graphbuilder/

copy-handlebars:
	-cp src/client/app/util/*.handlebars dist/client/app/util/

	-mkdir -p  dist/client/app/util/forms/templates
	-cp src/client/app/util/forms/templates/*.handlebars dist/client/app/util/forms/templates/

	-cp src/client/app/project/forms/*.handlebars dist/client/app/project/forms/
	
	-mkdir -p  dist/client/app/project/forms/templates
	-cp src/client/app/project/forms/templates/*.handlebars dist/client/app/project/forms/templates/
	
	-mkdir -p  dist/client/app/plugins/prototypebuilder/forms/templates
	-cp src/client/app/plugins/prototypebuilder/forms/templates/*.handlebars dist/client/app/plugins/prototypebuilder/forms/templates/
	
	-mkdir -p  dist/client/app/plugins/emulink/forms
	-cp src/client/app/plugins/emulink/forms/*.handlebars dist/client/app/plugins/emulink/forms/
	
	-mkdir -p  dist/client/app/plugins/emulink/forms/templates
	-cp src/client/app/plugins/emulink/forms/templates/*.handlebars dist/client/app/plugins/emulink/forms/templates/

	-mkdir -p  dist/client/app/plugins/emulink/tools/propertytemplates
	-cp src/client/app/plugins/emulink/tools/propertytemplates/*.handlebars dist/client/app/plugins/emulink/tools/propertytemplates/
	-cp -r src/client/app/plugins/emulink/tools/propertytemplates/consistency dist/client/app/plugins/emulink/tools/propertytemplates/consistency
	-cp -r src/client/app/plugins/emulink/tools/propertytemplates/feedback dist/client/app/plugins/emulink/tools/propertytemplates/feedback
	-cp -r src/client/app/plugins/emulink/tools/propertytemplates/reversibility dist/client/app/plugins/emulink/tools/propertytemplates/reversibility
	-cp -r src/client/app/plugins/emulink/tools/handlebars-forms dist/client/app/plugins/emulink/tools/handlebars-forms
	-cp -r src/client/app/plugins/emulink/tools/tables dist/client/app/plugins/emulink/tools/tables
	-mkdir -p dist/client/app/plugins/emulink/models/ada
	-cp -r src/client/app/plugins/emulink/models/ada/templates dist/client/app/plugins/emulink/models/ada/templates
	-mkdir -p dist/client/app/plugins/emulink/models/alloy
	-cp -r src/client/app/plugins/emulink/models/alloy/templates dist/client/app/plugins/emulink/models/alloy/templates
	-mkdir -p dist/client/app/plugins/emulink/models/android
	-cp -r src/client/app/plugins/emulink/models/android/templates dist/client/app/plugins/emulink/models/android/templates
	-mkdir -p dist/client/app/plugins/emulink/models/bless
	-cp -r src/client/app/plugins/emulink/models/bless/templates dist/client/app/plugins/emulink/models/bless/templates
	-mkdir -p dist/client/app/plugins/emulink/models/circus
	-cp -r src/client/app/plugins/emulink/models/circus/templates dist/client/app/plugins/emulink/models/circus/templates
	-mkdir -p dist/client/app/plugins/emulink/models/fmi-pvs
	-cp -r src/client/app/plugins/emulink/models/fmi-pvs/templates dist/client/app/plugins/emulink/models/fmi-pvs/templates
	-cp -r src/client/app/plugins/emulink/models/fmi-pvs/lib dist/client/app/plugins/emulink/models/fmi-pvs/lib
	-mkdir -p dist/client/app/plugins/emulink/models/javascript
	-cp -r src/client/app/plugins/emulink/models/javascript/templates dist/client/app/plugins/emulink/models/javascript/templates
	-mkdir -p dist/client/app/plugins/emulink/models/misraC
	-cp -r src/client/app/plugins/emulink/models/misraC/templates dist/client/app/plugins/emulink/models/misraC/templates
	-mkdir -p dist/client/app/plugins/emulink/models/nuxmv
	-cp -r src/client/app/plugins/emulink/models/nuxmv/templates dist/client/app/plugins/emulink/models/nuxmv/templates
	-mkdir -p dist/client/app/plugins/emulink/models/pim/forms/templates
	-cp src/client/app/plugins/emulink/models/pim/forms/templates/*.handlebars dist/client/app/plugins/emulink/models/pim/forms/templates

	-mkdir -p dist/client/app/plugins/emulink/models/pvs
	-cp -r src/client/app/plugins/emulink/models/pvs/templates dist/client/app/plugins/emulink/models/pvs/templates
	-mkdir -p dist/client/app/plugins/emulink/models/vdm
	-cp -r src/client/app/plugins/emulink/models/vdm/templates dist/client/app/plugins/emulink/models/vdm/templates

	-mkdir -p  dist/client/app/plugins/emulink/tools/emuchartselector
	-cp src/client/app/plugins/emulink/tools/emuchartselector/*.handlebars dist/client/app/plugins/emulink/tools/emuchartselector/

	-mkdir -p  dist/client/app/plugins/pimPrototyper/forms/templates
	-cp src/client/app/plugins/pimPrototyper/forms/templates/*.handlebars dist/client/app/plugins/pimPrototyper/forms/templates/

	-mkdir -p  dist/client/app/preferences/templates
	-cp src/client/app/preferences/templates/*.handlebars dist/client/app/preferences/templates/

clean:
	rm -rf dist
	rm -rf bundle

.PHONY: examples