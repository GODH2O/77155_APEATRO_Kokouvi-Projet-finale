module.exports = function (rolesAutorises) {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
};
