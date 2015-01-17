/*global require, module, __dirname*/
var imageExts = [".jpg", ".jpeg", ".png"],
    filesFilter = [".pvs", ".tex", ".txt", ".i", ".json", ".emdl"].concat(imageExts);

module.exports = filesFilter;