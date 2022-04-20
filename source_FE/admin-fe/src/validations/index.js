export const password = (value) => {
  if (value.length < 8) {
    return (
      <p className=" text-red-500">Password must be at least 8 characters</p>
    );
  }
  if (!value.match(/\d/) || !value.match(/[A-Z]/)) {
    return (
      <p className=" text-red-500 mt-3">
        Password must contain at least 1 uppercase letter and 1 number
      </p>
    );
  }
};

export const username = (value) => {
  if (value.length < 5) {
    // return helpers.message("password must be at least 8 characters");
    return (
      <p className=" text-red-500">Username must be at least 5 characters</p>
    );
  }
};
