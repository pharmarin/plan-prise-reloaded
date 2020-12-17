import { useState } from 'react';

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return { forceUpdate: () => setValue((value) => ++value), updater: value };
};

export default useForceUpdate;
