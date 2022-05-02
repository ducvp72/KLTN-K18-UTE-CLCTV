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

export const emailValidate = (value) => {
  if (
    !value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return <p className=" text-red-500">invalid Email</p>;
  }
};
