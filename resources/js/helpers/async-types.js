const asyncTypes = (action) => ({
  [`${action}`]: `${action}`,
  [`${action}_SUCCESS`]: `${action}_SUCCESS`,
  [`${action}_FAIL`]: `${action}_FAIL`,
});

export default asyncTypes;
