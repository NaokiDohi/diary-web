class validate {
  val: string
  field: string
  errors: string[]
  error: string
  isNullable: boolean

  constructor(val: string, field: string = '') {
    this.val = val
    this.field = field
    this.errors = []
    this.error = ''
    this.isNullable = false
  }

  required = (msg = 'This field is required!!') => {
    if (this.val == '') this.setError(0, msg)
    else this.setError(0, '')
    this.checkAndSetError()
    return this
  }

  lenValidator = (
    min: number = 3,
    max: number = 16,
    msg = `${this.field} length should be minimum ${min} characters and maximum ${max} chracters`
  ) => {
    if (this.val.length < min || this.val.length > max) this.setError(1, msg)
    else this.setError(1, '')
    this.checkAndSetError()
    return this
  }

  isEmail = (msg = 'Incorrect email format!!') => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.val))
      this.setError(2, '')
    else this.setError(2, msg)
    this.checkAndSetError()
    return this
  }

  isString = (msg = `Invalid input format for ${this.field}!!`) => {
    if (typeof this.val === 'string') this.setError(3, '')
    else this.setError(3, msg)
    this.checkAndSetError()
    return this
  }

  isNumber = (msg = 'Incorrect number format!!') => {
    if (/^[0-9]+$/.test(this.val)) this.setError(4, '')
    else this.setError(4, msg)
    this.checkAndSetError()
    return this
  }

  isPhone = (
    msg = 'Incorrect phone number format!! Use format +911234567890'
  ) => {
    if (/^\+{0,1}[0-9]+$/.test(this.val.replace(' ', ''))) this.setError(5, '')
    else this.setError(5, msg)
    this.checkAndSetError()
    return this
  }

  checkAndSetError = () => {
    let err = this.errors.filter((item) => item != '')
    if (this.isNullable) {
      this.error = ''
      return
    }
    this.error = err.length > 0 ? err[0] : ''
    // console.log('error', this.error)
  }

  nullable = () => {
    if (this.val == '' || !this.val) {
      this.isNullable = true
      // console.log(this.isNullable)
    }
    return this
  }

  setError = (key: number, msg: string) => {
    this.errors[key] = msg
  }
}
export default validate
