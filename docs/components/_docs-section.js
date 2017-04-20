const template = `
<div class="docs-section">
    <div class="docs-desc markdown-body">
        <slot name="desc"></slot>
    </div>
    <slot name="code">
</div>
`;

const docsSection = Vue.extend({
  template: template,
})

Vue.component('docsSection', docsSection)

export default docsSection
