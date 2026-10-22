export const VALIDATION_MESSAGES = {
  string: (field: string) => `${field} deve ser um texto.`,
  required: (field: string) => `${field} é obrigatório.`,
  maxLength: (field: string, max: number) =>
    `${field} deve ter no máximo ${max} caracteres.`,
  validDate: (field: string) => `${field} deve ser uma data válida.`,
  validEnum: (field: string) => `${field} informado não é válido.`,
  array: (field: string) => `${field} deve ser uma lista.`,
  minArraySize: (field: string, min: number) =>
    `${field} deve conter pelo menos ${min} ${min === 1 ? 'item' : 'itens'}.`,
  validEmail: (field: string) => `${field} deve ser um email válido.`,
  propertyNotAllowed: (property: string) =>
    `O campo ${property} não é permitido.`,
};
