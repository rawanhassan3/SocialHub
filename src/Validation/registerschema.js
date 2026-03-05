import { regex } from '../Validation/regex';
import { calculateAge } from '../helpers/date';
import * as zod from "zod"
export const schema = zod.object({

    name: zod.string()
    .nonempty("Name is Required")
    .min(2,'Name must be at least two characters!')
    .max(50, 'Name must be at most 50 characters!'),
    email:zod.string()
    .nonempty("Email is Required")
    .regex(regex.email, "Enter Valid Email!"),
    password: zod.string()
    .nonempty("password is required")
    .regex(regex.password, 'Minimum eight characters, at least one letter, one number and one special character'),
    rePassword: zod.string()
    .nonempty("password is required"),
    dateOfBirth : zod.string()
    .nonempty('Birth Date is Required')
    .refine((date)=> calculateAge(date)>= 18 , "age must be more than or equal to 18"),
    gender: zod.string()
    .nonempty("Gender is Required")
    .regex(/^(male|female)$/, "gender must be one of (female| male)")
  }).refine((data)=>data.password == data.rePassword,{message:"password and confirm must be the same ", path:["rePassword"]})