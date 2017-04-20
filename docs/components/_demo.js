const template = `
<div class="docs-panel">
    <div class="docs-panel-content">
        <slot></slot>
    </div>
    <au-button-group>
        <au-button type="primary"  v-show="!show" @click="toggle">展开代码</au-button>
        <au-button type="primary"  v-show="show" @click="toggle">收起代码</au-button>
    </au-button-group>
    <div class="docs-code" v-show="show">
        <pre><code>{{sourceCode}}</code></pre>
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

function convert(html) {
    html = html.trim();
    html = html_beautify(html, {
      indent_size: 2
    });
    html = html.replace(/=""/g, '');
    return htmlEncode(html);
}

const Codes = {};

const demo = Vue.extend({
    template: template,
    props: ['codeId', 'code'],
    data(){
        return {show: false}
    },
    beforeCreate(){
        var eles = document.querySelectorAll('demo');
        eles.forEach(_=>{
            if(_.hasAttribute('code-id')){
                Codes[_.getAttribute('code-id')] = _.innerHTML;
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
            let newCode = document.createElement('code');
            let codeEle = this.$el.querySelector('code');
            newCode.innerHTML = convert(this.sourceCode);
            codeEle.replaceWith(newCode);
            hljs.highlightBlock(newCode);
        }
    },
    computed: {
        sourceCode(){return this.code || Codes[this.codeId];}
    },
    watch: {
        code(val){
            Vue.nextTick(_=>this.updateCode());
        }

    }
})

Vue.component('demo', demo)

export default demo
