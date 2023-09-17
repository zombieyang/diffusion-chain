export async function get(url: string): Promise<any> {
    var myHeaders = new Headers()
    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    }
    const res = (await fetch(url, requestOptions))
    console.log(res.status, url)

    const contentType = res.headers.get('Content-Type');
    
    if (contentType?.indexOf('json') != -1) {
        return res.json();

    } else {
        if (res.status == 200) {
            return res.arrayBuffer();

        } else {
            return res.text()
        }
    }
    
}
export async function postJSON(url: string, param: any): Promise<any> {
    var myHeaders = new Headers()
    myHeaders.set("Content-Type", "application/json;")
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(param),
    }
    const res = (await fetch(url, requestOptions))
    console.log(res.status, url)

    const contentType = res.headers.get('Content-Type');
    
    if (contentType?.indexOf('json') != -1) {
        return res.json();

    } else {
        if (res.status == 200) {
            return res.arrayBuffer();

        } else {
            return res.text()
        }
    }
}
export async function postForm(url: string, param: any): Promise<any> {
    const data = new FormData();
    Object.keys(param).forEach(key => {
        data.append(key, param[key]);
    })
    var requestOptions = {
        method: 'POST',
        body: data,
    }
    const res = (await fetch(url, requestOptions))
    console.log(res.status, url)

    const contentType = res.headers.get('Content-Type');
    
    if (contentType?.indexOf('json') != -1) {
        return res.json();

    } else {
        if (res.status == 200) {
            return res.arrayBuffer();

        } else {
            return res.text()
        }
    }
}