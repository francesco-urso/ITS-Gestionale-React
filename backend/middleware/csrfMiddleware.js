const csrfProtection = (req, res, next) => {
    const csrfToken = req.headers["x-csrf-token"];
    if (!csrfToken || csrfToken !== process.env.CSRF_SECRET) {
        return res.status(403).json({ message: "CSRF Token non valido" });
    }
    next();
};

module.exports = csrfProtection;