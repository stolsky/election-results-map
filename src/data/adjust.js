
import {hasProperty} from "../../lib/jst/native/typecheck.js";


const replace_keys = function (data, ...keys) {
    // TODO deep search object?
    if (keys instanceof Array) {
        keys.forEach(key => {
            const [old_key, new_key] = key.split(":");
            data.forEach(dataset => {
                if (hasProperty(dataset, old_key)) {
                    dataset[new_key] = dataset[old_key];
                    delete dataset[old_key];
                }
            });
        });
    }

    return data;
};


export {
    replace_keys
};
