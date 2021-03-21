exports.handler = (event, context, callback) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: { up: true },
  }
}
