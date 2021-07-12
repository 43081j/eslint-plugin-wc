declare module 'validate-element-name' {
  const validate: (
    name: string
  ) => {
    isValid: boolean;
    message: string;
  };
  export default validate;
}
