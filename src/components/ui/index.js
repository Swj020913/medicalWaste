import IconFont from './IconFont';
import Scrollbar from './Scrollbar';
import fieldsetLegend from './fieldsetLegend';
import orgTree from './orgTree';


const components = {
    IconFont,
    Scrollbar,
    fieldsetLegend,
    orgTree,
}

const install = (Vue, opts = {}) => {
    Object.keys(components).forEach((key) => { Vue.component(key, components[key]); });
};
export default install;