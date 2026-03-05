import { regex } from '../Validation/regex';
import { calculateAge } from '../helpers/date';


export function getFormValidation(watch) {
    return {
        name: {
            required: { value: true, message: 'Name is Required' },
            minLength: { value: 2, message: 'Name must be at least two characters!' },
            maxLength: { value: 50, message: 'Name must be at most 50 characters!' },

        },
        email: {
            required: { value: true, message: 'Email is Required' },
            pattern: { value: regex.email, message: "Enter Valid Email!" }
        },
        password: {
            required: { value: true, message: 'password is Required' },
            pattern: { value: regex.password, message: 'Minimum eight characters, at least one letter, one number and one special character' }
        },
        rePassword: {
            required: { value: true, message: 'confirm password is Required' },
            validate: (value) => value == watch("password") || "password and cobfirm password must be the same"
        },
        dateOfBirth: {
            required: { value: true, message: 'Birth Date is Required' },
            validate: (date) => {
                return calculateAge(date) >= 18 || " age must be more than or equal to 18"
            }
        },
        gender: {
             required:{ value: true, message:'Gender is Required'},
             validate:(gender)=> gender == "male" || gender == "female" || "gender must be one of (female| male)"
        }
    }
}