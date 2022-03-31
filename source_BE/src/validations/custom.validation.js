const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[A-Z]/)) {
    return helpers.message('password must contain at least 1 uppercase letter and 1 number');
  }
  return value;
};

const subname = (value, helpers) => {
  if (value.length < 5) {
    return helpers.message('subname must be at least 5 characters');
  }
  if (!value.match(/^[a-z0-9]+[a-z0-9.]+[a-z0-9]+$/)) {
    return helpers.message(
      'subname must be lowcase include `.`, start with [a-z] and in ENG format ex: subname1.example ([a-z][a-z or 0-9].[a-z or 0-9])'
    );
  }

  return value;
};

const getAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }
  return age;
};

const phone = (numbSring, helpers) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  const regexPhoneNumber = /^((\+)84|0)[1-9](\d{2}){4}$/;
  if (!numbSring.match(regexPhoneNumber)) {
    return helpers.message('Phone not Invalid !');
  }
  return numbSring;
};

const birthday = (value, helper) => {
  if (getAge(value) < 13) {
    return helper.message('Age must be greater than  or equal to 13');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  birthday,
  phone,
  subname,
};
