var fs = require("fs");
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});


console.log("loading template...");
fs.readFile("public/template.html", "utf-8", (err, template) => {
    if (err) { console.log(err) }

	console.log("loading content...");
	fs.readFile("new_content.md", "utf-8", (err, content) => {
		if (err) { console.log(err) }

		console.log("converting markdown to html...");
		var html_content = md.render(content);

		console.log("inserting html content into html template...");
		result=template.replace("%content%",html_content);

		console.log("saving Result:");
		console.log (result);
		fs.writeFile("public/result.html", result, (err) => {
		  if (err) console.log(err);
		  console.log("successfully written to file public/result.html");
		});
	});
});

