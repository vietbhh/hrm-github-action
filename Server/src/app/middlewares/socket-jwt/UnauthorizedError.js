export class UnauthorizedError extends Error {
  constructor(code, error) {
    super(error.message)
    this.name = "UnauthorizedError"
    this.inner = error
    this.data = {
      message: this.message,
      code,
      type: "UnauthorizedError"
    }
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
export const isUnauthorizedError = (error) => {
  return error.data.type === "UnauthorizedError"
}
