//1-
// Step - Generate a verification token with the user's ID
// const verificationToken = user.generateVerificationToken();
// // Step - Email the user a unique verification link
// const html = `use this URL :
// <br>
// ${verificationToken}
// <br>
//  to confirm your email.`;
// email.sendMail(req.body.email, html);
// -step
// userSchema.methods.generateVerificationToken = function () {
//   const user = this;
//   const verificationToken = jwt.sign(
//     { ID: user._id },
//     process.env.USER_VERIFICATION_TOKEN_SECRET,
//     { expiresIn: '10m' }
//   );
//   return verificationToken;
// };
// exports.verify = async (req, res) => {
//     const token = req.params.token;
//     // Check we have an id
//     if (!token) {
//       return res.status(422).send({
//         message: 'Missing Token',
//       });
//     }
//     // Step 1 -  Verify the token from the URL
//     let payload = null;
//     try {
//       payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
//     } catch (err) {
//       return res.status(500).send(err);
//     }
//     try {
//       // Step 2 - Find user with matching ID
//       const user = await User.findByIdAndUpdate(
//         { _id: payload.ID },
//         { verified: true }
//       );
//       if (!user) {
//         return res.status(404).send({
//           message: 'User does not  exists',
//         });
//       }
//       return res.status(200).send({
//         message: 'Account Verified',
//       });
//     } catch (err) {
//       return res.status(500).send(err);
//     }
//   };
///////////////////////////////////
////////////////////////////////////
////////////////////////////////////////////////////////
