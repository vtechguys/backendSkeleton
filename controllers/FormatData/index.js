/*
File contains dto for all response in application
*/

function formatDataProfile(data) {
  const formatData = {
    username: data.username,
    email: data.email
  };
  return formatData;
}

module.exports = {
  formatDataProfile
};
