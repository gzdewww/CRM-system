const validateTodo = (value: string) => {
  value = value.trim();
  if (value.length < 1) {
    return "Это поле не может быть пустым";
  }
  if (value.length < 2) {
    return "Минимальная длина текста 2 символа";
  }
  if (value.length > 64) return "Максимальная длина текста 64 символа";
  return "";
};

export default validateTodo;
