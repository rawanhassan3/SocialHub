 export function calculateAge(birthdateStr) {
  const birthDate = new Date(birthdateStr);

  if (isNaN(birthDate)) {
    throw new Error("Invalid birthdate format. Use YYYY-MM-DD or a valid date string.");
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
     today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}