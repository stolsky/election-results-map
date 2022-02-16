
import {hasProperty} from "../../lib/jst/native/typecheck.js";


const replace_keys = function (data, ...keys) {

    keys.forEach(key => {
        key = key.split(":");
        const props = key[0].split(".");

        let obj = data;
        props.forEach(current_prop => {
            obj = obj[current_prop];
            if (obj instanceof Array) {
                console.log(obj);
            }
        });
    });

    // if (keys instanceof Array) {
    //     keys.forEach(key => {
    //         const [old_key, new_key] = key.split(":");
    //         data.forEach(dataset => {
    //             if (hasProperty(dataset, old_key)) {
    //                 dataset[new_key] = dataset[old_key];
    //                 delete dataset[old_key];
    //             }
    //         });
    //     });
    // }

};


export {
    replace_keys
};
