const validate = (value: string) => {
  if (value.trim().length < 1) throw new Error("Это поле не может быть пустым");
  if (value.trim().length < 2)
    throw new Error("Минимальная длина текста 2 символа");
  if (value.trim().length > 64)
    throw new Error("Максимальная длина текста 64 символа");
  return true;
};

export default validate;
