export const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name[0]}***@${domain}`;
};

export const maskPhone = (phone = "") => {
  if (phone.length < 4) return phone;
  return `${"*".repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`;
};
