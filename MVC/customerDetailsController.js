const Customer = require("./customerDetailsModel");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check if user exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ Message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newCustomer = new Customer({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newCustomer.save();

    res.status(201).json({
      Message: "Successfully Signed Up",
      customerDetails: {
        id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        phoneNumber: newCustomer.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error during signUp:", error);
    res.status(500).json({ Message: error.message });
  }
};


const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingCustomer = await Customer.findOne({ email });
    if (!existingCustomer) {
      return res.status(400).json({ Message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingCustomer.password);
    if (!isMatch) {
      return res.status(400).json({ Message: "Invalid email or password" });
    }

    res.status(200).json({
      Message: "Login Successfully",
      loginDetails: {
        id: existingCustomer._id,
        email: existingCustomer.email,
        name: existingCustomer.name,
      },
    });
  } catch (error) {
    console.error("Error during signIn:", error);
    res.status(500).json({ Message: error.message });
  }
};

module.exports = { signIn, signUp };
