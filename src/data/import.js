/* global Papa */

import { hasProperty, isFunction, isString } from "../../lib/jst/native/typecheck.js";


const fetch_csv = async (url, mode, options) => {

    const response = await fetch(url, { mode });
    let { delimiter, comments, transformHeader } = options;

    if (!isString(delimiter)) {
        delimiter = ",";
    }

    if (!isString(comments)) {
        delimiter = "#";
    }

    let header = true;
    if (!isFunction(transformHeader)) {
        header = false;
        transformHeader = null;
    }

    return response.blob().then((file) => new Promise((resolve) => {

        Papa.parse(new File([file], "temp"), {
            delimiter,
            comments,
            header,
            transformHeader,
            complete: (results) => {
                if (results.meta.aborted) {
                    console.warn(`Error loading ${file.name}`);
                } else {
                    resolve(results.data);
                }
            },
            skipEmptyLines: true
        });

    }));

};

const fetch_json = async (url, mode) => {
    const response = await fetch(url, { mode });
    return response.json();
};

const load_files = async (...files) => {
    if (files instanceof Array) {
        const files_to_be_loaded = [];
        files.forEach((file) => {

            if (hasProperty(file, "name") && isString(file.name)) {

                let mode = "same-origin";
                if (file.name.startsWith("http")) {
                    mode = "cors";
                }

                if (file.name.endsWith(".json")) {
                    files_to_be_loaded.push(
                        fetch_json(file.name, mode)
                    );
                } else if (file.name.endsWith(".csv")) {
                    files_to_be_loaded.push(
                        fetch_csv(
                            file.name,
                            mode,
                            {
                                delimiter: file.delimiter || null,
                                comments: file.comments || null,
                                transformHeader: file.transformHeader || null
                            }
                        )
                    );
                }

            }
        });
        return Promise.all(files_to_be_loaded);
    }

    return null;
};


export default load_files;
