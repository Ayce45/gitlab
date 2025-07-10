import fetch from "node-fetch";
import * as sass from "sass";
import fs from "fs";

const userStyleComment = `/* ==UserStyle==
@name         Dracula for GitLab
@description  A dark theme for GitLab
@namespace    github.com/dracula/gitlab
@version      2.0.0
@homepageURL  https://draculatheme.com/gitlab
@supportURL   https://github.com/dracula/gitlab/issues
@license      MIT
@preprocessor stylus
==/UserStyle== */
`;

(async () => {
	const highlightDracula = fs.readFileSync("highlight-dracula.scss", "utf8");

	const scssBody = `
body {
	.syntax-theme label:nth-child(1) {
		span {
			text-decoration: line-through;
		}

		.preview {
			height: 100px;
			width: 160px;
			border-radius: 4px;
			background-image: url(https://draculatheme.com/images/hero/dracula-icon.svg);
			background-size: contain;
			background-repeat: no-repeat;
			background-position: center;
			
			img {
				display: none;
			}
		}

		span:after {
			position: absolute;
			content: "Dracula";
			margin-left: 4px;
			word-spacing: normal;
			letter-spacing: normal;
		}
	}
}
`;

	const scss = highlightDracula + scssBody;

	try {
		const compressedResult = sass.compileString(scss, {
			style: "compressed"
		});

		let compressedCss = compressedResult.css.trim();

		fs.writeFileSync("../dracula.css", compressedCss);

		fs.writeFileSync(
			"../dracula.user.css",
			userStyleComment +
				'@-moz-document domain("gitlab.com"){' +
				compressedCss +
				"}",
		);
	} catch (err) {
		process.exit(1);
	}
})();
