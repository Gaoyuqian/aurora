const template = `
<div class="docs-panel">
    <div class="docs-panel-content">
        <slot></slot>
    </div>
    <div class="docs-code">
        <pre><code>{{code}}</code></pre>
    </div>
</div>
`;

const Codes = {};

const demo = Vue.extend({
    template: template,
    props: {
        codeId: '',
    },
    data(){
        return {code: ''}
    },
    beforeCreate(){
        var eles = document.querySelectorAll('demo');
        eles.forEach(_=>{
            if(_.hasAttribute('code-id')){
                Codes[_.getAttribute('code-id')] = _.innerHTML;
            }
        });
    },
    beforeMount(){
        this.code = Codes[this.codeId];
    },
    mounted() {
        hljs.highlightBlock(this.$el.querySelector('code'))
    }
})

Vue.component('demo', demo)

export default demo
