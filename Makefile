all:
	npm install
	make build

pvsioweb: build

compile:
	npm run build

build:
	npm run build
	-cp src/client/*.html dist/client
	-cp src/client/*.ico dist/client
	-cp src/client/*.json dist/client
	-cp -r src/client/css dist/client
	-cp src/client/app/plugins/graphbuilder/*.css dist/client/app/plugins/graphbuilder
	-cd dist/client && npm install

clean:
	rm -rf dist