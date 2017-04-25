const template = `
<div class="docs-panel">
    <div class="docs-panel-content">
        <slot></slot>
    </div>
    <au-button-group>
        <au-button type="link" v-show="!show" @click="toggle" block icon="toggle-down">展开代码</au-button>
        <au-button type="link" v-show="show" @click="toggle" block icon="toggle-up">收起代码</au-button>
    </au-button-group>
    <div class="docs-code" v-show="show">
        <pre class="html" v-show="!!sourceCode"><code>{{sourceCode}}</code></pre>
        <pre class="js" v-show="!!sourceJSCode"><code>{{sourceJSCode}}</code></pre>
    </div>
</div>
`;

function htmlEncode(str){
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&gt;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br>");
  return s;
}

function convertHtml(html) {
    html = html.trim();
    html = html_beautify(html, {
      indent_size: 2
    });
    html = html.replace(/=""/g, '');
    return htmlEncode(html);
}

function convertJS(js){
    const div = document.createElement('div');
    div.innerHTML = js;
    js = div.textContent.trim();
    js = js_beautify(js, {
      indent_size: 2
    });
    return js
  }

const Codes = {};
const JSCodes = {};

const demo = Vue.extend({
    template: template,
    props: ['codeId', 'code', 'jscode'],
    data(){
        return {show: false}
    },
    beforeCreate(){
        var eles = document.querySelectorAll('demo');
        eles.forEach(_=>{
            if(_.hasAttribute('code-id')){
                let codeId = _.getAttribute('code-id');
                let jsCodeEle = _.querySelector('template[type=au-demo]');
                if(jsCodeEle){
                    JSCodes[codeId] = jsCodeEle.innerHTML;
                    jsCodeEle.remove();
                }
                Codes[codeId] = _.innerHTML;
            }
        });
    },
    mounted(){
        this.updateCode();
    },
    methods: {
        toggle(){
            this.show = !this.show;
        },
        updateCode(){
            // 处理html
            if(this.sourceCode){
                let newCode = document.createElement('code');
                newCode.innerHTML = convertHtml(this.sourceCode);
                let codeEle = this.$el.querySelector('pre.html code');
                codeEle.replaceWith(newCode);
                hljs.highlightBlock(newCode);
            }
            // 处理js
            if(this.sourceJSCode){
                let newJSCode = document.createElement('code');
                newJSCode.innerHTML = convertJS(this.sourceJSCode);
                let jscodeEle = this.$el.querySelector('pre.js code');
                jscodeEle.replaceWith(newJSCode);
                hljs.highlightBlock(newJSCode);
            }
        }
    },
    computed: {
        sourceCode(){return this.code || Codes[this.codeId];},
        sourceJSCode(){return this.jscode || JSCodes[this.codeId];}
    },
    watch: {
        code(val){
            Vue.nextTick(_=>this.updateCode());
        }

    }
})

Vue.component('demo', demo)

export default demo
