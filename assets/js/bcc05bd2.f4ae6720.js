"use strict";(self.webpackChunkdcose=self.webpackChunkdcose||[]).push([[584],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),d=o,f=u["".concat(s,".").concat(d)]||u[d]||m[d]||a;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4690:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var r=n(7462),o=(n(7294),n(3905));const a={},i="5. Longest Palindromic Substring (\u6700\u957f\u56de\u6587\u5b57\u7b26\u4e32)",l={unversionedId:"LeetCode/Longest Palindromic Substring",id:"LeetCode/Longest Palindromic Substring",title:"5. Longest Palindromic Substring (\u6700\u957f\u56de\u6587\u5b57\u7b26\u4e32)",description:"\u68a6\u5f00\u59cb\u7684\u5730\u65b9 \ud83e\uddc0\ud83e\uddc0",source:"@site/docs/LeetCode/5. Longest Palindromic Substring.md",sourceDirName:"LeetCode",slug:"/LeetCode/Longest Palindromic Substring",permalink:"/docs/LeetCode/Longest Palindromic Substring",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/LeetCode/5. Longest Palindromic Substring.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"2. Add Two Numbers (\u4e24\u6570\u76f8\u52a0)",permalink:"/docs/LeetCode/Add Two Numbers"},next:{title:"2620. Counter (\u8ba1\u6570\u5668)",permalink:"/docs/LeetCode/Counter"}},s={},c=[{value:"\u89e3\u4e00",id:"\u89e3\u4e00",level:3}],p={toc:c},u="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"5-longest-palindromic-substring-\u6700\u957f\u56de\u6587\u5b57\u7b26\u4e32"},"5. Longest Palindromic Substring (\u6700\u957f\u56de\u6587\u5b57\u7b26\u4e32)"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("a",{parentName:"p",href:"https://www.acoier.com/2021/01/23/5.%20%E6%9C%80%E9%95%BF%E5%9B%9E%E6%96%87%E5%AD%90%E4%B8%B2%EF%BC%88%E4%B8%AD%E7%AD%89%EF%BC%89/"},"\u68a6\u5f00\u59cb\u7684\u5730\u65b9 \ud83e\uddc0\ud83e\uddc0")),(0,o.kt)("p",{parentName:"blockquote"},"\u96be\u5ea6\uff1a",(0,o.kt)("strong",{parentName:"p"},"\u4e2d\u7b49")),(0,o.kt)("p",{parentName:"blockquote"},"\u6807\u7b7e\uff1a\u5b57\u7b26\u4e32\u3001\u52a8\u6001\u89c4\u5212")),(0,o.kt)("h3",{id:"\u89e3\u4e00"},"\u89e3\u4e00"),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"\u4e3b\u8981\u7684\u601d\u60f3\u662f\uff1a\u4ee5\u4e00\u4e2a\u4e3a\u4e2d\u5fc3\uff0c\u5411\u4e24\u8fb9\u6269\u6563")),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5982\u679c\u5b57\u7b26\u4e32\u957f\u5ea6\u5c0f\u4e8e 2\uff0c\u76f4\u63a5\u8fd4\u56de\u539f\u5b57\u7b26\u4e32"),(0,o.kt)("li",{parentName:"ol"},"\u5b9a\u4e49\u4e24\u4e2a\u53d8\u91cf",(0,o.kt)("ol",{parentName:"li"},(0,o.kt)("li",{parentName:"ol"},"start \u5b58\u50a8\u5f53\u524d\u627e\u5230\u7684\u6700\u5927\u56de\u6587\u5b57\u7b26\u4e32\u7684\u8d77\u59cb\u4f4d\u7f6e"),(0,o.kt)("li",{parentName:"ol"},"maxLength \u8bb0\u5f55\u5b57\u7b26\u4e32\u7684\u957f\u5ea6"))),(0,o.kt)("li",{parentName:"ol"},"\u521b\u5efa\u4e00\u4e2a helper function",(0,o.kt)("ol",{parentName:"li"},(0,o.kt)("li",{parentName:"ol"},"\u5224\u65ad\u5de6\u8fb9\u548c\u53f3\u8fb9\u662f\u5426\u8d8a\u754c"),(0,o.kt)("li",{parentName:"ol"},"\u6700\u5de6\u8fb9\u7684\u5b57\u7b26\u662f\u5426\u7b49\u4e8e\u6700\u53f3\u8fb9\u7684\u5b57\u7b26"))),(0,o.kt)("li",{parentName:"ol"},"\u5224\u65ad\u662f\u5426\u9700\u8981\u66f4\u65b0\u56de\u6587\u5b57\u7b26\u4e32\u7684\u6700\u5927\u957f\u5ea6\u53ca\u5176\u8d77\u59cb\u4f4d\u7f6e",(0,o.kt)("ol",{parentName:"li"},(0,o.kt)("li",{parentName:"ol"},"left --"),(0,o.kt)("li",{parentName:"ol"},"right ++"),(0,o.kt)("li",{parentName:"ol"},"\u4e00\u76f4\u5faa\u73af\uff0c\u76f4\u5230\u4e0d\u6ee1\u8db3 helper function \u5185\u7684\u6761\u4ef6"))),(0,o.kt)("li",{parentName:"ol"},"\u904d\u5386\u5b57\u7b26\u4e32\uff0c\u6bcf\u4e2a\u4f4d\u7f6e\u8c03\u7528 helper function \u4e24\u904d",(0,o.kt)("ol",{parentName:"li"},(0,o.kt)("li",{parentName:"ol"},"\u7b2c\u4e00\u904d i - 1\uff0ci + 1 \uff08aba\uff09"),(0,o.kt)("li",{parentName:"ol"},"\u7b2c\u4e8c\u904d i\uff0ci + 1\uff08abba\uff09")))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"/**\n * @param {string} s\n * @return {string}\n */\nvar longestPalindrome = function (s) {\n    if (s.length < 2) {\n        return s;\n    }\n    let start = 0;\n    let maxLength = 1;\n\n    function expandAroundCenter(left, right) {\n        while (\n            // \u5de6\u8fb9\u754c\n            left >= 0 &&\n            // \u53f3\u8fb9\u754c\n            right < s.length &&\n            // \u6700\u5de6\u8fb9\u7684\u5b57\u7b26\u662f\u5426\u7b49\u4e8e\u6700\u53f3\u8fb9\u7684\u5b57\u7b26\n            s[left] === s[right]\n        ) {\n            if (right - left + 1 > maxLength) {\n                maxLength = right - left + 1;\n                start = left;\n            }\n            // \u5411\u5de6\u7ee7\u7eed\u6269\u6563\n            left--;\n            // \u5411\u53f3\u7ee7\u7eed\u6269\u6563\n            right++;\n        }\n    }\n\n    for (let i = 0; i < s.length; i++) {\n        expandAroundCenter(i - 1, i + 1);\n        expandAroundCenter(i, i + 1);\n    }\n    return s.substring(start, start + maxLength);\n};\n")))}m.isMDXComponent=!0}}]);