({
	optimize: "uglify",
	baseUrl: "../public/pvsioweb/app",
 	paths: {
        "ace": "../lib/ace",
        "d3": "../lib/d3",
        "pvsioweb": "prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib",
		"almond": "../../../dist/almond"
    },
	wrap: {
		startFile: "./start.frag",
		endFile: "./end.frag"
	},
	out: "pvsioweb-client.js",
	include: ["PVSioWebClient"],
	name: "almond"
})