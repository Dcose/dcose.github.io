// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Mirai', // blog 标题
	tagline: '将来のない未来は、私の望みの未来ではありません', // 想说的话
	favicon: 'img/favicon.ico', // 书签图标

	// Set the production url of your site here
	url: 'https://dcose.github.io',

	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'Dcose', // Usually your GitHub org/user name.
	projectName: 'dcose', // Usually your repo name.
	deploymentBranch: 'gh-pages',

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'zh-Hans',
		locales: ['zh-Hans'],
	},

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			// Replace with your project's social card
			// image: 'img/docusaurus-social-card.jpg',
			navbar: {
				title: 'Mirai的记录',
				hideOnScroll: true,
				// logo: {
				// 	alt: 'My Site Logo',
				// 	src: 'img/logo.svg',
				// },
				items: [
					// {
					// 	type: 'docSidebar',
					// 	sidebarId: 'tutorialSidebar',
					// 	position: 'left',
					// 	label: 'Tutorial',
					// },
					// { to: '/blog', label: 'Blog', position: 'left' },
					// {
					// 	href: 'https://github.com/facebook/docusaurus',
					// 	label: 'GitHub',
					// 	position: 'right',
					// },
					{
						type: 'search',
						position: 'right',
					},
					{
						type: 'doc',
						docId: 'HTML',
						position: 'right',
						label: '正文',
					},
					{
						type: 'doc',
						docId: '📕 JavaScript/👻 this',
						position: 'right',
						label: 'JS',
					},
					{
						type: 'doc',
						docId: '💯 LeetCode/Two Sum',
						position: 'right',
						label: 'LC',
					},
					{
						href: 'https://github.com/Dcose',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			docs: {
				sidebar: {
					hideable: true,
				},
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
				defaultLanguage: 'javascript',
			},
			colorMode: {
				defaultMode: 'light',
				respectPrefersColorScheme: true,
			},
			algolia: {
				// The application ID provided by Algolia
				appId: '2NYTMXPUTT',
				// Public API key: it is safe to commit it
				apiKey: 'ce0c9b432370ce507835d83b97d214c1',
				indexName: 'dcoseio',
			},
		}),
};

module.exports = config;
