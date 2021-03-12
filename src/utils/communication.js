const httpRequest = {
    post: (xhr, path, data) => {
        xhr.open("post", path, true)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data))
    }
}

export default httpRequest