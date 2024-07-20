const validate = (schema) => async (req, res, next) => {
  try {
    const value = (() => {
      switch (req.method) {
        case "GET":
          return req.query;
        case "DELETE":
          return req.query;
        case "POST":
          return req.body;
        case "PUT":
          return req.body;
        default:
          return req.body;
      }
    })();
    await schema.validate(value);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default validate;
