require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createOrUpdateAdmin = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("ERROR: MONGO_URI is not defined in backend/.env");
    process.exit(1);
  }

  const email = process.argv[2] || "admin@servicedeskpro.com";
  const password = process.argv[3] || "Admin@123456";
  const name = process.argv[4] || "System Admin";

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.role = "System Admin";
      await user.save();
      console.log(`\nSUCCESS: Existing user updated to System Admin!`);
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "System Admin",
      });
      console.log(`\nSUCCESS: New System Admin user created!`);
    }

    console.log(`-----------------------------------`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${user.role}`);
    console.log(`-----------------------------------`);
    console.log(`You can now log in at https://service-desk-umber.vercel.app/login\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createOrUpdateAdmin();
