function generatePassword(length = 16, options = { 
  numbers: true, 
  symbols: true, 
  uppercase: true 
}) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let charset = lowercase;
  if (options.numbers) charset += numbers;
  if (options.symbols) charset += symbols;
  if (options.uppercase) charset += uppercase;

  let password = "";
  for (let i = 0; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

module.exports = { generatePassword };
