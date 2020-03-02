"use strict";

const registerUrls = {
  simple: {
    "/": [""],
    "/auth/": [
      "login",
      "register",
      "attempt-forgot-password",
      "reset-forgot-password",
      "email-verification"
    ]
  },
  auth: {
    "/": ["web-index"],
    "/auth/": [],
    "/profile/": ["fetch-profile", "update-profile"],
    "/role/": ["fetch-right-for-this-role"]
  },
  ALL_ROLES: ["superadmin", "admin", "moderator", "seller", "user", "guest"]
};

module.exports = registerUrls;
// Dont include in index.js config
