const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  res.json({ name, email });
};

module.exports = { registerUser };

const getUser = async (req, res) => {};
