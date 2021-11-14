all:
	npm install
	make build
	make webpack
	make devel

audit:
	-npm audit fix

pvsioweb: build

compile:
	npm run build

build:
	make compile
	make copy
	make webpack

webpack:
	npm run webpack-builder
	npm run webpack-pvsioweb

widgetLibDials:
	# NOTE: need to run build to make sure the js files use commonjs (devel uses UMD), otherwise webpack will complain that the dependencies cannot be statically extracted
	make build
	npm run webpack-widgetLibDials

# devel is useful for debugging purposes -- js source files are not compressed by webpack/babel
devel:
	npm run devel
	make copy

copy:
	rsync src/client/*.html dist/client
	rsync src/client/*.ico dist/client
	rsync src/client/*.json dist/client
	make examples
	-cd dist/client && npm install

examples:
	rsync -av --exclude='*.ts' src/examples dist/

clean: clean-bundle
	rm -rf dist

clean-bundle:
	rm -rf bundle

.PHONY: examples