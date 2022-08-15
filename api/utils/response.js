//configure http json response
const response = (res, err, data, code) => {
    return res.status(code).send({
        error: err,
        body: data
    })
};

export default response;