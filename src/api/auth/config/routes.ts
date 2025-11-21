export default [
  {
    method: "POST",
    path: "/register",
    handler: "user.register",
    config: { auth: false }, // publiczny endpoint
  },
];
