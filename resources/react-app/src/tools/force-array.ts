const forceArray = (value: any) => (Array.isArray(value) ? value : [value]);

export default forceArray;
