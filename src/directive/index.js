import directive from './directives'

const importDirective = Vue => {
  /**
    * modalDrag
    * 指令用法：
    *  - <div v-modal-drag></div>
   */
  Vue.directive("modal-drag", directive.modalDrag);
}

export default importDirective
