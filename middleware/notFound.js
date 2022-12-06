const notFoundMiddleware = (req, res) => {
  res.status(404).json({ msg: 'Roue did not exists' });
};
export default notFoundMiddleware;
