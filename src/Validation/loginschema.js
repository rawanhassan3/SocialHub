import { regex } from '../Validation/regex';

import * as zod from "zod"
export const schema = zod.object({

   
    email:zod.string()
    .nonempty("Email is Required")
    .regex(regex.email, "Enter Valid Email!"),
    password: zod.string()
    .nonempty("password is required")
    .regex(regex.password, 'Minimum eight characters, at least one letter, one number and one special character'),
    
  })