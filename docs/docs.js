!function(e,o){function t(e){var o="";return 0==e.length?"":(o=e.replace(/&/g,"&gt;"),o=o.replace(/</g,"&lt;"),o=o.replace(/>/g,"&gt;"),o=o.replace(/ /g,"&nbsp;"),o=o.replace(/\'/g,"&#39;"),o=o.replace(/\"/g,"&quot;"),o=o.replace(/\n/g,"<br>"))}function n(e){return e=e.trim(),e=html_beautify(e,{indent_size:2}),e=e.replace(/=""/g,""),t(e)}function c(e){var o=document.createElement("div");return o.innerHTML=e,e=o.textContent.trim(),e=js_beautify(e,{indent_size:2})}window.c5a9b86a={};var r={},i={},d=Vue.extend({template:'\n<div class="docs-panel">\n    <div class="docs-panel-content">\n        <slot></slot>\n    </div>\n    <au-button-group>\n        <au-button type="link" v-show="!show" @click="toggle" block icon="toggle-down">展开代码</au-button>\n        <au-button type="link" v-show="show" @click="toggle" block icon="toggle-up">收起代码</au-button>\n    </au-button-group>\n    <div class="docs-code" v-show="show">\n        <pre class="html" v-show="!!sourceCode"><code>{{sourceCode}}</code></pre>\n        <pre class="js" v-show="!!sourceJSCode"><code>{{sourceJSCode}}</code></pre>\n    </div>\n</div>\n',props:["codeId","code","jscode"],data:function(){return{show:!1}},beforeCreate:function(){document.querySelectorAll("demo").forEach(function(e){if(e.hasAttribute("code-id")){var o=e.getAttribute("code-id"),t=e.querySelector("template[type=au-demo]");t&&(i[o]=t.innerHTML,t.remove()),r[o]=e.innerHTML}})},mounted:function(){this.updateCode()},methods:{toggle:function(){this.show=!this.show},updateCode:function(){if(this.sourceCode){var e=document.createElement("code");e.innerHTML=n(this.sourceCode);this.$el.querySelector("pre.html code").replaceWith(e),hljs.highlightBlock(e)}if(this.sourceJSCode){var o=document.createElement("code");o.innerHTML=c(this.sourceJSCode);this.$el.querySelector("pre.js code").replaceWith(o),hljs.highlightBlock(o)}}},computed:{sourceCode:function(){return this.code||r[this.codeId]},sourceJSCode:function(){return this.jscode||i[this.codeId]}},watch:{code:function(e){var o=this;Vue.nextTick(function(e){return o.updateCode()})}}});Vue.component("demo",d),window.c5a9b86a.__esModule=!0,window.c5a9b86a.default=d}(),function(e,o){window.eafbfa8b={},window.c5a9b86a}();