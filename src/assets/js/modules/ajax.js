export function loadAjax(filePath) {
    return $.ajax({
        async: false,
        global: false,
        url: filePath
    }).responseJSON;
}

