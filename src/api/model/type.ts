interface HttpMethod {
    label: string
    value: string
}

interface HttpContentType {
    label: string
    value: string
}

const httpMethod = [
    {
        label: 'GET',
        value: 'GET'
    },
    {
        label: 'POST',
        value: 'POST'
    },
    {
        label: 'DELETE',
        value: 'DELETE'
    },
    {
        label: 'PUT',
        value: 'PUT'
    }
]

const httpContentType = [
    {
        label: 'JSON',
        value: 'JSON'
    },
    {
        label: 'FORM',
        value: 'FORM'
    },
]

export {
    HttpMethod, HttpContentType,
    httpMethod, httpContentType
}
